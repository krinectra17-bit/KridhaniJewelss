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
import AdminLogin from "@/pages/FirebaseAdminLogin";
import AdminDashboard from "@/pages/FirebaseAdminDashboard";
import AdminProducts from "@/pages/FirebaseAdminProducts";
import AdminOrders from "@/pages/FirebaseAdminOrders";
import AdminSettings from "@/pages/FirebaseAdminSettings";
import OrderTrackingPage from "@/pages/OrderTrackingPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import TermsPage from "@/pages/TermsPage";
import NewArrivalsPage from "@/pages/NewArrivalsPage";
import ScrollToTop from "@/components/ScrollToTop";
import { Toaster } from "@/components/ui/sonner";

const ConditionalWhatsApp = () => {
  // Temporarily disabled
  return null;
};

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <AdminAuthProvider>
          <CartProvider>
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/new-arrivals" element={<NewArrivalsPage />} />
                <Route path="/track-order" element={<OrderTrackingPage />} />
                <Route path="/terms" element={<TermsPage />} />

                {/* Redirect old firebase-admin routes */}
                <Route path="/firebase-admin/*" element={<Navigate to="/admin/login" replace />} />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={
                  <ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>
                } />
                <Route path="/admin/products" element={
                  <ProtectedAdminRoute><AdminProducts /></ProtectedAdminRoute>
                } />
                <Route path="/admin/orders" element={
                  <ProtectedAdminRoute><AdminOrders /></ProtectedAdminRoute>
                } />
                <Route path="/admin/settings" element={
                  <ProtectedAdminRoute><AdminSettings /></ProtectedAdminRoute>
                } />
              </Routes>
              {/* <ConditionalWhatsApp /> */}
            </BrowserRouter>
            <Toaster position="top-right" />
          </CartProvider>
        </AdminAuthProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
