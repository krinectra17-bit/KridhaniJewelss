from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from fastapi.responses import PlainTextResponse
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import hmac
import hashlib
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime, timezone, timedelta
from bson import ObjectId
import bcrypt
import jwt
import secrets
import razorpay

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Razorpay client
razorpay_client = razorpay.Client(
    auth=(os.environ['RAZORPAY_KEY_ID'], os.environ['RAZORPAY_KEY_SECRET'])
)

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

class SizePrice(BaseModel):
    size: str
    price: float

class ProductCreate(BaseModel):
    name: str
    category: str
    price: float
    image: str
    description: str
    isBestseller: bool = False
    isTrending: bool = False
    stock: int = 100
    sizes: List[SizePrice] = []

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    image: Optional[str] = None
    description: Optional[str] = None
    isBestseller: Optional[bool] = None
    isTrending: Optional[bool] = None
    stock: Optional[int] = None
    sizes: Optional[List[SizePrice]] = None

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
    sizes: List[SizePrice] = []

class OrderItem(BaseModel):
    productId: str
    productName: str
    quantity: int
    price: float
    size: Optional[str] = None

ORDER_STATUSES = [
    "Order Placed",
    "Confirmed",
    "Processing",
    "Packed",
    "Shipped",
    "Out for Delivery",
    "Delivered",
    "Cancelled"
]

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

class TrackOrderRequest(BaseModel):
    orderId: str
    phone: str

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
    products = await db.products.find({}).to_list(1000)
    result = []
    for p in products:
        result.append({
            "id": str(p["_id"]),
            "name": p.get("name", ""),
            "category": p.get("category", ""),
            "price": p.get("price", 0),
            "image": p.get("image", ""),
            "description": p.get("description", ""),
            "isBestseller": p.get("isBestseller", False),
            "isTrending": p.get("isTrending", False),
            "stock": p.get("stock", 100),
            "sizes": p.get("sizes", [])
        })
    return result

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

def _log_order_to_console(order_data: dict):
    """Print order details to console when email is not configured"""
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


