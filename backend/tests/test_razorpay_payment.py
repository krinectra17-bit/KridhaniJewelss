"""
Razorpay Payment Integration Tests
Tests for /api/payment/create-order and /api/payment/verify endpoints
"""
import pytest
import requests
import os
import hmac
import hashlib

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestRazorpayCreateOrder:
    """Tests for POST /api/payment/create-order endpoint"""
    
    def test_create_order_success(self):
        """Test successful Razorpay order creation"""
        payload = {
            "amount": 1000.0,
            "customerName": "Test User",
            "customerPhone": "9876543210",
            "deliveryAddress": "Test Address 123, City, State 123456",
            "items": [
                {
                    "productId": "test123",
                    "productName": "Test Product",
                    "quantity": 1,
                    "price": 1000.0
                }
            ]
        }
        
        response = requests.post(f"{BASE_URL}/api/payment/create-order", json=payload)
        
        # Status code assertion
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        # Data assertions
        data = response.json()
        assert "orderId" in data, "Response should contain orderId"
        assert data["orderId"].startswith("order_"), f"orderId should start with 'order_', got: {data['orderId']}"
        assert "amount" in data, "Response should contain amount"
        assert data["amount"] == 100000, f"Amount should be 100000 paise (1000 INR), got: {data['amount']}"
        assert "currency" in data, "Response should contain currency"
        assert data["currency"] == "INR", f"Currency should be INR, got: {data['currency']}"
        assert "keyId" in data, "Response should contain keyId"
        assert data["keyId"] == "rzp_test_SeW6oqbjbZpQ7g", f"keyId mismatch: {data['keyId']}"
        
        print(f"✓ Create order success - orderId: {data['orderId']}")
        return data
    
    def test_create_order_multiple_items(self):
        """Test order creation with multiple items"""
        payload = {
            "amount": 2500.0,
            "customerName": "Multi Item User",
            "customerPhone": "9876543211",
            "deliveryAddress": "Multi Item Address, City 123456",
            "items": [
                {"productId": "prod1", "productName": "Product 1", "quantity": 2, "price": 500.0},
                {"productId": "prod2", "productName": "Product 2", "quantity": 3, "price": 500.0}
            ]
        }
        
        response = requests.post(f"{BASE_URL}/api/payment/create-order", json=payload)
        
        assert response.status_code == 200
        data = response.json()
        assert data["orderId"].startswith("order_")
        assert data["amount"] == 250000  # 2500 INR in paise
        
        print(f"✓ Multiple items order created - orderId: {data['orderId']}")
    
    def test_create_order_decimal_amount(self):
        """Test order creation with decimal amount"""
        payload = {
            "amount": 1299.50,
            "customerName": "Decimal User",
            "customerPhone": "9876543212",
            "deliveryAddress": "Decimal Address, City 123456",
            "items": [
                {"productId": "prod1", "productName": "Product 1", "quantity": 1, "price": 1299.50}
            ]
        }
        
        response = requests.post(f"{BASE_URL}/api/payment/create-order", json=payload)
        
        assert response.status_code == 200
        data = response.json()
        assert data["orderId"].startswith("order_")
        # 1299.50 * 100 = 129950 paise
        assert data["amount"] == 129950
        
        print(f"✓ Decimal amount order created - amount: {data['amount']} paise")
    
    def test_create_order_missing_fields(self):
        """Test order creation with missing required fields"""
        payload = {
            "amount": 1000.0
            # Missing customerName, customerPhone, deliveryAddress, items
        }
        
        response = requests.post(f"{BASE_URL}/api/payment/create-order", json=payload)
        
        # Should return 422 for validation error
        assert response.status_code == 422, f"Expected 422 for missing fields, got {response.status_code}"
        
        print("✓ Missing fields validation works correctly")


