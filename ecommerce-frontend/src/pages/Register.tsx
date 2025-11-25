// 📝 src/pages/Register.tsx
// Page d'inscription

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
import { api } from "../services/api";

const Register: React.FC = () => {
  // 🎯 State management
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  /**
   * ✅ Validation email
   */
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * 📝 Handle Registration
   */
  const handleRegister = async () => {
    // ✅ Validations
    if (
      !username.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      setError("⚠️ Veuillez remplir tous les champs");
      return;
    }

    if (!isValidEmail(email)) {
      setError("⚠️ Email invalide");
      return;
    }

    if (password.length < 6) {
      setError("⚠️ Mot de passe doit contenir au moins 6 caractères");
      return;
    }

    if (password !== confirmPassword) {
      setError("⚠️ Les mots de passe ne correspondent pas");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // 📡 API call vers backend
      await api.post("/auth/register", {
        username: username.trim(),
        email: email.trim(),
        password,
        role: "user", // Default role
      });

      // ✅ Succès
      console.log("✅ Inscription réussie");
      alert("✅ Compte créé avec succès! Connectez-vous maintenant.");
      
      // Redirect vers login
      navigate("/login");
    } catch (err) {
      console.error("❌ Erreur inscription:", err);

      // 🎯 Gestion erreurs
      let errorMessage = "❌ Erreur lors de l'inscription";

      if (err instanceof AxiosError) {
        if (err.response?.status === 400) {
          errorMessage = "⚠️ Cet utilisateur existe déjà";
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
      handleRegister();
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
            Créez votre compte pour commencer vos achats
          </p>
        </div>

        {/* 📝 Register Card */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle style={{ fontSize: "24px", textAlign: "center" }}>
              📝 Créer un compte
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

            {/* 👤 Username Input */}
            <IonInput
              label="Nom d'utilisateur"
              labelPlacement="floating"
              type="text"
              value={username}
              onIonInput={(e) => setUsername(e.detail.value || "")}
              onKeyPress={handleKeyPress}
              fill="outline"
              placeholder="john_doe"
              style={{ marginBottom: "15px" }}
              disabled={loading}
            />

            {/* 📧 Email Input */}
            <IonInput
              label="Email"
              labelPlacement="floating"
              type="email"
              value={email}
              onIonInput={(e) => setEmail(e.detail.value || "")}
              onKeyPress={handleKeyPress}
              fill="outline"
              placeholder="john@example.com"
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
              style={{ marginBottom: "15px" }}
              disabled={loading}
            />

            {/* 🔒 Confirm Password Input */}
            <IonInput
              label="Confirmer mot de passe"
              labelPlacement="floating"
              type="password"
              value={confirmPassword}
              onIonInput={(e) => setConfirmPassword(e.detail.value || "")}
              onKeyPress={handleKeyPress}
              fill="outline"
              placeholder="••••••••"
              style={{ marginBottom: "20px" }}
              disabled={loading}
            />

            {/* 🚀 Register Button */}
            <IonButton
              expand="block"
              onClick={handleRegister}
              disabled={loading}
              size="large"
              color="success"
            >
              {loading ? (
                <>
                  <IonSpinner name="crescent" style={{ marginRight: "10px" }} />
                  Création en cours...
                </>
              ) : (
                "✅ Créer mon compte"
              )}
            </IonButton>

            {/* 🔐 Login Link */}
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <IonText color="medium">
                <p style={{ margin: "10px 0 5px" }}>
                  Vous avez déjà un compte?
                </p>
              </IonText>
              <IonButton
                fill="clear"
                routerLink="/login"
                disabled={loading}
              >
                🔐 Se connecter
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Register;