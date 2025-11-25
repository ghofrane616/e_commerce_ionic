import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSpinner,
  IonText,
  IonButton,
  IonIcon,
  IonAvatar,
  IonList,
  IonItem,
  IonLabel,
  useIonToast,
} from "@ionic/react";
import {
  personCircleOutline,
  mailOutline,
  calendarOutline,
  shieldCheckmarkOutline,
  logOutOutline,
} from "ionicons/icons";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { api, setAuthToken } from "../services/api";
import Header from "../components/Header";

// 📦 Type User
interface UserProfile {
  _id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

const Profile: React.FC = () => {
  // 🎯 State management
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderCount, setOrderCount] = useState(0);
  
  const navigate = useNavigate();
  const [present] = useIonToast();

  // 📅 Formatter date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // 📡 Charger profil utilisateur
  const loadProfile = async () => {
    try {
      setLoading(true);

      // 📡 Decoder le token bech nal9aw user ID
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      // Decode JWT manually (simple base64 decode)
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.id;

      // 📡 Charger user info (optional - ken 3andek endpoint /users/me)
      // Si ma 3andekch endpoint, nista3mlou juste payload
      setUser({
        _id: userId,
        username: "User", // Ken 3andek username fel token ista3mlou
        email: payload.email || "email@example.com",
        role: payload.role || "user",
        createdAt: new Date().toISOString(), // Placeholder
      });

      // 📡 Charger 3adad el commandes
      const { data: orders } = await api.get("/orders/my");
      if (Array.isArray(orders)) {
        setOrderCount(orders.length);
      }
    } catch (err) {
      console.error("❌ Erreur chargement profil:", err);
      
      let errorMessage = "❌ Erreur de chargement";
      if (err instanceof AxiosError) {
        errorMessage = err.response?.data?.message || err.message;
      }
      
      present({
        message: errorMessage,
        duration: 2000,
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  // 🚪 Déconnexion
  const handleLogout = () => {
    setAuthToken(null);
    present({
      message: "👋 Déconnecté avec succès",
      duration: 2000,
      color: "success",
    });
    navigate("/login");
  };

  // 🚀 Charger profil ki tban page
  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <IonPage>
      <Header />
      <IonContent className="ion-padding">
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
          👤 Mon Profil
        </h1>

        {/* 🔄 Loading */}
        {loading && (
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <IonSpinner name="crescent" />
            <p>Chargement...</p>
          </div>
        )}

        {/* ✅ Afficher profil */}
        {!loading && user && (
          <>
            {/* 🎨 Card profil principal */}
            <IonCard>
              <IonCardContent>
                {/* 👤 Avatar */}
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <IonAvatar
                    style={{
                      width: "100px",
                      height: "100px",
                      margin: "0 auto",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "50px",
                        color: "white",
                      }}
                    >
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  </IonAvatar>
                  
                  <h2 style={{ marginTop: "15px", marginBottom: "5px" }}>
                    {user.username}
                  </h2>
                  
                  <IonText color="medium">
                    <p style={{ margin: 0 }}>{user.email}</p>
                  </IonText>
                </div>

                {/* 🏷️ Badge rôle */}
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <span
                    style={{
                      background:
                        user.role === "admin"
                          ? "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                          : "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                      color: "white",
                      padding: "8px 20px",
                      borderRadius: "20px",
                      fontSize: "14px",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    }}
                  >
                    {user.role === "admin" ? "👑 Admin" : "👤 User"}
                  </span>
                </div>
              </IonCardContent>
            </IonCard>

            {/* 📊 Statistics */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
                marginBottom: "20px",
              }}
            >
              <IonCard style={{ margin: 0, textAlign: "center" }}>
                <IonCardContent>
                  <h2 style={{ color: "#3880ff", margin: "5px 0", fontSize: "32px" }}>
                    {orderCount}
                  </h2>
                  <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
                    Commandes
                  </p>
                </IonCardContent>
              </IonCard>

              <IonCard style={{ margin: 0, textAlign: "center" }}>
                <IonCardContent>
                  <h2 style={{ color: "#2dd36f", margin: "5px 0", fontSize: "32px" }}>
                    {user.role === "admin" ? "∞" : orderCount}
                  </h2>
                  <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
                    Points
                  </p>
                </IonCardContent>
              </IonCard>
            </div>

            {/* ℹ️ Informations détaillées */}
            <IonCard>
              <IonCardHeader>
                <IonCardTitle style={{ fontSize: "18px" }}>
                  📋 Informations
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonList>
                  {/* Username */}
                  <IonItem lines="full">
                    <IonIcon icon={personCircleOutline} slot="start" color="primary" />
                    <IonLabel>
                      <p style={{ fontSize: "12px", color: "#666" }}>Nom d'utilisateur</p>
                      <h3>{user.username}</h3>
                    </IonLabel>
                  </IonItem>

                  {/* Email */}
                  <IonItem lines="full">
                    <IonIcon icon={mailOutline} slot="start" color="primary" />
                    <IonLabel>
                      <p style={{ fontSize: "12px", color: "#666" }}>Email</p>
                      <h3>{user.email}</h3>
                    </IonLabel>
                  </IonItem>

                  {/* Rôle */}
                  <IonItem lines="full">
                    <IonIcon icon={shieldCheckmarkOutline} slot="start" color="primary" />
                    <IonLabel>
                      <p style={{ fontSize: "12px", color: "#666" }}>Rôle</p>
                      <h3 style={{ textTransform: "capitalize" }}>{user.role}</h3>
                    </IonLabel>
                  </IonItem>

                  {/* Date création */}
                  <IonItem lines="none">
                    <IonIcon icon={calendarOutline} slot="start" color="primary" />
                    <IonLabel>
                      <p style={{ fontSize: "12px", color: "#666" }}>Membre depuis</p>
                      <h3>{formatDate(user.createdAt)}</h3>
                    </IonLabel>
                  </IonItem>
                </IonList>
              </IonCardContent>
            </IonCard>

            {/* 🎯 Actions rapides */}
            <IonCard>
              <IonCardHeader>
                <IonCardTitle style={{ fontSize: "18px" }}>
                  ⚡ Actions rapides
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonButton
                  expand="block"
                  routerLink="/orders"
                  style={{ marginBottom: "10px" }}
                >
                  📦 Mes Commandes
                </IonButton>

                <IonButton
                  expand="block"
                  routerLink="/cart"
                  color="secondary"
                  style={{ marginBottom: "10px" }}
                >
                  🛒 Mon Panier
                </IonButton>

                {user.role === "admin" && (
                  <>
                    <IonButton
                      expand="block"
                      routerLink="/admin"
                      color="tertiary"
                      style={{ marginBottom: "10px" }}
                    >
                      🛍️ Gérer Produits
                    </IonButton>

                    <IonButton
                      expand="block"
                      routerLink="/admin/orders"
                      color="tertiary"
                      style={{ marginBottom: "10px" }}
                    >
                      📊 Gérer Commandes
                    </IonButton>
                  </>
                )}

                <IonButton
                  expand="block"
                  color="danger"
                  onClick={handleLogout}
                  style={{ marginTop: "20px" }}
                >
                  <IonIcon icon={logOutOutline} slot="start" />
                  Se déconnecter
                </IonButton>
              </IonCardContent>
            </IonCard>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Profile