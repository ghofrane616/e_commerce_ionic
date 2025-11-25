// 👑 src/pages/AdminDashboard.tsx
// Dashboard admin - Gestion complète des produits avec Camera Capacitor

import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonButton,
  IonSpinner,
  IonText,
  IonIcon,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonInput,
  IonTextarea,
  useIonToast,
  IonBadge,
} from "@ionic/react";
import {
  addOutline,
  trashOutline,
  createOutline,
  close,
  cameraOutline,
  receiptOutline,
} from "ionicons/icons";
import { AxiosError } from "axios";
import { api } from "../services/api";
import Header from "../components/Header";
import CameraModal from "../components/CameraModal";

// 📦 Interface Product
interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category?: string;
  stock: number;
}

const AdminDashboard: React.FC = () => {
  const [present] = useIonToast();

  // 🎯 State management - Liste produits
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // 📝 State management - Modal
  const [showModal, setShowModal] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // 📝 State management - Form fields
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formStock, setFormStock] = useState("");
  const [formImage, setFormImage] = useState("");

  /**
   * 📡 Charger tous les produits depuis le backend
   */
  const loadProducts = async () => {
    try {
      setLoading(true);
      console.log("📡 Chargement des produits...");
      
      const { data } = await api.get("/products");
      console.log("✅ Produits reçus:", data);

      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        console.warn("⚠️ Data n'est pas un array:", data);
        setProducts([]);
      }
    } catch (err) {
      console.error("❌ Erreur chargement produits:", err);

      let errorMessage = "❌ Erreur de chargement des produits";
      if (err instanceof AxiosError) {
        if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.message === "Network Error") {
          errorMessage = "🌐 Erreur réseau - Vérifiez que le backend est lancé sur http://localhost:5000";
        }
      }

      present({
        message: errorMessage,
        duration: 3000,
        color: "danger",
      });

      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * ➕ Ouvrir modal pour ajouter un nouveau produit
   */
  const openAddModal = () => {
    console.log("➕ Ouverture modal ajout produit");
    setEditingProduct(null);
    resetForm();
    setShowModal(true);
  };

  /**
   * ✏️ Ouvrir modal pour éditer un produit existant
   */
  const openEditModal = (product: Product) => {
    console.log("✏️ Ouverture modal édition pour:", product.name);
    setEditingProduct(product);
    setFormName(product.name);
    setFormDescription(product.description || "");
    setFormPrice(product.price.toString());
    setFormCategory(product.category || "");
    setFormStock(product.stock.toString());
    setFormImage(product.image || "");
    setShowModal(true);
  };

  /**
   * 🔄 Reset form fields
   */
  const resetForm = () => {
    setFormName("");
    setFormDescription("");
    setFormPrice("");
    setFormCategory("");
    setFormStock("");
    setFormImage("");
  };

  /**
   * 💾 Sauvegarder produit (création ou mise à jour)
   */
  const saveProduct = async () => {
    // ✅ Validation des champs obligatoires
    if (!formName.trim()) {
      present({
        message: "⚠️ Le nom du produit est obligatoire",
        duration: 2000,
        color: "warning",
      });
      return;
    }

    if (!formPrice || parseFloat(formPrice) <= 0) {
      present({
        message: "⚠️ Le prix doit être supérieur à 0",
        duration: 2000,
        color: "warning",
      });
      return;
    }

    try {
      // 📦 Préparer les données du produit
      const productData = {
        name: formName.trim(),
        description: formDescription.trim() || undefined,
        price: parseFloat(formPrice),
        category: formCategory.trim() || undefined,
        stock: parseInt(formStock) || 0,
        image: formImage || undefined,
      };

      if (editingProduct) {
        // ✏️ Mise à jour d'un produit existant
        console.log("✏️ Mise à jour produit:", editingProduct._id, productData);
        await api.put(`/products/${editingProduct._id}`, productData);
        
        present({
          message: "✅ Produit modifié avec succès!",
          duration: 2000,
          color: "success",
        });
      } else {
        // ➕ Création d'un nouveau produit
        console.log("➕ Création nouveau produit:", productData);
        await api.post("/products", productData);
        
        present({
          message: "✅ Produit ajouté avec succès!",
          duration: 2000,
          color: "success",
        });
      }

      // 🔄 Fermer modal et recharger la liste
      setShowModal(false);
      loadProducts();
    } catch (err) {
      console.error("❌ Erreur sauvegarde produit:", err);

      let errorMessage = "❌ Erreur lors de la sauvegarde";
      if (err instanceof AxiosError) {
        errorMessage = err.response?.data?.message || err.message;
      }

      present({
        message: errorMessage,
        duration: 2500,
        color: "danger",
      });
    }
  };

  /**
   * 🗑️ Supprimer un produit
   */
  const deleteProduct = async (productId: string, productName: string) => {
    // ⚠️ Confirmation avant suppression
    const confirmed = window.confirm(
      `Êtes-vous sûr de vouloir supprimer "${productName}"?\nCette action est irréversible.`
    );

    if (!confirmed) {
      console.log("❌ Suppression annulée par l'utilisateur");
      return;
    }

    try {
      console.log("🗑️ Suppression du produit:", productId);
      await api.delete(`/products/${productId}`);

      present({
        message: `✅ "${productName}" supprimé avec succès!`,
        duration: 2000,
        color: "success",
      });

      // 🔄 Recharger la liste des produits
      loadProducts();
    } catch (err) {
      console.error("❌ Erreur suppression produit:", err);

      let errorMessage = "❌ Erreur lors de la suppression";
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
   * 📸 Callback appelé quand une photo est capturée
   * @param photoUrl - URL de la photo en base64
   */
  const handlePhotoTaken = (photoUrl: string) => {
    console.log("📸 Photo capturée, taille:", photoUrl.length, "caractères");
    setFormImage(photoUrl);
    setShowCameraModal(false);

    present({
      message: "✅ Photo ajoutée avec succès!",
      duration: 1500,
      color: "success",
    });
  };

  /**
   * 📷 Ouvrir le modal de la caméra
   */
  const openCameraModal = () => {
    console.log("📷 Ouverture du modal caméra");
    setShowCameraModal(true);
  };

  /**
   * 🗑️ Supprimer l'image actuelle
   */
  const removeImage = () => {
    console.log("🗑️ Suppression de l'image");
    setFormImage("");
    
    present({
      message: "✅ Image supprimée",
      duration: 1500,
      color: "medium",
    });
  };

  // 🚀 Charger les produits au montage du composant
  useEffect(() => {
    console.log("🚀 Composant AdminDashboard monté");
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <IonPage>
      <Header />
      <IonContent className="ion-padding">
        {/* 🎨 Hero Section */}
        <div
          style={{
            background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)",
            borderRadius: "15px",
            padding: "30px 20px",
            textAlign: "center",
            color: "white",
            marginBottom: "20px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          <h1 style={{ margin: "0 0 10px 0", fontSize: "28px" }}>
            👑 Dashboard Admin
          </h1>
          <p style={{ margin: 0, opacity: 0.9, fontSize: "14px" }}>
            Gérer les produits de votre boutique e-commerce
          </p>
        </div>

        {/* 🔘 Boutons d'action */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <IonButton
            expand="block"
            onClick={openAddModal}
            style={{ flex: 1 }}
            color="success"
          >
            <IonIcon icon={addOutline} slot="start" />
            Ajouter Produit
          </IonButton>

          <IonButton
            expand="block"
            fill="outline"
            routerLink="/admin/orders"
            style={{ flex: 1 }}
            color="primary"
          >
            <IonIcon icon={receiptOutline} slot="start" />
            Commandes
          </IonButton>
        </div>

        {/* 🔄 Loading spinner */}
        {loading && (
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <IonSpinner name="crescent" color="primary" />
            <p style={{ marginTop: "15px", color: "#666" }}>
              Chargement des produits...
            </p>
          </div>
        )}

        {/* 📊 Statistiques */}
        {!loading && (
          <div style={{ marginBottom: "20px" }}>
            <IonText color="medium">
              <p style={{ margin: "0 0 15px", fontSize: "14px" }}>
                📦 {products.length} produit(s) au total
              </p>
            </IonText>
          </div>
        )}

        {/* 📦 Grille des produits */}
        {!loading && products.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "15px",
            }}
          >
            {products.map((product) => (
              <IonCard key={product._id} style={{ margin: 0 }}>
                {/* 🖼️ Image du produit */}
                <div
                  style={{
                    width: "100%",
                    height: "180px",
                    background: product.image
                      ? `url(${product.image}) center/cover`
                      : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "60px",
                    position: "relative",
                  }}
                >
                  {!product.image && "📦"}
                  
                  {/* 🏷️ Badge stock */}
                  <IonBadge
                    color={product.stock > 0 ? "success" : "danger"}
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                    }}
                  >
                    Stock: {product.stock}
                  </IonBadge>
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

                  {/* 📝 Nom du produit */}
                  <h3 style={{ margin: "0 0 8px", fontSize: "18px" }}>
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
                        {product.description.substring(0, 60)}
                        {product.description.length > 60 && "..."}
                      </p>
                    </IonText>
                  )}

                  {/* 💰 Prix */}
                  <div style={{ marginBottom: "15px" }}>
                    <IonText color="success">
                      <h2 style={{ margin: 0, fontSize: "24px" }}>
                        {product.price} DT
                      </h2>
                    </IonText>
                  </div>

                  {/* 🔘 Boutons d'action */}
                  <div style={{ display: "flex", gap: "8px" }}>
                    <IonButton
                      size="small"
                      fill="outline"
                      onClick={() => openEditModal(product)}
                      style={{ flex: 1 }}
                    >
                      <IonIcon icon={createOutline} slot="start" />
                      Modifier
                    </IonButton>

                    <IonButton
                      size="small"
                      color="danger"
                      fill="outline"
                      onClick={() => deleteProduct(product._id, product.name)}
                    >
                      <IonIcon icon={trashOutline} />
                    </IonButton>
                  </div>
                </IonCardContent>
              </IonCard>
            ))}
          </div>
        )}

        {/* 📭 Aucun produit */}
        {!loading && products.length === 0 && (
          <IonCard>
            <IonCardContent style={{ textAlign: "center", padding: "40px" }}>
              <div style={{ fontSize: "80px", marginBottom: "20px" }}>📦</div>
              <h2 style={{ marginBottom: "10px" }}>Aucun produit</h2>
              <IonText color="medium">
                <p style={{ marginBottom: "20px" }}>
                  Commencez par ajouter votre premier produit
                </p>
              </IonText>
              <IonButton onClick={openAddModal} color="success">
                <IonIcon icon={addOutline} slot="start" />
                Ajouter un produit
              </IonButton>
            </IonCardContent>
          </IonCard>
        )}

        {/* 📝 Modal Formulaire Produit */}
        <IonModal
          isOpen={showModal}
          onDidDismiss={() => setShowModal(false)}
        >
          <IonHeader>
            <IonToolbar color="primary">
              <IonTitle>
                {editingProduct ? "✏️ Modifier" : "➕ Ajouter"} Produit
              </IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowModal(false)}>
                  <IonIcon icon={close} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>

          <IonContent className="ion-padding">
            {/* 📝 Nom du produit */}
            <IonInput
              label="Nom du produit *"
              labelPlacement="floating"
              value={formName}
              onIonInput={(e) => setFormName(e.detail.value || "")}
              fill="outline"
              placeholder="Ex: iPhone 14 Pro"
              style={{ marginBottom: "15px" }}
            />

            {/* 📄 Description */}
            <IonTextarea
              label="Description"
              labelPlacement="floating"
              value={formDescription}
              onIonInput={(e) => setFormDescription(e.detail.value || "")}
              fill="outline"
              rows={3}
              placeholder="Décrivez votre produit..."
              style={{ marginBottom: "15px" }}
            />

            {/* 💰 Prix */}
            <IonInput
              label="Prix (DT) *"
              labelPlacement="floating"
              type="number"
              value={formPrice}
              onIonInput={(e) => setFormPrice(e.detail.value || "")}
              fill="outline"
              placeholder="Ex: 2999"
              style={{ marginBottom: "15px" }}
            />

            {/* 🏷️ Catégorie */}
            <IonInput
              label="Catégorie"
              labelPlacement="floating"
              value={formCategory}
              onIonInput={(e) => setFormCategory(e.detail.value || "")}
              fill="outline"
              placeholder="Ex: Téléphones"
              style={{ marginBottom: "15px" }}
            />

            {/* 📦 Stock */}
            <IonInput
              label="Stock disponible"
              labelPlacement="floating"
              type="number"
              value={formStock}
              onIonInput={(e) => setFormStock(e.detail.value || "")}
              fill="outline"
              placeholder="Ex: 10"
              style={{ marginBottom: "15px" }}
            />

            {/* 📸 Section Image */}
            <div style={{ marginBottom: "20px" }}>
              <p
                style={{
                  margin: "0 0 10px",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                📸 Image du produit:
              </p>

              {/* 🖼️ Preview de l'image */}
              {formImage && (
                <div style={{ marginBottom: "10px", position: "relative" }}>
                  <img
                    src={formImage}
                    alt="Preview"
                    style={{
                      width: "100%",
                      maxHeight: "200px",
                      objectFit: "contain",
                      borderRadius: "8px",
                      border: "2px solid #ddd",
                    }}
                  />
                  
                  {/* Bouton supprimer image */}
                  <IonButton
                    size="small"
                    color="danger"
                    onClick={removeImage}
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                    }}
                  >
                    <IonIcon icon={trashOutline} />
                  </IonButton>
                </div>
              )}

              {/* 📷 Bouton ouvrir caméra */}
              <IonButton
                expand="block"
                fill="outline"
                onClick={openCameraModal}
                color="primary"
              >
                <IonIcon icon={cameraOutline} slot="start" />
                {formImage
                  ? "📷 Changer l'image"
                  : "📷 Prendre une photo"}
              </IonButton>

              {/* 🔗 Ou URL manuelle */}
              <IonInput
                label="Ou URL de l'image"
                labelPlacement="floating"
                value={formImage}
                onIonInput={(e) => setFormImage(e.detail.value || "")}
                fill="outline"
                placeholder="https://example.com/image.jpg"
                
                style={{ marginTop: "10px" }}
              />
            </div>

            {/* 💾 Bouton Sauvegarder */}
            <IonButton
              expand="block"
              color="success"
              size="large"
              onClick={saveProduct}
              style={{ marginTop: "20px" }}
            >
              💾 {editingProduct ? "Modifier" : "Ajouter"} le produit
            </IonButton>
          </IonContent>
        </IonModal>

        {/* 📷 Modal Caméra */}
        <CameraModal
          isOpen={showCameraModal}
          onClose={() => setShowCameraModal(false)}
          onPhotoTaken={handlePhotoTaken}
        />
      </IonContent>
    </IonPage>
  );
};

export default AdminDashboard;