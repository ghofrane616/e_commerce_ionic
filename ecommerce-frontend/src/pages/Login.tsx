// 🔐 src/pages/Login.tsx
// Page de connexion avec authentification JWT

import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSpinner,
  IonText,
} from "@ionic/react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { api, setAuthToken } from "../services/api";

const Login: React.FC = () => {
  // 🎯 State management
  const [emailOrUsername, setEmailOrUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  /**
   * 🔐 Handle Login
   * Envoyer credentials au backend et récupérer token
   */
  const handleLogin = async () => {
    // ✅ Validation basique
    if (!emailOrUsername.trim() || !password.trim()) {
      setError("⚠️ Veuillez remplir tous les champs");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // 📡 API call vers backend
      const { data } = await api.post("/auth/login", {
        emailOrUsername: emailOrUsername.trim(),
        password,
      });

      // ✅ Sauvegarder token
      if (data.token) {
        setAuthToken(data.token);
        
        // 🎉 Succès - redirect vers home
        console.log("✅ Connexion réussie:", data.user);
        navigate("/", { replace: true });
      } else {
        setError("❌ Erreur: Token non reçu");
      }
    } catch (err) {
      console.error("❌ Erreur login:", err);

      // 🎯 Gestion erreurs
      let errorMessage = "❌ Erreur de connexion";
      
      if (err instanceof AxiosError) {
        if (err.response?.status === 400) {
          errorMessage = "⚠️ Email/Username ou mot de passe incorrect";
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.message === "Network Error") {
          errorMessage = "🌐 Erreur réseau - Vérifiez que le backend est lancé";
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * ⌨️ Handle Enter key press
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        {/* 🎨 Hero Section */}
        <div
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "15px",
            padding: "40px 20px",
            textAlign: "center",
            color: "white",
            marginBottom: "30px",
            marginTop: "20px",
          }}
        >
          <h1 style={{ margin: "0 0 10px 0", fontSize: "32px" }}>
            🛍️ E-Commerce
          </h1>
          <p style={{ margin: 0, opacity: 0.9 }}>
            Bienvenue! Connectez-vous pour continuer
          </p>
        </div>

        {/* 📝 Login Card */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle style={{ fontSize: "24px", textAlign: "center" }}>
              🔐 Se connecter
            </IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            {/* ❌ Error message */}
            {error && (
              <div
                style={{
                  background: "#fee",
                  color: "#c33",
                  padding: "10px",
                  borderRadius: "8px",
                  marginBottom: "15px",
                  fontSize: "14px",
                }}
              >
                {error}
              </div>
            )}

            {/* 📧 Email/Username Input */}
            <IonInput
              label="Email ou Username"
              labelPlacement="floating"
              type="text"
              value={emailOrUsername}
              onIonInput={(e) => setEmailOrUsername(e.detail.value || "")}
              onKeyPress={handleKeyPress}
              fill="outline"
              placeholder="admin@ecommerce.tn"
              style={{ marginBottom: "15px" }}
              disabled={loading}
            />

            {/* 🔒 Password Input */}
            <IonInput
              label="Mot de passe"
              labelPlacement="floating"
              type="password"
              value={password}
              onIonInput={(e) => setPassword(e.detail.value || "")}
              onKeyPress={handleKeyPress}
              fill="outline"
              placeholder="••••••••"
              style={{ marginBottom: "20px" }}
              disabled={loading}
            />

            {/* 🚀 Login Button */}
            <IonButton
              expand="block"
              onClick={handleLogin}
              disabled={loading}
              size="large"
            >
              {loading ? (
                <>
                  <IonSpinner name="crescent" style={{ marginRight: "10px" }} />
                  Connexion...
                </>
              ) : (
                "🔓 Se connecter"
              )}
            </IonButton>

            {/* 📝 Register Link */}
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <IonText color="medium">
                <p style={{ margin: "10px 0 5px" }}>
                  Pas encore de compte?
                </p>
              </IonText>
              <IonButton
                fill="clear"
                routerLink="/register"
                disabled={loading}
              >
                📝 Créer un compte
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>

        {/* 💡 Info comptes test */}
        <IonCard style={{ marginTop: "20px" }}>
          
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Login;