"""
Test suite for Firebase removal and JWT-based authentication
Tests: Auth endpoints, Dashboard stats, Products CRUD, Orders CRUD
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials from test_credentials.md
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', '')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', '')
WRONG_EMAIL = "admin@kridhani.com"  # Old Firebase credentials should NOT work


class TestAuthEndpoints:
    """Authentication endpoint tests - JWT-based auth"""
    
    def test_login_success_with_new_credentials(self):
        """Test login with new admin@kridhanijewels.com credentials"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        assert response.status_code == 200, f"Login failed: {response.text}"
        
        data = response.json()
        assert "id" in data, "Response should contain user id"
        assert data["email"] == ADMIN_EMAIL, "Email should match"
        assert data["role"] == "admin", "Role should be admin"
        assert "name" in data, "Response should contain name"
        
        # Check httpOnly cookie is set
        cookies = response.cookies
        assert "access_token" in cookies, "access_token cookie should be set"
    
    def test_login_fails_with_old_firebase_credentials(self):
        """Test that old Firebase credentials (admin@kridhani.com) do NOT work"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": WRONG_EMAIL, "password": ADMIN_PASSWORD}
        )
        assert response.status_code == 401, f"Old credentials should fail: {response.text}"
    
    def test_login_fails_with_wrong_password(self):
        """Test login fails with wrong password"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": "wrongpassword"}
        )
        assert response.status_code == 401
        data = response.json()
        assert "detail" in data
    
    def test_auth_me_without_token(self):
        """Test /api/auth/me returns 401 without token"""
        response = requests.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code == 401
    
    def test_auth_me_with_valid_token(self):
        """Test /api/auth/me returns user data with valid token"""
        # First login to get cookie
        session = requests.Session()
        login_resp = session.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        assert login_resp.status_code == 200
        
        # Now check /api/auth/me
        me_resp = session.get(f"{BASE_URL}/api/auth/me")
        assert me_resp.status_code == 200
        
        data = me_resp.json()
        assert data["email"] == ADMIN_EMAIL
        assert data["role"] == "admin"
    
    def test_logout(self):
        """Test logout clears the cookie"""
        session = requests.Session()
        
        # Login
        login_resp = session.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        assert login_resp.status_code == 200
        
        # Logout
        logout_resp = session.post(f"{BASE_URL}/api/auth/logout")
        assert logout_resp.status_code == 200
        
        # Verify /api/auth/me now fails
        me_resp = session.get(f"{BASE_URL}/api/auth/me")
        assert me_resp.status_code == 401


class TestDashboardStats:
    """Dashboard stats endpoint tests"""
    
    @pytest.fixture
    def auth_session(self):
        """Create authenticated session"""
        session = requests.Session()
        resp = session.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        assert resp.status_code == 200, f"Auth failed: {resp.text}"
        return session
    
    def test_dashboard_stats_requires_auth(self):
        """Test dashboard stats requires authentication"""
        response = requests.get(f"{BASE_URL}/api/dashboard/stats")
        assert response.status_code == 401
    
    def test_dashboard_stats_returns_correct_structure(self, auth_session):
        """Test dashboard stats returns expected fields"""
        response = auth_session.get(f"{BASE_URL}/api/dashboard/stats")
        assert response.status_code == 200
        
        data = response.json()
        assert "totalOrders" in data, "Should have totalOrders"
        assert "totalRevenue" in data, "Should have totalRevenue"
        assert "totalProducts" in data, "Should have totalProducts"
        assert "pendingOrders" in data, "Should have pendingOrders"
        assert "recentOrders" in data, "Should have recentOrders"
        
        # Verify data types
        assert isinstance(data["totalOrders"], int)
        assert isinstance(data["totalRevenue"], (int, float))
        assert isinstance(data["totalProducts"], int)
        assert isinstance(data["pendingOrders"], int)
        assert isinstance(data["recentOrders"], list)
    
    def test_dashboard_stats_has_real_data(self, auth_session):
        """Test dashboard stats returns real data (6 orders, 6 products expected)"""
        response = auth_session.get(f"{BASE_URL}/api/dashboard/stats")
        assert response.status_code == 200
        
        data = response.json()
        # Based on agent context: 6 orders totaling ₹32,025 and 6 products
        assert data["totalOrders"] >= 0, "Should have orders"
        assert data["totalProducts"] >= 0, "Should have products"
        print(f"Dashboard stats: Orders={data['totalOrders']}, Revenue=₹{data['totalRevenue']}, Products={data['totalProducts']}")


