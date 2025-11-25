// 📷 src/components/CameraModal.tsx
// Modal component bech ya5ou photo avec Capacitor Camera

import React, { useState } from "react";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonCard,
  IonCardContent,
  IonIcon,
  IonSpinner,
} from "@ionic/react";
import { close, camera, images } from "ionicons/icons";
import CameraService from "../services/camera.service";

/**
 * 📷 Props du CameraModal
 */
interface CameraModalProps {
  isOpen: boolean; // Modal ouvert ou fermé
  onClose: () => void; // Callback fermeture
  onPhotoTaken: (photoUrl: string) => void; // Callback photo capturée
}

/**
 * 📷 CameraModal Component
 * 
 * Modal pour choisir entre:
 * - Prendre photo avec caméra
 * - Choisir depuis galerie
 * 
 * Utilise Capacitor Camera plugin
 */
const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  onPhotoTaken,
}) => {
  // 🎯 State management
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  /**
   * 📸 Prendre photo avec caméra
   */
  const handleTakePhoto = async () => {
    try {
      setLoading(true);

      // 🎯 Appeler service caméra
      const photoUrl = await CameraService.takePicture();

      // ✅ Afficher preview
      setPreviewUrl(photoUrl);
    } catch (error) {
      console.error("❌ Erreur capture photo:", error);
      alert("Erreur lors de la capture photo");
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🖼️ Choisir photo depuis galerie
   */
  const handlePickFromGallery = async () => {
    try {
      setLoading(true);

      // 🎯 Appeler service galerie
      const photoUrl = await CameraService.pickFromGallery();

      // ✅ Afficher preview
      setPreviewUrl(photoUrl);
    } catch (error) {
      console.error("❌ Erreur sélection galerie:", error);
      alert("Erreur lors de la sélection");
    } finally {
      setLoading(false);
    }
  };

  /**
   * ✅ Confirmer et utiliser la photo
   */
  const handleConfirm = () => {
    if (previewUrl) {
      onPhotoTaken(previewUrl);
      handleClose();
    }
  };

  /**
   * 🚪 Fermer modal et reset
   */
  const handleClose = () => {
    setPreviewUrl("");
    setLoading(false);
    onClose();
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={handleClose}>
      {/* 📱 Header */}
      <IonHeader>
        <IonToolbar>
          <IonTitle>📷 Ajouter Photo</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleClose}>
              <IonIcon icon={close} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      {/* 📄 Content */}
      <IonContent className="ion-padding">
        {/* 🔄 Loading */}
        {loading && (
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <IonSpinner name="crescent" />
            <p>Chargement...</p>
          </div>
        )}

        {/* 🖼️ Preview photo */}
        {!loading && previewUrl && (
          <div style={{ textAlign: "center" }}>
            <IonCard>
              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  width: "100%",
                  height: "300px",
                  objectFit: "cover",
                }}
              />
            </IonCard>

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <IonButton
                expand="block"
                color="success"
                onClick={handleConfirm}
                style={{ flex: 1 }}
              >
                ✅ Utiliser cette photo
              </IonButton>

              <IonButton
                expand="block"
                fill="outline"
                onClick={() => setPreviewUrl("")}
                style={{ flex: 1 }}
              >
                🔄 Reprendre
              </IonButton>
            </div>
          </div>
        )}

        {/* 🎯 Choix Camera ou Galerie */}
        {!loading && !previewUrl && (
          <div>
            <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
              Choisissez une option
            </h2>

            <IonCard button onClick={handleTakePhoto}>
              <IonCardContent>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                  }}
                >
                  <IonIcon
                    icon={camera}
                    style={{ fontSize: "48px", color: "#3880ff" }}
                  />
                  <div>
                    <h3 style={{ margin: 0 }}>📸 Prendre une photo</h3>
                    <p style={{ margin: "5px 0 0", color: "#666" }}>
                      Utiliser la caméra
                    </p>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>

            <IonCard button onClick={handlePickFromGallery}>
              <IonCardContent>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                  }}
                >
                  <IonIcon
                    icon={images}
                    style={{ fontSize: "48px", color: "#2dd36f" }}
                  />
                  <div>
                    <h3 style={{ margin: 0 }}>🖼️ Choisir de la galerie</h3>
                    <p style={{ margin: "5px 0 0", color: "#666" }}>
                      Sélectionner une image existante
                    </p>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>
          </div>
        )}
      </IonContent>
    </IonModal>
  );
};

export default CameraModal;