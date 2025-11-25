// 📦 src/pages/OrderHistory.tsx
// Page historique des commandes utilisateur

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
  IonBadge,
  IonList,
  IonItem,
  IonLabel,
  useIonToast,
} from "@ionic/react";
import { AxiosError } from "axios";
import { api } from "../services/api";
import Header from "../components/Header";

// 📦 Types TypeScript
interface Product {
  _id: string;
  name: string;
  price: number;
}

interface OrderItem {
  product: Product;
  qty: number;
  price: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered";
  createdAt: string;
}

const OrderHistory: React.FC = () => {
  // 🎯 State management
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [present] = useIonToast();

  /**
   * 🎨 Couleur selon status
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "warning"; // 🟡
      case "processing":
        return "primary"; // 🔵
      case "shipped":
        return "secondary"; // 🟣
      case "delivered":
        return "success"; // 🟢
      default:
        return "medium";
    }
  };

  /**
   * 🎨 Emoji selon status
   */
  const getStatusEmoji = (status: string) => {
    switch (status) {
      case "pending":
        return "⏳";
      case "processing":
        return "📦";
      case "shipped":
        return "🚚";
      case "delivered":
        return "✅";
      default:
        return "📋";
    }
  };

  /**
   * 📅 Formatter date
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /**
   * 📡 Charger commandes depuis backend
   */
  const loadOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/orders/my");

      // ✅ Vérifier si array
      if (Array.isArray(data)) {
        // Trier par date (plus récent d'abord)
        const sorted = data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setOrders(sorted);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("❌ Erreur chargement commandes:", err);

      let errorMessage = "❌ Erreur de chargement";
      if (err instanceof AxiosError) {
        errorMessage = err.response?.data?.message || err.message;
      }

      present({
        message: errorMessage,
        duration: 2000,
        color: "danger",
      });

      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // 🚀 Load orders on mount
  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <IonPage>
      <Header />
      <IonContent className="ion-padding">
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
          📦 Mes Commandes
        </h1>

        {/* 🔄 Loading */}
        {loading && (
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <IonSpinner name="crescent" />
            <p>Chargement...</p>
          </div>
        )}

        {/* 📭 Aucune commande */}
        {!loading && orders.length === 0 && (
          <IonCard>
            <IonCardContent style={{ textAlign: "center", padding: "40px" }}>
              <div style={{ fontSize: "60px", marginBottom: "20px" }}>📦</div>
              <h2>Aucune commande</h2>
              <IonText color="medium">
                <p>Vous n'avez pas encore passé de commande</p>
              </IonText>
            </IonCardContent>
          </IonCard>
        )}

        {/* ✅ Afficher commandes */}
        {!loading && orders.length > 0 && (
          <div>
            {orders.map((order) => (
              <IonCard key={order._id} style={{ marginBottom: "15px" }}>
                {/* 📋 Header */}
                <IonCardHeader>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <IonCardTitle style={{ fontSize: "18px" }}>
                      {getStatusEmoji(order.status)} Commande #
                      {order._id.slice(-6)}
                    </IonCardTitle>
                    
                    <IonBadge color={getStatusColor(order.status)}>
                      {order.status.toUpperCase()}
                    </IonBadge>
                  </div>
                  
                  <IonText color="medium" style={{ fontSize: "14px" }}>
                    📅 {formatDate(order.createdAt)}
                  </IonText>
                </IonCardHeader>

                {/* 📦 Liste produits */}
                <IonCardContent>
                  <IonList>
                    {order.items.map((item, index) => (
                      <IonItem key={index} lines="none">
                        <IonLabel>
                          <h3>{item.product.name}</h3>
                          <p>
                            Quantité: {item.qty} × {item.price} DT
                          </p>
                        </IonLabel>
                        <IonText slot="end" color="primary">
                          <strong>{item.qty * item.price} DT</strong>
                        </IonText>
                      </IonItem>
                    ))}
                  </IonList>

                  {/* 💰 Total */}
                  <div
                    style={{
                      marginTop: "15px",
                      paddingTop: "15px",
                      borderTop: "1px solid #ddd",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <IonText>
                      <strong>Total:</strong>
                    </IonText>
                    <IonText color="success">
                      <h2 style={{ margin: 0 }}>{order.total} DT</h2>
                    </IonText>
                  </div>
                </IonCardContent>
              </IonCard>
            ))}
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default OrderHistory;