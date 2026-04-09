import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";
import WhatsAppButton from "@/components/WhatsAppButton";
import HomePage from "@/pages/HomePage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import CategoriesPage from "@/pages/CategoriesPage";
import FirebaseAdminLogin from "@/pages/FirebaseAdminLogin";
import FirebaseAdminDashboard from "@/pages/FirebaseAdminDashboard";
import FirebaseAdminProducts from "@/pages/FirebaseAdminProducts";
import FirebaseAdminOrders from "@/pages/FirebaseAdminOrders";
import FirebaseAdminSettings from "@/pages/FirebaseAdminSettings";
import { Toaster } from "@/components/ui/sonner";

/** Show WhatsApp button only on public storefront pages */
const ConditionalWhatsApp = () => {
  const { pathname } = useLocation();
  if (pathname.startsWith('/firebase-admin') || pathname.startsWith('/admin')) return null;
  return <WhatsAppButton />;
};

function App() {
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
                
                {/* Redirect old admin routes to Firebase admin */}
                <Route path="/admin/login" element={<Navigate to="/firebase-admin/login" replace />} />
                <Route path="/admin/dashboard" element={<Navigate to="/firebase-admin/dashboard" replace />} />
                
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
              <ConditionalWhatsApp />
            </BrowserRouter>
            <Toaster position="top-right" />
          </CartProvider>
        </AdminAuthProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