def _build_order_email_html(order_data: dict) -> str:
    """Build HTML content for order notification email"""
    items_html = "".join([
        f"<tr><td>{item['productName']}</td><td>{item['quantity']}</td><td>₹{item['price']}</td><td>₹{item['price'] * item['quantity']}</td></tr>"
        for item in order_data['items']
    ])
    return f"""
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


def send_order_notification(order_data: dict):
    """Send order notification via email or log to console"""
    try:
        sendgrid_key = os.environ.get("SENDGRID_API_KEY")
        if not sendgrid_key:
            _log_order_to_console(order_data)
            return
        
        from sendgrid import SendGridAPIClient
        from sendgrid.helpers.mail import Mail
        
        message = Mail(
            from_email=os.environ.get('SENDER_EMAIL'),
            to_emails=os.environ.get('ADMIN_EMAIL'),
            subject=f"New Order #{order_data['orderId']}",
            html_content=_build_order_email_html(order_data)
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

class OrderStatusUpdate(BaseModel):
    status: str

@api_router.patch("/orders/{order_id}/status")
async def update_order_status(order_id: str, payload: OrderStatusUpdate, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    if payload.status not in ORDER_STATUSES:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {', '.join(ORDER_STATUSES)}")
    
    result = await db.orders.update_one(
        {"orderId": order_id},
        {"$set": {"status": payload.status, "updatedAt": datetime.now(timezone.utc).isoformat()}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"message": "Status updated", "status": payload.status}

@api_router.get("/orders/statuses")
async def get_order_statuses():
    return ORDER_STATUSES

# ============= ORDER TRACKING (PUBLIC) =============

@api_router.post("/orders/track")
async def track_order(payload: TrackOrderRequest):
    order = await db.orders.find_one(
        {"orderId": payload.orderId, "customerPhone": payload.phone},
        {"_id": 0}
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found. Please check your Order ID and phone number.")
    return order

@api_router.get("/dashboard/stats")
async def get_dashboard_stats(user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    total_orders = await db.orders.count_documents({})
    total_products = await db.products.count_documents({})
    
    pipeline = [{"$group": {"_id": None, "total": {"$sum": "$totalAmount"}}}]
    revenue_result = await db.orders.aggregate(pipeline).to_list(1)
    total_revenue = revenue_result[0]["total"] if revenue_result else 0
    
    pending_orders = await db.orders.count_documents({"status": {"$in": ["pending", None]}})
    
    recent_orders = await db.orders.find({}, {"_id": 0}).sort("createdAt", -1).to_list(5)
    
    return {
        "totalOrders": total_orders,
        "totalRevenue": total_revenue,
        "totalProducts": total_products,
        "pendingOrders": pending_orders,
        "recentOrders": recent_orders
    }

# ============= RAZORPAY PAYMENT ROUTES =============

class CreatePaymentOrder(BaseModel):
    amount: float
    customerName: str
    customerPhone: str
    deliveryAddress: str
    items: List[OrderItem]

class VerifyPayment(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    customerName: str
    customerPhone: str
    deliveryAddress: str
    items: List[OrderItem]
    totalAmount: float

@api_router.post("/payment/create-order")
async def create_razorpay_order(payload: CreatePaymentOrder):
    try:
        amount_paise = int(round(payload.amount * 100))
        
        receipt_id = f"KJ{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}"
        
        razorpay_order = razorpay_client.order.create({
            "amount": amount_paise,
            "currency": "INR",
            "receipt": receipt_id,
            "payment_capture": 1,
            "notes": {
                "customer_name": payload.customerName,
                "customer_phone": payload.customerPhone,
                "items_count": str(len(payload.items))
            }
        })
        
        return {
            "orderId": razorpay_order["id"],
            "amount": razorpay_order["amount"],
            "currency": razorpay_order["currency"],
            "receipt": receipt_id,
            "keyId": os.environ['RAZORPAY_KEY_ID']
        }
    except Exception as e:
        logger.error(f"Razorpay order creation failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Payment order creation failed: {str(e)}")

@api_router.post("/payment/verify")
async def verify_razorpay_payment(payload: VerifyPayment):
    try:
        # Verify signature
        key_secret = os.environ['RAZORPAY_KEY_SECRET']
        message = f"{payload.razorpay_order_id}|{payload.razorpay_payment_id}"
        generated_signature = hmac.new(
            key_secret.encode('utf-8'),
            message.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        
        if generated_signature != payload.razorpay_signature:
            raise HTTPException(status_code=400, detail="Payment verification failed. Invalid signature.")
        
        # Save order with payment details
        order_id = f"KJ{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}"
        order_dict = {
            "orderId": order_id,
            "customerName": payload.customerName,
            "customerPhone": payload.customerPhone,
            "deliveryAddress": payload.deliveryAddress,
            "paymentMethod": "Razorpay",
            "items": [item.model_dump() for item in payload.items],
            "totalAmount": payload.totalAmount,
            "razorpayOrderId": payload.razorpay_order_id,
            "razorpayPaymentId": payload.razorpay_payment_id,
            "paymentStatus": "paid",
            "status": "Order Placed",
            "createdAt": datetime.now(timezone.utc).isoformat()
        }
        
        await db.orders.insert_one(order_dict)
        send_order_notification(order_dict)
        
        return {
            "orderId": order_id,
            "paymentId": payload.razorpay_payment_id,
            "message": "Payment verified and order placed successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Payment verification failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Payment verification failed: {str(e)}")

# ============= CATEGORIES =============

@api_router.get("/categories")
async def get_categories():
    categories = [
        {"id": 1, "name": "Yugal Jodi Shringar "},
        {"id": 2, "name": "Bal Radha Rani Shringar"},
        {"id": 3, "name": "Laddu Gopal Shringar"},
        {"id": 4, "name": "Jewelry"},
        {"id": 5, "name": "Traditional"}
    ]
    return categories

# ============= SEO: SITEMAP =============

SITE_URL = "https://kridhanijewels.com"

@api_router.get("/sitemap.xml", response_class=PlainTextResponse)
async def sitemap():
    products = await db.products.find({}, {"_id": 1}).to_list(5000)
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    static_pages = [
        {"loc": "/", "priority": "1.0", "changefreq": "daily"},
        {"loc": "/categories", "priority": "0.8", "changefreq": "weekly"},
        {"loc": "/track-order", "priority": "0.5", "changefreq": "monthly"},
    ]

    urls = ""
    for p in static_pages:
        urls += f"""  <url>
    <loc>{SITE_URL}{p['loc']}</loc>
    <lastmod>{now}</lastmod>
    <changefreq>{p['changefreq']}</changefreq>
    <priority>{p['priority']}</priority>
  </url>\n"""

    for prod in products:
        urls += f"""  <url>
    <loc>{SITE_URL}/product/{str(prod['_id'])}</loc>
    <lastmod>{now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>\n"""

    xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{urls}</urlset>"""

    return PlainTextResponse(content=xml, media_type="application/xml")

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
    # Remove old admin account
    await db.users.delete_many({"email": "admin@kridhanijewels.com"})

    # Seed admin user from env
    admin_email = os.environ.get("ADMIN_EMAIL")
    admin_password = os.environ.get("ADMIN_PASSWORD")
    
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
        logger.info("Admin password updated")
    
    # Create indexes
    await db.users.create_index("email", unique=True)
    await db.products.create_index("category")
    await db.orders.create_index("orderId")
    await db.orders.create_index("customerPhone")
    
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