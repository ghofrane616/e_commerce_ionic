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
  IonList,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  useIonToast,
  IonSearchbar,
} from "@ionic/react";
import { AxiosError } from "axios";
import { api } from "../services/api";
import Header from "../components/Header";

// 📦 Types TypeScript
interface User {
  _id: string;
  username: string;
  email: string;
}

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
  user: User;
  items: OrderItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered";
  createdAt: string;
}

const AdminOrders: React.FC = () => {
  // 🎯 State management
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // 🔔 Toast notifications
  const [present] = useIonToast();

  // 🎨 Colors 7asab status

  // 🎨 Emojis 7asab status
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

  // 📅 Formatter date
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

  // 📡 Charger toutes les commandes
  const loadOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/orders");

      if (Array.isArray(data)) {
        // 🔄 Trier par date (plus récent en premier)
        const sorted = data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setOrders(sorted);
        setFilteredOrders(sorted);
      } else {
        setOrders([]);
        setFilteredOrders([]);
      }
    } catch (err) {
      // ✅ Type-safe error handling
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
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Changer status commande
  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });

      // ✅ Update local state (type-safe)
      const updated = orders.map((order) =>
        order._id === orderId
          ? { ...order, status: newStatus as Order["status"] }
          : order
      );
      setOrders(updated);
      filterOrders(updated, searchText, statusFilter);

      present({
        message: `✅ Statut mis à jour: ${newStatus}`,
        duration: 2000,
        color: "success",
      });
    } catch (err) {
      // ✅ Type-safe error handling
      console.error("❌ Erreur update status:", err);

      let errorMessage = "❌ Erreur de mise à jour";
      if (err instanceof AxiosError) {
        errorMessage = err.response?.data?.message || err.message;
      }

      present({
        message: errorMessage,
        duration: 2000,
        color: "danger",
      });
    }
  };

  // 🔍 Filter orders (search + status)
  const filterOrders = (
    ordersList: Order[],
    search: string,
    status: string
  ) => {
    let filtered = ordersList;

    // Filter by status
    if (status !== "all") {
      filtered = filtered.filter((order) => order.status === status);
    }

    // Filter by search (username, email, order id)
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.user.username.toLowerCase().includes(searchLower) ||
          order.user.email.toLowerCase().includes(searchLower) ||
          order._id.toLowerCase().includes(searchLower)
      );
    }

    setFilteredOrders(filtered);
  };

  // 🔍 Handle search
  const handleSearch = (value: string) => {
    setSearchText(value);
    filterOrders(orders, value, statusFilter);
  };

  // 🔍 Handle status filter
  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    filterOrders(orders, searchText, value);
  };

  // 📊 Calculer statistiques
  const getStats = () => {
    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      processing: orders.filter((o) => o.status === "processing").length,
      shipped: orders.filter((o) => o.status === "shipped").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
    };
  };

  const stats = getStats();

  // 🚀 Load orders ki tban page
  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <IonPage>
      <Header />
      <IonContent className="ion-padding">
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
          🛍️ Gestion des Commandes
        </h1>

        {/* 📊 Statistics Cards */}
        {!loading && orders.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <IonCard style={{ margin: 0, textAlign: "center" }}>
              <IonCardContent>
                <h2 style={{ color: "#3880ff", margin: "5px 0" }}>
                  {stats.total}
                </h2>
                <p style={{ margin: 0, fontSize: "14px" }}>Total</p>
              </IonCardContent>
            </IonCard>

            <IonCard style={{ margin: 0, textAlign: "center" }}>
              <IonCardContent>
                <h2 style={{ color: "#ffc409", margin: "5px 0" }}>
                  {stats.pending}
                </h2>
                <p style={{ margin: 0, fontSize: "14px" }}>En attente</p>
              </IonCardContent>
            </IonCard>

            <IonCard style={{ margin: 0, textAlign: "center" }}>
              <IonCardContent>
                <h2 style={{ color: "#2dd36f", margin: "5px 0" }}>
                  {stats.delivered}
                </h2>
                <p style={{ margin: 0, fontSize: "14px" }}>Livrées</p>
              </IonCardContent>
            </IonCard>

            <IonCard style={{ margin: 0, textAlign: "center" }}>
              <IonCardContent>
                <h2 style={{ color: "#2dd36f", margin: "5px 0" }}>
                  {stats.totalRevenue} DT
                </h2>
                <p style={{ margin: 0, fontSize: "14px" }}>Revenu Total</p>
              </IonCardContent>
            </IonCard>
          </div>
        )}

        {/* 🔍 Search & Filter */}
        {!loading && orders.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <IonSearchbar
              placeholder="Rechercher par client, email, ID..."
              value={searchText}
              onIonInput={(e) => handleSearch(e.detail.value || "")}
            />

            <IonSelect
              value={statusFilter}
              placeholder="Filtrer par statut"
              onIonChange={(e) => handleStatusFilter(e.detail.value)}
              style={{ marginTop: "10px" }}
            >
              <IonSelectOption value="all">Tous les statuts</IonSelectOption>
              <IonSelectOption value="pending">⏳ En attente</IonSelectOption>
              <IonSelectOption value="processing">
                📦 En traitement
              </IonSelectOption>
              <IonSelectOption value="shipped">🚚 Expédiée</IonSelectOption>
              <IonSelectOption value="delivered">✅ Livrée</IonSelectOption>
            </IonSelect>
          </div>
        )}

        {/* 🔄 Loading */}
        {loading && (
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <IonSpinner name="crescent" />
            <p>Chargement...</p>
          </div>
        )}

        {/* 📭 Aucune commande */}
        {!loading && filteredOrders.length === 0 && orders.length === 0 && (
          <IonCard>
            <IonCardContent style={{ textAlign: "center", padding: "40px" }}>
              <h2>📦</h2>
              <IonText color="medium">
                <p>Aucune commande pour le moment</p>
              </IonText>
            </IonCardContent>
          </IonCard>
        )}

        {/* 📭 Résultats filtrés vides */}
        {!loading && filteredOrders.length === 0 && orders.length > 0 && (
          <IonCard>
            <IonCardContent style={{ textAlign: "center", padding: "40px" }}>
              <h2>🔍</h2>
              <IonText color="medium">
                <p>Aucun résultat trouvé</p>
              </IonText>
            </IonCardContent>
          </IonCard>
        )}

        {/* ✅ Afficher commandes */}
        {!loading && filteredOrders.length > 0 && (
          <div>
            {filteredOrders.map((order) => (
              <IonCard key={order._id} style={{ marginBottom: "15px" }}>
                {/* 📋 Header */}
                <IonCardHeader>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "10px",
                    }}
                  >
                    <div>
                      <IonCardTitle style={{ fontSize: "16px" }}>
                        {getStatusEmoji(order.status)} Commande #
                        {order._id.slice(-6)}
                      </IonCardTitle>
                      <IonText color="medium" style={{ fontSize: "13px" }}>
                        👤 {order.user.username} ({order.user.email})
                      </IonText>
                      <br />
                      <IonText color="medium" style={{ fontSize: "12px" }}>
                        📅 {formatDate(order.createdAt)}
                      </IonText>
                    </div>

                    {/* Status dropdown */}
                    <div style={{ minWidth: "150px" }}>
                      <IonSelect
                        value={order.status}
                        onIonChange={(e) =>
                          updateStatus(order._id, e.detail.value)
                        }
                        interface="popover"
                      >
                        <IonSelectOption value="pending">
                          ⏳ En attente
                        </IonSelectOption>
                        <IonSelectOption value="processing">
                          📦 En traitement
                        </IonSelectOption>
                        <IonSelectOption value="shipped">
                          🚚 Expédiée
                        </IonSelectOption>
                        <IonSelectOption value="delivered">
                          ✅ Livrée
                        </IonSelectOption>
                      </IonSelect>
                    </div>
                  </div>
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

export default AdminOrders;