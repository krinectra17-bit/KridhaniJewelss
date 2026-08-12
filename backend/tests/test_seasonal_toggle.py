"""
Test suite for Seasonal Toggle Feature (Janmashtami Theme)
Tests: GET/PUT /api/settings endpoints and authentication
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Admin credentials from test_credentials.md
ADMIN_EMAIL = "krinectra@kridhanijewels.com"
ADMIN_PASSWORD = "Krinectra@1708"


class TestSettingsAPI:
    """Tests for /api/settings endpoints"""

    def test_get_settings_public_access(self):
        """GET /api/settings should be publicly accessible (no auth required)"""
        response = requests.get(f"{BASE_URL}/api/settings")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert "isJanmashtamiThemeActive" in data, "Response should contain isJanmashtamiThemeActive"
        assert isinstance(data["isJanmashtamiThemeActive"], bool), "isJanmashtamiThemeActive should be boolean"
        print(f"✓ GET /api/settings returns: {data}")

    def test_put_settings_without_auth_returns_401(self):
        """PUT /api/settings without authentication should return 401"""
        response = requests.put(
            f"{BASE_URL}/api/settings",
            json={"isJanmashtamiThemeActive": True},
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✓ PUT /api/settings without auth returns 401")

    def test_put_settings_with_auth_updates_setting(self):
        """PUT /api/settings with admin auth should update the setting"""
        # First login to get session cookie
        session = requests.Session()
        login_response = session.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
            headers={"Content-Type": "application/json"}
        )
        assert login_response.status_code == 200, f"Login failed: {login_response.text}"
        print(f"✓ Admin login successful")

        # Get current setting
        get_response = session.get(f"{BASE_URL}/api/settings")
        current_value = get_response.json().get("isJanmashtamiThemeActive", False)
        print(f"  Current isJanmashtamiThemeActive: {current_value}")

        # Toggle the setting
        new_value = not current_value
        put_response = session.put(
            f"{BASE_URL}/api/settings",
            json={"isJanmashtamiThemeActive": new_value},
            headers={"Content-Type": "application/json"}
        )
        assert put_response.status_code == 200, f"PUT failed: {put_response.text}"
        
        put_data = put_response.json()
        assert put_data["isJanmashtamiThemeActive"] == new_value, "Response should reflect new value"
        print(f"✓ PUT /api/settings updated to: {new_value}")

        # Verify persistence with GET
        verify_response = session.get(f"{BASE_URL}/api/settings")
        verify_data = verify_response.json()
        assert verify_data["isJanmashtamiThemeActive"] == new_value, "Setting should persist after update"
        print(f"✓ GET /api/settings confirms persistence: {verify_data}")

    def test_settings_toggle_cycle(self):
        """Test toggling settings ON and OFF in sequence"""
        session = requests.Session()
        
        # Login
        login_response = session.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        assert login_response.status_code == 200

        # Set to False
        response_false = session.put(
            f"{BASE_URL}/api/settings",
            json={"isJanmashtamiThemeActive": False}
        )
        assert response_false.status_code == 200
        assert response_false.json()["isJanmashtamiThemeActive"] == False
        print("✓ Set isJanmashtamiThemeActive to False")

        # Verify False
        get_false = session.get(f"{BASE_URL}/api/settings")
        assert get_false.json()["isJanmashtamiThemeActive"] == False
        print("✓ Verified isJanmashtamiThemeActive is False")

        # Set to True
        response_true = session.put(
            f"{BASE_URL}/api/settings",
            json={"isJanmashtamiThemeActive": True}
        )
        assert response_true.status_code == 200
        assert response_true.json()["isJanmashtamiThemeActive"] == True
        print("✓ Set isJanmashtamiThemeActive to True")

        # Verify True
        get_true = session.get(f"{BASE_URL}/api/settings")
        assert get_true.json()["isJanmashtamiThemeActive"] == True
        print("✓ Verified isJanmashtamiThemeActive is True")


class TestAuthEndpoints:
    """Tests for authentication endpoints"""

    def test_login_with_valid_credentials(self):
        """POST /api/auth/login with valid admin credentials"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        assert response.status_code == 200, f"Login failed: {response.text}"
        
        data = response.json()
        assert data["email"] == ADMIN_EMAIL
        assert data["role"] == "admin"
        print(f"✓ Login successful: {data['email']} ({data['role']})")

    def test_login_with_invalid_credentials(self):
        """POST /api/auth/login with invalid credentials returns 401"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": "wrong@email.com", "password": "wrongpassword"}
        )
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✓ Invalid credentials return 401")

    def test_auth_me_without_token(self):
        """GET /api/auth/me without token returns 401"""
        response = requests.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code == 401
        print("✓ GET /api/auth/me without token returns 401")

    def test_auth_me_with_session(self):
        """GET /api/auth/me with valid session returns user data"""
        session = requests.Session()
        
        # Login first
        login_response = session.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        assert login_response.status_code == 200

        # Get current user
        me_response = session.get(f"{BASE_URL}/api/auth/me")
        assert me_response.status_code == 200
        
        data = me_response.json()
        assert data["email"] == ADMIN_EMAIL
        assert data["role"] == "admin"
        print(f"✓ GET /api/auth/me returns: {data['email']} ({data['role']})")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
