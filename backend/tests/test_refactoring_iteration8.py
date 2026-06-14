"""
Backend API Tests for Iteration 8 - Code Quality Refactoring Verification
Tests: Auth, Products, Orders, Dashboard Stats, Order Statuses
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials from test_credentials.md
ADMIN_EMAIL = "krinectra@kridhanijewels.com"
ADMIN_PASSWORD = "Krinectra@1708"


class TestHealthAndBasicEndpoints:
    """Basic endpoint health checks"""
    
    def test_products_endpoint_returns_200(self):
        """GET /api/products should return 200"""
        response = requests.get(f"{BASE_URL}/api/products")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"Products endpoint OK - {len(data)} products found")
    
    def test_categories_endpoint_returns_200(self):
        """GET /api/categories should return 200"""
        response = requests.get(f"{BASE_URL}/api/categories")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0
        print(f"Categories endpoint OK - {len(data)} categories found")
    
    def test_order_statuses_endpoint_returns_200(self):
        """GET /api/orders/statuses should return list of valid statuses"""
        response = requests.get(f"{BASE_URL}/api/orders/statuses")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        expected_statuses = ["Order Placed", "Confirmed", "Processing", "Packed", "Shipped", "Out for Delivery", "Delivered", "Cancelled"]
        assert data == expected_statuses
        print(f"Order statuses endpoint OK - {len(data)} statuses")


class TestAuthentication:
    """Authentication flow tests"""
    
    def test_login_with_valid_credentials(self):
        """POST /api/auth/login with valid admin credentials"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        assert data["email"] == ADMIN_EMAIL
        assert data["role"] == "admin"
        print(f"Login successful - Admin ID: {data['id']}")
    
    def test_login_with_invalid_credentials(self):
        """POST /api/auth/login with invalid credentials should return 401"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": "wrong@email.com", "password": "wrongpassword"}
        )
        assert response.status_code == 401
        print("Invalid login correctly rejected with 401")
    
    def test_auth_me_without_token(self):
        """GET /api/auth/me without token should return 401"""
        response = requests.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code == 401
        print("Unauthenticated /auth/me correctly rejected with 401")


class TestAuthenticatedEndpoints:
    """Tests requiring authentication"""
    
    @pytest.fixture(autouse=True)
    def setup_session(self):
        """Login and get session with cookies"""
        self.session = requests.Session()
        response = self.session.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        if response.status_code != 200:
            pytest.skip("Authentication failed - skipping authenticated tests")
        yield
        # Logout
        self.session.post(f"{BASE_URL}/api/auth/logout")
    
    def test_auth_me_with_cookie(self):
        """GET /api/auth/me with valid session cookie"""
        response = self.session.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == ADMIN_EMAIL
        assert data["role"] == "admin"
        print(f"Auth me OK - User: {data['email']}")
    
    def test_dashboard_stats(self):
        """GET /api/dashboard/stats should return stats for admin"""
        response = self.session.get(f"{BASE_URL}/api/dashboard/stats")
        assert response.status_code == 200
        data = response.json()
        assert "totalOrders" in data
        assert "totalRevenue" in data
        assert "totalProducts" in data
        assert "pendingOrders" in data
        assert "recentOrders" in data
        print(f"Dashboard stats OK - Orders: {data['totalOrders']}, Products: {data['totalProducts']}")
    
    def test_get_orders_as_admin(self):
        """GET /api/orders should return orders list for admin"""
        response = self.session.get(f"{BASE_URL}/api/orders")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"Orders endpoint OK - {len(data)} orders found")


class TestProductCRUD:
    """Product CRUD operations"""
    
    @pytest.fixture(autouse=True)
    def setup_session(self):
        """Login and get session with cookies"""
        self.session = requests.Session()
        response = self.session.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        if response.status_code != 200:
            pytest.skip("Authentication failed - skipping product tests")
        yield
        self.session.post(f"{BASE_URL}/api/auth/logout")
    
    def test_create_product_with_sizes(self):
        """POST /api/products with sizes array"""
        product_data = {
            "name": "TEST_Product_With_Sizes",
            "category": "Jewelry",
            "price": 999.0,
            "image": "https://example.com/test.jpg",
            "description": "Test product with multiple sizes",
            "stock": 50,
            "sizes": [
                {"size": "0", "price": 999.0},
                {"size": "1", "price": 1099.0},
                {"size": "2", "price": 1199.0}
            ]
        }
        response = self.session.post(f"{BASE_URL}/api/products", json=product_data)
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == product_data["name"]
        assert len(data["sizes"]) == 3
        print(f"Product created with sizes - ID: {data['id']}")
        
        # Cleanup - delete the test product
        delete_response = self.session.delete(f"{BASE_URL}/api/products/{data['id']}")
        assert delete_response.status_code == 200
        print("Test product cleaned up")
    
    def test_product_response_structure(self):
        """Verify product response has all required fields"""
        response = requests.get(f"{BASE_URL}/api/products")
        assert response.status_code == 200
        products = response.json()
        if len(products) > 0:
            product = products[0]
            required_fields = ["id", "name", "category", "price", "image", "description"]
            for field in required_fields:
                assert field in product, f"Missing field: {field}"
            print(f"Product structure verified - Fields: {list(product.keys())}")


class TestOrderTracking:
    """Order tracking functionality"""
    
    def test_track_order_invalid_data(self):
        """POST /api/orders/track with invalid data should return 404"""
        response = requests.post(
            f"{BASE_URL}/api/orders/track",
            json={"orderId": "INVALID123", "phone": "0000000000"}
        )
        assert response.status_code == 404
        print("Invalid order tracking correctly returns 404")


class TestRefactoredFunctions:
    """Tests to verify refactored backend functions work correctly"""
    
    @pytest.fixture(autouse=True)
    def setup_session(self):
        """Login and get session with cookies"""
        self.session = requests.Session()
        response = self.session.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        if response.status_code != 200:
            pytest.skip("Authentication failed")
        yield
        self.session.post(f"{BASE_URL}/api/auth/logout")
    
    def test_order_creation_triggers_notification(self):
        """POST /api/orders should create order and trigger notification (logged to console)"""
        order_data = {
            "customerName": "TEST_Customer",
            "customerPhone": "9999999999",
            "deliveryAddress": "Test Address, Test City",
            "paymentMethod": "COD",
            "items": [
                {"productId": "test123", "productName": "Test Product", "quantity": 1, "price": 100.0}
            ],
            "totalAmount": 100.0
        }
        response = requests.post(f"{BASE_URL}/api/orders", json=order_data)
        assert response.status_code == 200
        data = response.json()
        assert "orderId" in data
        assert data["orderId"].startswith("KJ")
        assert "message" in data
        print(f"Order created - ID: {data['orderId']}")
        # Note: send_order_notification is called internally, logs to console since SENDGRID_API_KEY is empty


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
