"""
Backend tests for Product Size Management and Order Tracking features
Tests: Order statuses, order tracking, product sizes
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestOrderStatuses:
    """Test GET /api/orders/statuses endpoint"""
    
    def test_get_order_statuses_returns_8_statuses(self):
        """Verify all 8 order statuses are returned"""
        response = requests.get(f"{BASE_URL}/api/orders/statuses")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        statuses = response.json()
        expected_statuses = [
            "Order Placed", "Confirmed", "Processing", "Packed",
            "Shipped", "Out for Delivery", "Delivered", "Cancelled"
        ]
        
        assert len(statuses) == 8, f"Expected 8 statuses, got {len(statuses)}"
        assert statuses == expected_statuses, f"Statuses mismatch: {statuses}"
        print(f"SUCCESS: GET /api/orders/statuses returns all 8 statuses: {statuses}")


class TestOrderTracking:
    """Test POST /api/orders/track endpoint"""
    
    def test_track_order_valid_credentials(self):
        """Track order with valid orderId and phone"""
        response = requests.post(
            f"{BASE_URL}/api/orders/track",
            json={"orderId": "KJ20260419123246", "phone": "9828438321"}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        order = response.json()
        # Verify order details
        assert order.get("orderId") == "KJ20260419123246", f"Order ID mismatch: {order.get('orderId')}"
        assert order.get("customerPhone") == "9828438321", f"Phone mismatch: {order.get('customerPhone')}"
        assert "customerName" in order, "Missing customerName"
        assert "totalAmount" in order, "Missing totalAmount"
        assert "status" in order, "Missing status"
        assert "items" in order, "Missing items"
        
        print(f"SUCCESS: Order tracked - ID: {order['orderId']}, Customer: {order['customerName']}, Status: {order['status']}")
    
    def test_track_order_invalid_order_id(self):
        """Track order with invalid orderId returns 404"""
        response = requests.post(
            f"{BASE_URL}/api/orders/track",
            json={"orderId": "INVALID123", "phone": "9828438321"}
        )
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
        print("SUCCESS: Invalid order ID returns 404")
    
    def test_track_order_invalid_phone(self):
        """Track order with wrong phone returns 404"""
        response = requests.post(
            f"{BASE_URL}/api/orders/track",
            json={"orderId": "KJ20260419123246", "phone": "0000000000"}
        )
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
        print("SUCCESS: Wrong phone number returns 404")
    
    def test_track_order_missing_fields(self):
        """Track order with missing fields returns 422"""
        response = requests.post(
            f"{BASE_URL}/api/orders/track",
            json={"orderId": "KJ20260419123246"}  # Missing phone
        )
        assert response.status_code == 422, f"Expected 422, got {response.status_code}"
        print("SUCCESS: Missing phone field returns 422")


class TestProductSizes:
    """Test product creation with sizes"""
    
    @pytest.fixture
    def auth_token(self):
        """Get admin auth token"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": "admin@kridhanijewels.com", "password": "admin123"}
        )
        if response.status_code != 200:
            pytest.skip("Admin login failed")
        # Return cookies for auth
        return response.cookies
    
    def test_create_product_with_sizes(self, auth_token):
        """Create product with sizes array and verify"""
        product_data = {
            "name": "TEST_Size_Product",
            "category": "Jewelry",
            "price": 299,
            "image": "https://example.com/test.jpg",
            "description": "Test product with sizes",
            "stock": 50,
            "sizes": [
                {"size": "0", "price": 199},
                {"size": "1", "price": 299},
                {"size": "2", "price": 399}
            ]
        }
        
        response = requests.post(
            f"{BASE_URL}/api/products",
            json=product_data,
            cookies=auth_token
        )
        assert response.status_code == 201, f"Expected 201, got {response.status_code}: {response.text}"
        
        created = response.json()
        product_id = created.get("id")
        assert product_id, "Missing product ID in response"
        assert created.get("name") == "TEST_Size_Product"
        assert len(created.get("sizes", [])) == 3, f"Expected 3 sizes, got {len(created.get('sizes', []))}"
        
        # Verify sizes
        sizes = created.get("sizes", [])
        assert sizes[0]["size"] == "0" and sizes[0]["price"] == 199
        assert sizes[1]["size"] == "1" and sizes[1]["price"] == 299
        assert sizes[2]["size"] == "2" and sizes[2]["price"] == 399
        
        print(f"SUCCESS: Product created with sizes - ID: {product_id}, Sizes: {sizes}")
        
        # GET to verify persistence
        get_response = requests.get(f"{BASE_URL}/api/products/{product_id}")
        assert get_response.status_code == 200
        fetched = get_response.json()
        assert len(fetched.get("sizes", [])) == 3, "Sizes not persisted correctly"
        print(f"SUCCESS: GET /api/products/{product_id} returns product with sizes")
        
        # Cleanup - delete test product
        delete_response = requests.delete(
            f"{BASE_URL}/api/products/{product_id}",
            cookies=auth_token
        )
        assert delete_response.status_code == 200, f"Cleanup failed: {delete_response.status_code}"
        print(f"SUCCESS: Test product deleted")
    
    def test_create_product_without_sizes(self, auth_token):
        """Create product without sizes (backward compatibility)"""
        product_data = {
            "name": "TEST_NoSize_Product",
            "category": "Dresses",
            "price": 599,
            "image": "https://example.com/test2.jpg",
            "description": "Test product without sizes",
            "stock": 100
        }
        
        response = requests.post(
            f"{BASE_URL}/api/products",
            json=product_data,
            cookies=auth_token
        )
        assert response.status_code == 201, f"Expected 201, got {response.status_code}"
        
        created = response.json()
        product_id = created.get("id")
        assert created.get("sizes") == [], "Sizes should be empty array"
        print(f"SUCCESS: Product without sizes created - ID: {product_id}")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/products/{product_id}", cookies=auth_token)
    
    def test_get_products_includes_sizes(self):
        """GET /api/products returns sizes field"""
        response = requests.get(f"{BASE_URL}/api/products")
        assert response.status_code == 200
        
        products = response.json()
        assert len(products) > 0, "No products found"
        
        # Check that sizes field exists on all products
        for product in products:
            assert "sizes" in product, f"Product {product.get('id')} missing sizes field"
        
        print(f"SUCCESS: All {len(products)} products have sizes field")


