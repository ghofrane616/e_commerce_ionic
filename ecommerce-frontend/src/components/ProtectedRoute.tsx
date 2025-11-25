import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { IonSpinner } from "@ionic/react";

interface Props {
  children: React.ReactNode;
  role?: string; // admin ou user
}

const ProtectedRoute: React.FC<Props> = ({ children, role }) => {
  // 🎯 State pour vérifier si on charge
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string>("");

  // 🔐 Vérifier si user est connecté
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("token");

        // ❌ Pas de token = redirect login
        if (!token) {
          setIsAuthenticated(false);
          setIsChecking(false);
          return;
        }

        // 🔍 Decoder le token pour vérifier validité
        try {
          // Decode JWT payload (partie 2 du token)
          const payload = JSON.parse(atob(token.split(".")[1]));

          // ⏰ Vérifier si token expiré
          const currentTime = Math.floor(Date.now() / 1000);
          if (payload.exp && payload.exp < currentTime) {
            console.log("⚠️ Token expiré");
            localStorage.removeItem("token");
            setIsAuthenticated(false);
            setIsChecking(false);
            return;
          }

          // ✅ Token valide
          setIsAuthenticated(true);
          setUserRole(payload.role || "user");
        } catch (decodeError) {
          // Token invalide (format incorrect)
          console.error("❌ Token invalide:", decodeError);
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("❌ Erreur vérification auth:", error);
        setIsAuthenticated(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, []);

  // 🔄 Loading spinner pendant vérification
  if (isChecking) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <IonSpinner name="crescent" color="primary" />
        <p>Vérification...</p>
      </div>
    );
  }

  // ❌ Pas authentifié = redirect login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 🔒 Vérifier le rôle si spécifié
  if (role && userRole !== role) {
    // Si user demande page admin mais n'est pas admin
    console.log(`⚠️ Accès refusé: role requis="${role}", role user="${userRole}"`);
    return <Navigate to="/" replace />;
  }

  // ✅ Tout est bon, afficher la page
  return <>{children}</>;
};

export default ProtectedRoute;