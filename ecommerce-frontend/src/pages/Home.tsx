// 🏠 src/pages/Home.tsx
// Page d'accueil - liste des produits

import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonButton,
  IonSpinner,
  IonText,
  IonSearchbar,
  IonChip,
  IonIcon,
  useIonToast,
} from "@ionic/react";
import { cartOutline, eyeOutline } from "ionicons/icons";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { api } from "../services/api";
import Header from "../components/Header";

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

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [present] = useIonToast();

  // 🎯 State management
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  /**
   * 📡 Charger produits depuis backend
   */
  const loadProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/products");

      // ✅ Vérifier si array
      if (Array.isArray(data)) {
        setProducts(data);
        setFilteredProducts(data);
      } else {
        setProducts([]);
        setFilteredProducts([]);
      }
    } catch (err) {
      console.error("❌ Erreur chargement produits:", err);

      let errorMessage = "❌ Erreur de chargement";
      if (err instanceof AxiosError) {
        errorMessage = err.response?.data?.message || err.message;
      }

      present({
        message: errorMessage,
        duration: 2000,
        color: "danger",
      });

      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🔍 Filtrer produits (recherche + catégorie)
   */
  const filterProducts = () => {
    let filtered = [...products];

    // 🔍 Filtre par recherche
    if (searchText.trim()) {
      const search = searchText.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.description?.toLowerCase().includes(search)
      );
    }

    // 🏷️ Filtre par catégorie
    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  };

  /**
   * 🛒 Ajouter au panier rapidement
   */
  const quickAddToCart = async (productId: string, productName: string) => {
    try {
      await api.post("/cart/add", {
        productId,
        qty: 1,
      });

      present({
        message: `✅ ${productName} ajouté au panier!`,
        duration: 1500,
        color: "success",
      });
    } catch (err) {
      console.error("❌ Erreur ajout panier:", err);

      let errorMessage = "❌ Erreur d'ajout";
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
   * 🏷️ Obtenir catégories uniques
   */
  const getCategories = (): string[] => {
    const categories = products
      .map((p) => p.category)
      .filter((c): c is string => !!c);

    return Array.from(new Set(categories));
  };

  // 🚀 Load products on mount
  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🔍 Filter when search or category changes
  useEffect(() => {
    filterProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, selectedCategory, products]);

  return (
    <IonPage>
      <Header />
      <IonContent>
        {/* 🎨 Hero Section */}
        <div
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            padding: "30px 20px",
            textAlign: "center",
            color: "white",
          }}
        >
          <h1 style={{ margin: "0 0 10px 0", fontSize: "28px" }}>
            🛍️ Bienvenue sur E-Commerce
          </h1>
          <p style={{ margin: 0, opacity: 0.9 }}>
            Découvrez nos produits exceptionnels
          </p>
        </div>

        <div className="ion-padding">
          {/* 🔍 Barre recherche */}
          <IonSearchbar
            value={searchText}
            onIonInput={(e) => setSearchText(e.detail.value || "")}
            placeholder="Rechercher un produit..."
            animated
            style={{ marginBottom: "15px" }}
          />

          {/* 🏷️ Filtres catégories */}
          <div style={{ marginBottom: "20px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <IonChip
              color={selectedCategory === "" ? "primary" : "medium"}
              onClick={() => setSelectedCategory("")}
            >
              Tous
            </IonChip>

            {getCategories().map((cat) => (
              <IonChip
                key={cat}
                color={selectedCategory === cat ? "primary" : "medium"}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </IonChip>
            ))}
          </div>

          {/* 📊 Compteur résultats */}
          <IonText color="medium">
            <p style={{ margin: "0 0 15px" }}>
              {filteredProducts.length} produit(s) trouvé(s)
            </p>
          </IonText>

          {/* 🔄 Loading */}
          {loading && (
            <div style={{ textAlign: "center", marginTop: "50px" }}>
              <IonSpinner name="crescent" color="primary" />
              <p>Chargement des produits...</p>
            </div>
          )}

          {/* 📦 Grille produits */}
          {!loading && filteredProducts.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "15px",
              }}
            >
              {filteredProducts.map((product) => (
                <IonCard key={product._id}>
                  {/* 🖼️ Image */}
                  <div
                    style={{
                      width: "100%",
                      height: "200px",
                      background: product.image
                        ? `url(${product.image}) center/cover`
                        : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "60px",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate(`/product/${product._id}`)}
                  >
                    {!product.image && "📦"}
                  </div>

                  <IonCardContent>
                    {/* 🏷️ Catégorie */}
                    {product.category && (
                      <IonText color="primary">
                        <p style={{ margin: "0 0 8px", fontSize: "12px" }}>
                          📂 {product.category}
                        </p>
                      </IonText>
                    )}

                    {/* 📝 Nom */}
                    <h3
                      style={{
                        margin: "0 0 8px",
                        fontSize: "18px",
                        cursor: "pointer",
                      }}
                      onClick={() => navigate(`/product/${product._id}`)}
                    >
                      {product.name}
                    </h3>

                    {/* 📄 Description */}
                    {product.description && (
                      <IonText color="medium">
                        <p
                          style={{
                            margin: "0 0 12px",
                            fontSize: "14px",
                            lineHeight: "1.4",
                          }}
                        >
                          {product.description.substring(0, 80)}
                          {product.description.length > 80 && "..."}
                        </p>
                      </IonText>
                    )}

                    {/* 💰 Prix + Stock */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "12px",
                      }}
                    >
                      <IonText color="success">
                        <h2 style={{ margin: 0 }}>{product.price} DT</h2>
                      </IonText>

                      <IonText color={product.stock > 0 ? "success" : "danger"}>
                        <p style={{ margin: 0, fontSize: "13px" }}>
                          {product.stock > 0
                            ? `Stock: ${product.stock}`
                            : "Rupture"}
                        </p>
                      </IonText>
                    </div>

                    {/* 🔘 Buttons */}
                    <div style={{ display: "flex", gap: "8px" }}>
                      <IonButton
                        expand="block"
                        size="small"
                        fill="outline"
                        onClick={() => navigate(`/product/${product._id}`)}
                        style={{ flex: 1 }}
                      >
                        <IonIcon icon={eyeOutline} slot="start" />
                        Voir
                      </IonButton>

                      <IonButton
                        expand="block"
                        size="small"
                        onClick={() => quickAddToCart(product._id, product.name)}
                        disabled={product.stock === 0}
                        style={{ flex: 1 }}
                      >
                        <IonIcon icon={cartOutline} slot="start" />
                        Panier
                      </IonButton>
                    </div>
                  </IonCardContent>
                </IonCard>
              ))}
            </div>
          )}

          {/* 📭 Aucun résultat */}
          {!loading && filteredProducts.length === 0 && (
            <IonCard>
              <IonCardContent style={{ textAlign: "center", padding: "40px" }}>
                <div style={{ fontSize: "60px", marginBottom: "20px" }}>🔍</div>
                <h2>Aucun produit trouvé</h2>
                <IonText color="medium">
                  <p>Essayez avec d'autres mots-clés</p>
                </IonText>
              </IonCardContent>
            </IonCard>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;