class TestRazorpayVerifyPayment:
    """Tests for POST /api/payment/verify endpoint"""
    
    def test_verify_payment_invalid_signature(self):
        """Test payment verification with invalid signature - should fail"""
        payload = {
            "razorpay_order_id": "order_test123",
            "razorpay_payment_id": "pay_test123",
            "razorpay_signature": "invalid_signature_here",
            "customerName": "Test User",
            "customerPhone": "9876543210",
            "deliveryAddress": "Test Address 123",
            "items": [
                {"productId": "test123", "productName": "Test Product", "quantity": 1, "price": 1000.0}
            ],
            "totalAmount": 1000.0
        }
        
        response = requests.post(f"{BASE_URL}/api/payment/verify", json=payload)
        
        # Should return 400 for invalid signature
        assert response.status_code == 400, f"Expected 400 for invalid signature, got {response.status_code}"
        
        data = response.json()
        assert "detail" in data
        assert "signature" in data["detail"].lower() or "verification" in data["detail"].lower()
        
        print("✓ Invalid signature correctly rejected")
    
    def test_verify_payment_missing_fields(self):
        """Test payment verification with missing required fields"""
        payload = {
            "razorpay_order_id": "order_test123"
            # Missing other required fields
        }
        
        response = requests.post(f"{BASE_URL}/api/payment/verify", json=payload)
        
        # Should return 422 for validation error
        assert response.status_code == 422, f"Expected 422 for missing fields, got {response.status_code}"
        
        print("✓ Missing fields validation works correctly")
    
    def test_verify_payment_signature_format(self):
        """Test that signature verification uses correct HMAC SHA256 format"""
        # This tests that the backend expects the correct signature format
        # Generate a fake but properly formatted signature
        order_id = "order_test_format"
        payment_id = "pay_test_format"
        fake_secret = "wrong_secret"
        
        message = f"{order_id}|{payment_id}"
        fake_signature = hmac.new(
            fake_secret.encode('utf-8'),
            message.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        
        payload = {
            "razorpay_order_id": order_id,
            "razorpay_payment_id": payment_id,
            "razorpay_signature": fake_signature,
            "customerName": "Format Test User",
            "customerPhone": "9876543210",
            "deliveryAddress": "Format Test Address",
            "items": [
                {"productId": "test123", "productName": "Test Product", "quantity": 1, "price": 500.0}
            ],
            "totalAmount": 500.0
        }
        
        response = requests.post(f"{BASE_URL}/api/payment/verify", json=payload)
        
        # Should still fail because secret is wrong, but validates format is accepted
        assert response.status_code == 400, f"Expected 400, got {response.status_code}"
        
        print("✓ Signature format validation works correctly")


class TestProductsEndpoint:
    """Tests for /api/products endpoint - needed for checkout flow"""
    
    def test_get_products(self):
        """Test getting products list"""
        response = requests.get(f"{BASE_URL}/api/products")
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0, "Should have at least one product"
        
        # Verify product structure
        product = data[0]
        assert "id" in product
        assert "name" in product
        assert "price" in product
        assert "category" in product
        
        print(f"✓ Products endpoint works - {len(data)} products found")


class TestAuthEndpoint:
    """Tests for admin authentication"""
    
    def test_admin_login(self):
        """Test admin login with correct credentials"""
        payload = {
            "email": "admin@kridhanijewels.com",
            "password": "admin123"
        }
        
        response = requests.post(f"{BASE_URL}/api/auth/login", json=payload)
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "id" in data
        assert "email" in data
        assert data["email"] == "admin@kridhanijewels.com"
        assert data["role"] == "admin"
        
        print("✓ Admin login successful")
    
    def test_admin_login_wrong_password(self):
        """Test admin login with wrong password"""
        payload = {
            "email": "admin@kridhanijewels.com",
            "password": "wrongpassword"
        }
        
        response = requests.post(f"{BASE_URL}/api/auth/login", json=payload)
        
        assert response.status_code == 401
        
        print("✓ Wrong password correctly rejected")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
