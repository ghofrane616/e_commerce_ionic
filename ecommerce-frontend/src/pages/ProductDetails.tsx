// 📱 src/pages/ProductDetails.tsx
// Page détails d'un produit

import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonButton,
  IonSpinner,
  IonText,
  IonInput,
  IonIcon,
  IonBackButton,
  IonButtons,
  IonHeader,
  IonToolbar,
  IonTitle,
  useIonToast,
  IonChip,
} from "@ionic/react";
import { cartOutline, addOutline, removeOutline } from "ionicons/icons";
import { useParams, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { api } from "../services/api";

// 📦 Type produit
interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category?: string;
  stock: number;
}

const ProductDetails: React.FC = () => {
  // 🎯 Récupérer ID depuis URL
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [present] = useIonToast();

  // 🎯 State management
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  /**
   * 📡 Charger produit depuis backend
   */
  const loadProduct = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
    } catch (err) {
      console.error("❌ Erreur chargement produit:", err);

      let errorMessage = "❌ Produit introuvable";
      if (err instanceof AxiosError) {
        errorMessage = err.response?.data?.message || err.message;
      }

      present({
        message: errorMessage,
        duration: 2000,
        color: "danger",
      });

      // Retour home si produit pas trouvé
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🛒 Ajouter au panier
   */
  const addToCart = async () => {
    if (!product) return;

    // ✅ Vérifier stock
    if (quantity > product.stock) {
      present({
        message: `⚠️ Stock insuffisant! Disponible: ${product.stock}`,
        duration: 2500,
        color: "warning",
      });
      return;
    }

    try {
      setAddingToCart(true);

      // 📡 API call
      await api.post("/cart/add", {
        productId: product._id,
        qty: quantity,
      });

      // ✅ Succès
      present({
        message: `✅ ${quantity} × ${product.name} ajouté au panier!`,
        duration: 2000,
        color: "success",
        position: "top",
      });

      // Retour home après 1s
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      console.error("❌ Erreur ajout panier:", err);

      let errorMessage = "❌ Erreur d'ajout";
      if (err instanceof AxiosError) {
        errorMessage = err.response?.data?.message || err.message;
      }

      present({
        message: errorMessage,
        duration: 2500,
        color: "danger",
      });
    } finally {
      setAddingToCart(false);
    }
  };

  /**
   * ➕ Augmenter quantité
   */
  const increaseQty = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  /**
   * ➖ Diminuer quantité
   */
  const decreaseQty = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // 🚀 Load product on mount
  useEffect(() => {
    if (id) {
      loadProduct();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <IonPage>
      {/* 🔙 Header avec retour */}
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" text="Retour" />
          </IonButtons>
          <IonTitle>Détails Produit</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* 🔄 Loading */}
        {loading && (
          <div style={{ textAlign: "center", marginTop: "100px" }}>
            <IonSpinner name="crescent" color="primary" />
            <p>Chargement...</p>
          </div>
        )}

        {/* ✅ Afficher produit */}
        {!loading && product && (
          <IonCard style={{ marginTop: "20px" }}>
            {/* 🖼️ Image produit */}
            <div
              style={{
                width: "100%",
                height: "300px",
                background: product.image
                  ? `url(${product.image}) center/cover`
                  : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "80px",
              }}
            >
              {!product.image && "📦"}
            </div>

            <IonCardContent>
              {/* 🏷️ Catégorie */}
              {product.category && (
                <IonChip color="primary" style={{ marginBottom: "10px" }}>
                  📂 {product.category}
                </IonChip>
              )}

              {/* 📝 Nom */}
              <h1 style={{ margin: "10px 0", fontSize: "26px" }}>
                {product.name}
              </h1>

              {/* 📄 Description */}
              {product.description && (
                <IonText color="medium">
                  <p style={{ lineHeight: "1.6", marginBottom: "20px" }}>
                    {product.description}
                  </p>
                </IonText>
              )}

              {/* 💰 Prix */}
              <div
                style={{
                  background: "#f0f0f0",
                  padding: "15px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                }}
              >
                <IonText color="success">
                  <h2 style={{ margin: 0, fontSize: "32px" }}>
                    {product.price} DT
                  </h2>
                </IonText>
              </div>

              {/* 📦 Stock */}
              <div style={{ marginBottom: "25px" }}>
                <IonText color={product.stock > 0 ? "success" : "danger"}>
                  <p style={{ fontSize: "16px", margin: 0 }}>
                    {product.stock > 0
                      ? `✅ En stock: ${product.stock} disponibles`
                      : "❌ Rupture de stock"}
                  </p>
                </IonText>
              </div>

              {/* 🔢 Quantité + Bouton */}
              {product.stock > 0 && (
                <>
                  <IonText>
                    <p style={{ marginBottom: "10px", fontWeight: "bold" }}>
                      Quantité:
                    </p>
                  </IonText>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                      marginBottom: "20px",
                    }}
                  >
                    {/* Btn - */}
                    <IonButton
                      fill="outline"
                      onClick={decreaseQty}
                      disabled={quantity <= 1}
                      style={{ width: "50px", height: "50px" }}
                    >
                      <IonIcon icon={removeOutline} />
                    </IonButton>

                    {/* Input */}
                    <IonInput
                      type="number"
                      value={quantity}
                      readonly
                      style={{
                        textAlign: "center",
                        fontSize: "20px",
                        fontWeight: "bold",
                        width: "80px",
                      }}
                    />

                    {/* Btn + */}
                    <IonButton
                      fill="outline"
                      onClick={increaseQty}
                      disabled={quantity >= product.stock}
                      style={{ width: "50px", height: "50px" }}
                    >
                      <IonIcon icon={addOutline} />
                    </IonButton>
                  </div>

                  {/* 🛒 Bouton ajouter */}
                  <IonButton
                    expand="block"
                    size="large"
                    onClick={addToCart}
                    disabled={addingToCart}
                  >
                    {addingToCart ? (
                      <>
                        <IonSpinner name="crescent" style={{ marginRight: "10px" }} />
                        Ajout...
                      </>
                    ) : (
                      <>
                        <IonIcon icon={cartOutline} slot="start" />
                        Ajouter ({quantity * product.price} DT)
                      </>
                    )}
                  </IonButton>
                </>
              )}

              {/* ❌ Rupture */}
              {product.stock === 0 && (
                <IonButton expand="block" disabled color="medium">
                  Produit indisponible
                </IonButton>
              )}
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ProductDetails;