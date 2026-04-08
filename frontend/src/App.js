import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";
import HomePage from "@/pages/HomePage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import CategoriesPage from "@/pages/CategoriesPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import AdminDashboard from "@/pages/AdminDashboard";
import FirebaseAdminLogin from "@/pages/FirebaseAdminLogin";
import FirebaseAdminDashboard from "@/pages/FirebaseAdminDashboard";
import FirebaseAdminProducts from "@/pages/FirebaseAdminProducts";
import FirebaseAdminOrders from "@/pages/FirebaseAdminOrders";
import FirebaseAdminSettings from "@/pages/FirebaseAdminSettings";
import { Toaster } from "@/components/ui/sonner";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    // Log Firebase initialization on app load
    console.log('🚀 App loaded - Firebase should be initialized');
    console.log('🌍 Current URL:', window.location.href);
  }, []);

  return (
    <div className="App">
      <AuthProvider>
        <AdminAuthProvider>
          <CartProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                
                {/* MongoDB Admin Routes */}
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                
                {/* Firebase Admin Routes */}
                <Route path="/firebase-admin/login" element={<FirebaseAdminLogin />} />
                <Route path="/firebase-admin/dashboard" element={
                  <ProtectedAdminRoute>
                    <FirebaseAdminDashboard />
                  </ProtectedAdminRoute>
                } />
                <Route path="/firebase-admin/products" element={
                  <ProtectedAdminRoute>
                    <FirebaseAdminProducts />
                  </ProtectedAdminRoute>
                } />
                <Route path="/firebase-admin/orders" element={
                  <ProtectedAdminRoute>
                    <FirebaseAdminOrders />
                  </ProtectedAdminRoute>
                } />
                <Route path="/firebase-admin/settings" element={
                  <ProtectedAdminRoute>
                    <FirebaseAdminSettings />
                  </ProtectedAdminRoute>
                } />
              </Routes>
            </BrowserRouter>
            <Toaster position="top-right" />
          </CartProvider>
        </AdminAuthProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
