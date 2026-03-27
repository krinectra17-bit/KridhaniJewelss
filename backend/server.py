from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime, timezone, timedelta
from bson import ObjectId
import bcrypt
import jwt
import secrets

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

JWT_ALGORITHM = "HS256"

# ============= AUTH HELPERS =============

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

def get_jwt_secret() -> str:
    return os.environ["JWT_SECRET"]

def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=24),
        "type": "access"
    }
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)

async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])}, {"password_hash": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        user["_id"] = str(user["_id"])
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ============= MODELS =============

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str = Field(alias="_id")
    email: str
    name: str
    role: str

class ProductCreate(BaseModel):
    name: str
    category: str
    price: float
    image: str
    description: str
    isBestseller: bool = False
    isTrending: bool = False
    stock: int = 100

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    image: Optional[str] = None
    description: Optional[str] = None
    isBestseller: Optional[bool] = None
    isTrending: Optional[bool] = None
    stock: Optional[int] = None

class ProductResponse(BaseModel):
    id: str
    name: str
    category: str
    price: float
    image: str
    description: str
    isBestseller: bool = False
    isTrending: bool = False
    stock: int = 100

class OrderItem(BaseModel):
    productId: str
    productName: str
    quantity: int
    price: float

class OrderCreate(BaseModel):
    customerName: str
    customerPhone: str
    deliveryAddress: str
    paymentMethod: str
    items: List[OrderItem]
    totalAmount: float

class OrderResponse(BaseModel):
    orderId: str
    message: str

# ============= AUTH ROUTES =============

@api_router.post("/auth/login")
async def login(credentials: LoginRequest, response: Response):
    email = credentials.email.lower()
    user = await db.users.find_one({"email": email})
    
    if not user or not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    access_token = create_access_token(str(user["_id"]), user["email"])
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=86400,
        path="/"
    )
    
    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "name": user["name"],
        "role": user["role"]
    }

@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie(key="access_token", path="/")
    return {"message": "Logged out successfully"}

@api_router.get("/auth/me")
async def get_me(user: dict = Depends(get_current_user)):
    return user

# ============= PRODUCT ROUTES =============

@api_router.get("/products", response_model=List[ProductResponse])
async def get_products():
    products = await db.products.find({}, {"_id": 1, "name": 1, "category": 1, "price": 1, "image": 1, "description": 1, "isBestseller": 1, "isTrending": 1, "stock": 1}).to_list(1000)
    return [{**p, "id": str(p["_id"]), "_id": str(p["_id"])} for p in products]

@api_router.get("/products/{product_id}", response_model=ProductResponse)
async def get_product(product_id: str):
    try:
        product = await db.products.find_one({"_id": ObjectId(product_id)})
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        product["id"] = str(product["_id"])
        return product
    except:
        raise HTTPException(status_code=404, detail="Product not found")

