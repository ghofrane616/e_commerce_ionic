// 📱 Header Component - Navigation bar
// Yodhhor fel kol pages w fih: Logo, Menu, Cart, Profile

import React, { useEffect, useState } from "react";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonMenuButton,
  IonMenu,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
} from "@ionic/react";
import {
  homeOutline,
  cartOutline,
  personOutline,
  receiptOutline,
  logOutOutline,
  gridOutline,
} from "ionicons/icons";
import { useLocation } from "react-router-dom";
import { setAuthToken } from "../services/api";

const Header: React.FC = () => {
  const location = useLocation();
  
  // 🎯 State pour détecter le rôle user
  const [userRole, setUserRole] = useState<string>("user");

  // 🚪 Déconnexion
  const logout = () => {
    setAuthToken(null);
    window.location.href = "/login";
  };

  // 🔍 Check user role from token
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        // Decode JWT payload (simple base64 decode)
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserRole(payload.role || "user");
      }
    } catch (err) {
      console.error("Error decoding token:", err);
      setUserRole("user");
    }
  }, []);

  // 🎨 Check if route is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* 🍔 Side Menu (responsive mobile) */}
      <IonMenu contentId="main-content" type="overlay">
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            {/* 🏠 Home */}
            <IonItem
              button
              routerLink="/home"
              detail={false}
              lines="full"
              style={{
                background: isActive("/home") ? "#f0f0f0" : "transparent",
              }}
            >
              <IonIcon icon={homeOutline} slot="start" />
              <IonLabel>Accueil</IonLabel>
            </IonItem>

            {/* 🛒 Panier */}
            <IonItem
              button
              routerLink="/cart"
              detail={false}
              lines="full"
              style={{
                background: isActive("/cart") ? "#f0f0f0" : "transparent",
              }}
            >
              <IonIcon icon={cartOutline} slot="start" />
              <IonLabel>Panier</IonLabel>
            </IonItem>

            {/* 📦 Mes Commandes */}
            <IonItem
              button
              routerLink="/orders"
              detail={false}
              lines="full"
              style={{
                background: isActive("/orders") ? "#f0f0f0" : "transparent",
              }}
            >
              <IonIcon icon={receiptOutline} slot="start" />
              <IonLabel>Mes Commandes</IonLabel>
            </IonItem>

            {/* 👤 Profil */}
            <IonItem
              button
              routerLink="/profile"
              detail={false}
              lines="full"
              style={{
                background: isActive("/profile") ? "#f0f0f0" : "transparent",
              }}
            >
              <IonIcon icon={personOutline} slot="start" />
              <IonLabel>Mon Profil</IonLabel>
            </IonItem>

            {/* 👑 Admin Section (si admin) */}
            {userRole === "admin" && (
              <>
                <IonItem lines="none" style={{ marginTop: "20px" }}>
                  <IonLabel color="primary">
                    <strong>👑 Administration</strong>
                  </IonLabel>
                </IonItem>

                <IonItem
                  button
                  routerLink="/admin"
                  detail={false}
                  lines="full"
                  style={{
                    background: isActive("/admin") ? "#f0f0f0" : "transparent",
                  }}
                >
                  <IonIcon icon={gridOutline} slot="start" />
                  <IonLabel>Gérer Produits</IonLabel>
                </IonItem>

                <IonItem
                  button
                  routerLink="/admin/orders"
                  detail={false}
                  lines="full"
                  style={{
                    background: isActive("/admin/orders")
                      ? "#f0f0f0"
                      : "transparent",
                  }}
                >
                  <IonIcon icon={receiptOutline} slot="start" />
                  <IonLabel>Gérer Commandes</IonLabel>
                </IonItem>
              </>
            )}

            {/* 🚪 Déconnexion */}
            <IonItem
              button
              onClick={logout}
              detail={false}
              lines="full"
              style={{ marginTop: "20px" }}
            >
              <IonIcon icon={logOutOutline} slot="start" color="danger" />
              <IonLabel color="danger">Déconnexion</IonLabel>
            </IonItem>
          </IonList>
        </IonContent>
      </IonMenu>

      {/* 📱 Header principal */}
      <IonHeader>
        <IonToolbar color="primary">
          {/* 🍔 Menu button (mobile) */}
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>

          {/* 🎨 Title */}
          <IonTitle>🛍️ E-Commerce</IonTitle>

          {/* 🔘 Desktop buttons (hidden on mobile) */}
          <IonButtons slot="end" className="ion-hide-md-down">
            <IonButton routerLink="/home">
              <IonIcon icon={homeOutline} slot="start" />
              Accueil
            </IonButton>

            <IonButton routerLink="/cart">
              <IonIcon icon={cartOutline} slot="start" />
              Panier
            </IonButton>

            <IonButton routerLink="/orders">
              <IonIcon icon={receiptOutline} slot="start" />
              Commandes
            </IonButton>

            <IonButton routerLink="/profile">
              <IonIcon icon={personOutline} slot="start" />
              Profil
            </IonButton>

            {/* Admin button (si admin) */}
            {userRole === "admin" && (
              <>
                <IonButton routerLink="/admin" color="light">
                  <IonIcon icon={gridOutline} slot="start" />
                  Admin
                </IonButton>
              </>
            )}

            <IonButton onClick={logout} color="danger">
              <IonIcon icon={logOutOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
    </>
  );
};

export default Header;