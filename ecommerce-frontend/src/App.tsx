import React from "react";
import { IonApp, setupIonicReact } from "@ionic/react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// 🔐 Pages publiques
import Login from "./pages/Login";
import Register from "./pages/Register";

// 🏠 Pages utilisateur
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import OrderHistory from "./pages/OrderHistory";
import Profile from "./pages/Profile";

// 👑 Pages admin
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";

// 🔒 Protection routes
import ProtectedRoute from "./components/ProtectedRoute";

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <BrowserRouter>
      <Routes>
        {/* 🌐 Routes publiques (pas besoin login) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🏠 Routes utilisateur (besoin login) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/product/:id"
          element={
            <ProtectedRoute>
              <ProductDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* 👑 Routes admin (besoin login + role admin) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute role="admin">
              <AdminOrders />
            </ProtectedRoute>
          }
        />

        {/* 🔄 Redirect automatique si path غير معروف */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  </IonApp>
);

export default App;