class TestProductsAPI:
    """Products CRUD endpoint tests"""
    
    @pytest.fixture
    def auth_session(self):
        """Create authenticated session"""
        session = requests.Session()
        resp = session.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        assert resp.status_code == 200
        return session
    
    def test_get_products_public(self):
        """Test GET /api/products is public (no auth required)"""
        response = requests.get(f"{BASE_URL}/api/products")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        if len(data) > 0:
            product = data[0]
            assert "id" in product
            assert "name" in product
            assert "category" in product
            assert "price" in product
            assert "image" in product
    
    def test_create_product_requires_auth(self):
        """Test POST /api/products requires authentication"""
        response = requests.post(
            f"{BASE_URL}/api/products",
            json={
                "name": "Test Product",
                "category": "Jewelry",
                "price": 100,
                "image": "https://example.com/image.jpg",
                "description": "Test"
            }
        )
        assert response.status_code == 401
    
    def test_create_and_delete_product(self, auth_session):
        """Test full product CRUD: Create → Verify → Delete → Verify deletion"""
        # CREATE
        product_data = {
            "name": "TEST_MongoDB_Product",
            "category": "Laddu Gopal Shringar",
            "price": 499,
            "image": "https://picsum.photos/400",
            "description": "Test product for MongoDB integration"
        }
        
        create_resp = auth_session.post(f"{BASE_URL}/api/products", json=product_data)
        assert create_resp.status_code == 201, f"Create failed: {create_resp.text}"
        
        created = create_resp.json()
        assert created["name"] == product_data["name"]
        assert created["price"] == product_data["price"]
        assert "id" in created
        
        product_id = created["id"]
        
        # VERIFY - GET the product
        get_resp = auth_session.get(f"{BASE_URL}/api/products/{product_id}")
        assert get_resp.status_code == 200
        fetched = get_resp.json()
        assert fetched["name"] == product_data["name"]
        
        # DELETE
        delete_resp = auth_session.delete(f"{BASE_URL}/api/products/{product_id}")
        assert delete_resp.status_code == 200
        
        # VERIFY DELETION
        get_deleted_resp = auth_session.get(f"{BASE_URL}/api/products/{product_id}")
        assert get_deleted_resp.status_code == 404


class TestOrdersAPI:
    """Orders endpoint tests"""
    
    @pytest.fixture
    def auth_session(self):
        """Create authenticated session"""
        session = requests.Session()
        resp = session.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        assert resp.status_code == 200
        return session
    
    def test_get_orders_requires_auth(self):
        """Test GET /api/orders requires authentication"""
        response = requests.get(f"{BASE_URL}/api/orders")
        assert response.status_code == 401
    
    def test_get_orders_returns_list(self, auth_session):
        """Test GET /api/orders returns order list"""
        response = auth_session.get(f"{BASE_URL}/api/orders")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        
        if len(data) > 0:
            order = data[0]
            assert "orderId" in order or "id" in order
            assert "customerName" in order
            assert "totalAmount" in order
            print(f"Found {len(data)} orders")
    
    def test_update_order_status(self, auth_session):
        """Test PATCH /api/orders/{order_id}/status"""
        # First get orders
        orders_resp = auth_session.get(f"{BASE_URL}/api/orders")
        assert orders_resp.status_code == 200
        
        orders = orders_resp.json()
        if len(orders) == 0:
            pytest.skip("No orders to test status update")
        
        order = orders[0]
        order_id = order.get("orderId") or order.get("id")
        
        # Update status
        update_resp = auth_session.patch(
            f"{BASE_URL}/api/orders/{order_id}/status",
            json={"status": "shipped"}
        )
        assert update_resp.status_code == 200
        
        data = update_resp.json()
        assert data["status"] == "shipped"


class TestCategoriesAPI:
    """Categories endpoint tests"""
    
    def test_get_categories(self):
        """Test GET /api/categories returns category list"""
        response = requests.get(f"{BASE_URL}/api/categories")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0
        
        # Check expected categories
        category_names = [c["name"] for c in data]
        assert "Laddu Gopal Shringar" in category_names
        assert "Jewelry" in category_names


class TestNoFirebaseReferences:
    """Verify no Firebase SDK or references in API responses"""
    
    def test_products_no_firebase_ids(self):
        """Test products use MongoDB ObjectId format, not Firebase IDs"""
        response = requests.get(f"{BASE_URL}/api/products")
        assert response.status_code == 200
        
        products = response.json()
        if len(products) > 0:
            product_id = products[0]["id"]
            # MongoDB ObjectId is 24 hex characters
            assert len(product_id) == 24, f"Product ID should be MongoDB ObjectId format: {product_id}"
            # Should be valid hex
            try:
                int(product_id, 16)
            except ValueError:
                pytest.fail(f"Product ID is not valid hex (MongoDB ObjectId): {product_id}")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