@api_router.post("/products", response_model=ProductResponse, status_code=201)
async def create_product(product: ProductCreate, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    product_dict = product.model_dump()
    product_dict["createdAt"] = datetime.now(timezone.utc).isoformat()
    result = await db.products.insert_one(product_dict)
    product_dict["id"] = str(result.inserted_id)
    return product_dict

@api_router.put("/products/{product_id}", response_model=ProductResponse)
async def update_product(product_id: str, product_update: ProductUpdate, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    try:
        update_data = {k: v for k, v in product_update.model_dump().items() if v is not None}
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        result = await db.products.find_one_and_update(
            {"_id": ObjectId(product_id)},
            {"$set": update_data},
            return_document=True
        )
        if not result:
            raise HTTPException(status_code=404, detail="Product not found")
        result["id"] = str(result["_id"])
        return result
    except HTTPException:
        raise
    except:
        raise HTTPException(status_code=404, detail="Product not found")

@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    try:
        result = await db.products.delete_one({"_id": ObjectId(product_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Product not found")
        return {"message": "Product deleted successfully"}
    except HTTPException:
        raise
    except:
        raise HTTPException(status_code=404, detail="Product not found")

# ============= ORDER ROUTES =============

def send_order_notification(order_data: dict):
    """Send order notification via email - placeholder for now"""
    try:
        sendgrid_key = os.environ.get("SENDGRID_API_KEY")
        if not sendgrid_key:
            print("\n" + "="*60)
            print("NEW ORDER RECEIVED!")
            print("="*60)
            print(f"Order ID: {order_data['orderId']}")
            print(f"Customer: {order_data['customerName']}")
            print(f"Phone: {order_data['customerPhone']}")
            print(f"Address: {order_data['deliveryAddress']}")
            print(f"Payment: {order_data['paymentMethod']}")
            print(f"Total: ₹{order_data['totalAmount']}")
            print("\nItems:")
            for item in order_data['items']:
                print(f"  - {item['productName']} x{item['quantity']} @ ₹{item['price']}")
            print("="*60 + "\n")
            return
        
        # If SendGrid is configured, send email
        from sendgrid import SendGridAPIClient
        from sendgrid.helpers.mail import Mail
        
        items_html = "".join([
            f"<tr><td>{item['productName']}</td><td>{item['quantity']}</td><td>₹{item['price']}</td><td>₹{item['price'] * item['quantity']}</td></tr>"
            for item in order_data['items']
        ])
        
        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #E8A0A8;">New Order Received!</h2>
            <p><strong>Order ID:</strong> {order_data['orderId']}</p>
            <h3>Customer Details:</h3>
            <p><strong>Name:</strong> {order_data['customerName']}</p>
            <p><strong>Phone:</strong> {order_data['customerPhone']}</p>
            <p><strong>Address:</strong> {order_data['deliveryAddress']}</p>
            <p><strong>Payment Method:</strong> {order_data['paymentMethod']}</p>
            <h3>Order Items:</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background-color: #FFF9FA;">
                        <th style="padding: 8px; border: 1px solid #F5E6E8;">Product</th>
                        <th style="padding: 8px; border: 1px solid #F5E6E8;">Qty</th>
                        <th style="padding: 8px; border: 1px solid #F5E6E8;">Price</th>
                        <th style="padding: 8px; border: 1px solid #F5E6E8;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {items_html}
                </tbody>
            </table>
            <h3 style="color: #E8A0A8; margin-top: 20px;">Total Amount: ₹{order_data['totalAmount']}</h3>
        </body>
        </html>
        """
        
        message = Mail(
            from_email=os.environ.get('SENDER_EMAIL'),
            to_emails=os.environ.get('ADMIN_EMAIL'),
            subject=f"New Order #{order_data['orderId']}",
            html_content=html_content
        )
        
        sg = SendGridAPIClient(sendgrid_key)
        sg.send(message)
        print(f"Order notification email sent for order {order_data['orderId']}")
    except Exception as e:
        print(f"Failed to send order notification: {str(e)}")

@api_router.post("/orders", response_model=OrderResponse)
async def create_order(order: OrderCreate):
    order_dict = order.model_dump()
    order_id = f"KJ{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}"
    order_dict["orderId"] = order_id
    order_dict["createdAt"] = datetime.now(timezone.utc).isoformat()
    order_dict["status"] = "pending"
    
    await db.orders.insert_one(order_dict)
    
    # Send notification
    send_order_notification(order_dict)
    
    return {
        "orderId": order_id,
        "message": "Order placed successfully"
    }

@api_router.get("/orders")
async def get_orders(user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    orders = await db.orders.find({}, {"_id": 0}).sort("createdAt", -1).to_list(1000)
    return orders

# ============= CATEGORIES =============

@api_router.get("/categories")
async def get_categories():
    categories = [
        {"id": 1, "name": "Laddu Gopal Shringar"},
        {"id": 2, "name": "Dresses"},
        {"id": 3, "name": "Radha Krishna Items"},
        {"id": 4, "name": "Jewelry"},
        {"id": 5, "name": "Traditional"}
    ]
    return categories

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    # Seed admin user
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@kridhanijewels.com")
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        hashed = hash_password(admin_password)
        await db.users.insert_one({
            "email": admin_email,
            "password_hash": hashed,
            "name": "Admin",
            "role": "admin",
            "createdAt": datetime.now(timezone.utc).isoformat()
        })
        logger.info(f"Admin user created: {admin_email}")
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_password)}}
        )
        logger.info(f"Admin password updated")
    
    # Create indexes
    await db.users.create_index("email", unique=True)
    await db.products.create_index("category")
    
    # Write test credentials
    os.makedirs("/app/memory", exist_ok=True)
    with open("/app/memory/test_credentials.md", "w") as f:
        f.write(f"""# Test Credentials for Kridhani Jewels

## Admin Credentials
- Email: {admin_email}
- Password: {admin_password}
- Role: admin

## API Endpoints
- Login: POST /api/auth/login
- Logout: POST /api/auth/logout
- Get current user: GET /api/auth/me
- Products: GET/POST/PUT/DELETE /api/products
- Orders: GET/POST /api/orders
- Categories: GET /api/categories
""")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()