class TestAdminOrderStatusUpdate:
    """Test admin order status update with validation"""
    
    @pytest.fixture
    def auth_token(self):
        """Get admin auth token"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": "admin@kridhanijewels.com", "password": "admin123"}
        )
        if response.status_code != 200:
            pytest.skip("Admin login failed")
        return response.cookies
    
    def test_update_order_status_valid(self, auth_token):
        """Update order status with valid status"""
        # First get an order
        orders_response = requests.get(f"{BASE_URL}/api/orders", cookies=auth_token)
        if orders_response.status_code != 200 or len(orders_response.json()) == 0:
            pytest.skip("No orders available")
        
        order = orders_response.json()[0]
        order_id = order.get("orderId")
        
        # Update to a valid status
        response = requests.patch(
            f"{BASE_URL}/api/orders/{order_id}/status",
            json={"status": "Processing"},
            cookies=auth_token
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        result = response.json()
        assert result.get("status") == "Processing"
        print(f"SUCCESS: Order {order_id} status updated to Processing")
    
    def test_update_order_status_invalid(self, auth_token):
        """Update order status with invalid status returns 400"""
        # First get an order
        orders_response = requests.get(f"{BASE_URL}/api/orders", cookies=auth_token)
        if orders_response.status_code != 200 or len(orders_response.json()) == 0:
            pytest.skip("No orders available")
        
        order = orders_response.json()[0]
        order_id = order.get("orderId")
        
        # Try invalid status
        response = requests.patch(
            f"{BASE_URL}/api/orders/{order_id}/status",
            json={"status": "InvalidStatus"},
            cookies=auth_token
        )
        assert response.status_code == 400, f"Expected 400, got {response.status_code}"
        print(f"SUCCESS: Invalid status returns 400")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
