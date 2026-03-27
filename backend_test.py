import requests
import sys
import json
from datetime import datetime

class KridhaniJewelsAPITester:
    def __init__(self, base_url="https://divine-jewelry-shop.preview.emergentagent.com"):
        self.base_url = base_url
        self.session = requests.Session()
        self.admin_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "test": name,
            "status": "PASSED" if success else "FAILED",
            "details": details
        })
        return success

    def test_api_endpoint(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Test a single API endpoint"""
        url = f"{self.base_url}/api/{endpoint}"
        
        try:
            if headers is None:
                headers = {'Content-Type': 'application/json'}
            
            if method == 'GET':
                response = self.session.get(url, headers=headers)
            elif method == 'POST':
                response = self.session.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = self.session.put(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = self.session.delete(url, headers=headers)

            success = response.status_code == expected_status
            details = f"Status: {response.status_code}, Expected: {expected_status}"
            
            if not success:
                try:
                    error_data = response.json()
                    details += f", Response: {error_data}"
                except:
                    details += f", Response: {response.text[:200]}"
            
            return self.log_test(name, success, details), response
            
        except Exception as e:
            return self.log_test(name, False, f"Exception: {str(e)}"), None

    def test_admin_login(self):
        """Test admin login functionality"""
        print("\n🔐 Testing Admin Authentication...")
        
        # Test login with correct credentials
        login_data = {
            "email": "admin@kridhanijewels.com",
            "password": "admin123"
        }
        
        success, response = self.test_api_endpoint(
            "Admin Login", "POST", "auth/login", 200, login_data
        )
        
        if success and response:
            try:
                # Check if we got a valid response with user data
                user_data = response.json()
                if user_data.get("role") == "admin":
                    self.log_test("Admin Role Verification", True)
                    # Store cookies for authenticated requests
                    return True
                else:
                    self.log_test("Admin Role Verification", False, "Role not admin")
            except:
                self.log_test("Admin Login Response Parse", False, "Invalid JSON response")
        
        return False

    def test_products_api(self):
        """Test products API endpoints"""
        print("\n📦 Testing Products API...")
        
        # Test get all products
        success, response = self.test_api_endpoint(
            "Get All Products", "GET", "products", 200
        )
        
        products = []
        if success and response:
            try:
                products = response.json()
                self.log_test("Products Response Parse", True, f"Found {len(products)} products")
            except:
                self.log_test("Products Response Parse", False, "Invalid JSON")
        
        # Test get single product if products exist
        if products:
            product_id = products[0].get("id")
            if product_id:
                self.test_api_endpoint(
                    "Get Single Product", "GET", f"products/{product_id}", 200
                )
        
        # Test create product (requires admin auth)
        test_product = {
            "name": "Test Divine Necklace",
            "category": "Jewelry",
            "price": 999.99,
            "image": "https://example.com/test.jpg",
            "description": "Test product for API testing",
            "isBestseller": False,
            "isTrending": True,
            "stock": 50
        }
        
        success, response = self.test_api_endpoint(
            "Create Product (Admin Required)", "POST", "products", 201, test_product
        )
        
        created_product_id = None
        if success and response:
            try:
                created_product = response.json()
                created_product_id = created_product.get("id")
                self.log_test("Product Creation Response", True, f"Created product ID: {created_product_id}")
            except:
                self.log_test("Product Creation Response", False, "Invalid response")
        
        # Test update product if we created one
        if created_product_id:
            update_data = {"price": 1199.99, "isBestseller": True}
            self.test_api_endpoint(
                "Update Product", "PUT", f"products/{created_product_id}", 200, update_data
            )
            
            # Test delete product
            self.test_api_endpoint(
                "Delete Product", "DELETE", f"products/{created_product_id}", 200
            )

    def test_categories_api(self):
        """Test categories API"""
        print("\n📂 Testing Categories API...")
        
        success, response = self.test_api_endpoint(
            "Get Categories", "GET", "categories", 200
        )
        
        if success and response:
            try:
                categories = response.json()
                expected_categories = ["Laddu Gopal Shringar", "Dresses", "Radha Krishna Items", "Jewelry", "Traditional"]
                found_names = [cat.get("name") for cat in categories]
                
                if all(name in found_names for name in expected_categories):
                    self.log_test("Categories Content Verification", True, f"All expected categories found")
                else:
                    self.log_test("Categories Content Verification", False, f"Missing categories: {set(expected_categories) - set(found_names)}")
            except:
                self.log_test("Categories Response Parse", False, "Invalid JSON")

    def test_orders_api(self):
        """Test orders API"""
        print("\n🛒 Testing Orders API...")
        
        # Test create order
        test_order = {
            "customerName": "Test Customer",
            "customerPhone": "9876543210",
            "deliveryAddress": "123 Test Street, Test City, 123456",
            "paymentMethod": "COD",
            "items": [
                {
                    "productId": "test123",
                    "productName": "Test Product",
                    "quantity": 2,
                    "price": 500.0
                }
            ],
            "totalAmount": 1000.0
        }
        
        success, response = self.test_api_endpoint(
            "Create Order", "POST", "orders", 200, test_order
        )
        
        if success and response:
            try:
                order_response = response.json()
                order_id = order_response.get("orderId")
                if order_id and order_id.startswith("KJ"):
                    self.log_test("Order ID Format", True, f"Order ID: {order_id}")
                else:
                    self.log_test("Order ID Format", False, f"Invalid order ID: {order_id}")
            except:
                self.log_test("Order Response Parse", False, "Invalid JSON")
        
        # Test get orders (admin only)
        self.test_api_endpoint(
            "Get Orders (Admin Required)", "GET", "orders", 200
        )

    def test_auth_endpoints(self):
        """Test authentication endpoints"""
        print("\n🔑 Testing Auth Endpoints...")
        
        # Test get current user
        self.test_api_endpoint(
            "Get Current User", "GET", "auth/me", 200
        )
        
        # Test logout
        self.test_api_endpoint(
            "Logout", "POST", "auth/logout", 200
        )
        
        # Test invalid login
        invalid_login = {
            "email": "invalid@test.com",
            "password": "wrongpassword"
        }
        self.test_api_endpoint(
            "Invalid Login", "POST", "auth/login", 401, invalid_login
        )

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Kridhani Jewels API Tests...")
        print(f"Testing against: {self.base_url}")
        print("=" * 60)
        
        # Test admin login first
        if self.test_admin_login():
            print("✅ Admin authentication successful, proceeding with authenticated tests...")
        else:
            print("❌ Admin authentication failed, some tests may fail...")
        
        # Run all API tests
        self.test_products_api()
        self.test_categories_api()
        self.test_orders_api()
        self.test_auth_endpoints()
        
        # Print summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {self.tests_run}")
        print(f"Passed: {self.tests_passed}")
        print(f"Failed: {self.tests_run - self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        # Print failed tests
        failed_tests = [test for test in self.test_results if test["status"] == "FAILED"]
        if failed_tests:
            print("\n❌ FAILED TESTS:")
            for test in failed_tests:
                print(f"  - {test['test']}: {test['details']}")
        
        return self.tests_passed == self.tests_run

def main():
    tester = KridhaniJewelsAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())