// 🛒 src/pages/Cart.tsx
// Page panier - afficher produits et passer commande

import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonContent,
  IonCard,
  IonButton,
  IonText,
  IonSpinner,
  IonIcon,
  IonCardContent,
  useIonToast,
} from "@ionic/react";
import { trashOutline, checkmarkCircle } from "ionicons/icons";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { api } from "../services/api";
import Header from "../components/Header";

// 📦 Types
interface Product {
  _id: string;
  name: string;
  price: number;
  image?: string;
}

interface CartItem {
  product: Product;
  qty: number;
}

interface CartData {
  items: CartItem[];
}

const Cart: React.FC = () => {
  // 🎯 State management
  const [cart, setCart] = useState<CartData>({ items: [] });
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);

  const navigate = useNavigate();
  const [present] = useIonToast();

  /**
   * 📡 Charger panier depuis backend
   */
  const loadCart = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/cart");

      // ✅ Vérifier structure data
      const items: CartItem[] =
        data.items || data.cart?.items || data.panier?.items || [];

      // 🔍 Filter items valides (avec product)
      const validItems = items.filter((item) => item?.product);

      setCart({ items: validItems });
    } catch (err) {
      console.error("❌ Erreur chargement panier:", err);

      let errorMessage = "❌ Erreur de chargement";
      if (err instanceof AxiosError) {
        errorMessage = err.response?.data?.message || err.message;
      }

      present({
        message: errorMessage,
        duration: 2000,
        color: "danger",
      });

      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🗑️ Supprimer item du panier
   */
  const removeItem = async (productId: string) => {
    try {
      await api.post("/cart/remove", { productId });

      present({
        message: "✅ Produit retiré du panier",
        duration: 2000,
        color: "success",
      });

      // 🔄 Reload cart
      loadCart();
    } catch (err) {
      console.error("❌ Erreur suppression:", err);

      let errorMessage = "❌ Erreur de suppression";
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

  /**
   * ✅ Passer commande (checkout)
   */
  const checkout = async () => {
    if (cart.items.length === 0) {
      present({
        message: "⚠️ Votre panier est vide",
        duration: 2000,
        color: "warning",
      });
      return;
    }

    try {
      setCheckingOut(true);

      // 📡 API call checkout
      await api.post("/orders/checkout");

      present({
        message: "✅ Commande passée avec succès!",
        duration: 2500,
        color: "success",
      });

      // 🎉 Redirect vers historique commandes
      setTimeout(() => {
        navigate("/orders");
      }, 1000);
    } catch (err) {
      console.error("❌ Erreur checkout:", err);

      let errorMessage = "❌ Erreur lors de la commande";
      if (err instanceof AxiosError) {
        errorMessage = err.response?.data?.message || err.message;
      }

      present({
        message: errorMessage,
        duration: 2500,
        color: "danger",
      });
    } finally {
      setCheckingOut(false);
    }
  };

  /**
   * 💰 Calculer total panier
   */
  const calculateTotal = (): number => {
    return cart.items.reduce(
      (total, item) => total + item.product.price * item.qty,
      0
    );
  };

  // 🚀 Load cart on mount
  useEffect(() => {
    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <IonPage>
      <Header />
      <IonContent className="ion-padding">
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
          🛒 Mon Panier
        </h1>

        {/* 🔄 Loading */}
        {loading && (
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <IonSpinner name="crescent" />
            <p>Chargement du panier...</p>
          </div>
        )}

        {/* 📭 Panier vide */}
        {!loading && cart.items.length === 0 && (
          <IonCard>
            <IonCardContent style={{ textAlign: "center", padding: "40px" }}>
              <div style={{ fontSize: "60px", marginBottom: "20px" }}>🛒</div>
              <h2>Votre panier est vide</h2>
              <IonText color="medium">
                <p>Ajoutez des produits pour commencer vos achats</p>
              </IonText>
              <IonButton
                routerLink="/"
                style={{ marginTop: "20px" }}
              >
                🛍️ Continuer mes achats
              </IonButton>
            </IonCardContent>
          </IonCard>
        )}

        {/* ✅ Afficher items */}
        {!loading && cart.items.length > 0 && (
          <div>
            {/* 📦 Liste produits */}
            {cart.items.map((item) => (
              <IonCard key={item.product._id} style={{ marginBottom: "15px" }}>
                <div style={{ display: "flex", padding: "15px" }}>
                  {/* 🖼️ Image produit */}
                  <div
                    style={{
                      width: "100px",
                      height: "100px",
                      background: item.product.image
                        ? `url(${item.product.image}) center/cover`
                        : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      borderRadius: "8px",
                      marginRight: "15px",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "40px",
                      color: "white",
                    }}
                  >
                    {!item.product.image && "📦"}
                  </div>

                  {/* 📝 Info produit */}
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: "0 0 10px" }}>
                      {item.product.name}
                    </h3>
                    
                    <p style={{ margin: "5px 0", color: "#666" }}>
                      Quantité: <strong>{item.qty}</strong>
                    </p>
                    
                    <p style={{ margin: "5px 0" }}>
                      Prix unitaire: <strong>{item.product.price} DT</strong>
                    </p>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "15px",
                      }}
                    >
                      <IonText color="success">
                        <h3 style={{ margin: 0 }}>
                          {item.qty * item.product.price} DT
                        </h3>
                      </IonText>

                      <IonButton
                        color="danger"
                        fill="outline"
                        size="small"
                        onClick={() => removeItem(item.product._id)}
                      >
                        <IonIcon icon={trashOutline} slot="start" />
                        Retirer
                      </IonButton>
                    </div>
                  </div>
                </div>
              </IonCard>
            ))}

            {/* 💰 Total Card */}
            <IonCard style={{ marginTop: "30px" }}>
              <IonCardContent>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <h2 style={{ margin: 0 }}>Total:</h2>
                  <IonText color="success">
                    <h1 style={{ margin: 0 }}>{calculateTotal()} DT</h1>
                  </IonText>
                </div>

                <IonButton
                  expand="block"
                  size="large"
                  onClick={checkout}
                  disabled={checkingOut}
                >
                  {checkingOut ? (
                    <>
                      <IonSpinner name="crescent" style={{ marginRight: "10px" }} />
                      Commande en cours...
                    </>
                  ) : (
                    <>
                      <IonIcon icon={checkmarkCircle} slot="start" />
                      Valider la commande
                    </>
                  )}
                </IonButton>

                <IonButton
                  expand="block"
                  fill="outline"
                  routerLink="/"
                  style={{ marginTop: "10px" }}
                  disabled={checkingOut}
                >
                  🛍️ Continuer mes achats
                </IonButton>
              </IonCardContent>
            </IonCard>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Cart;