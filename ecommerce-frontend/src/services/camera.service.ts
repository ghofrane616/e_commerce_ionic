// 📷 src/services/camera.service.ts
// Service bech nist3mlou Camera plugin mte3 Capacitor

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

/**
 * 📸 Service Camera - Gestion de la caméra avec Capacitor
 * 
 * Features:
 * - Prendre photo avec caméra
 * - Choisir image men galerie
 * - Convertir image en base64
 * - Gérer permissions
 */

export class CameraService {
  /**
   * 📷 Prendre une photo avec la caméra
   * 
   * @returns Promise<string> - Image en format base64
   * @throws Error si permission refusée ou erreur caméra
   */
  static async takePicture(): Promise<string> {
    try {
      // 🎯 Demander permission et ouvrir caméra
      const image = await Camera.getPhoto({
        quality: 90, // Qualité image (0-100)
        allowEditing: false, // Permettre édition après capture
        resultType: CameraResultType.DataUrl, // Format: base64 data URL
        source: CameraSource.Camera, // Source: Caméra (pas galerie)
      });

      // ✅ Retourner image en base64
      if (image.dataUrl) {
        console.log('✅ Photo capturée avec succès');
        return image.dataUrl;
      }

      throw new Error('Aucune image capturée');
    } catch (error) {
      console.error('❌ Erreur capture photo:', error);
      throw error;
    }
  }

  /**
   * 🖼️ Choisir une photo de la galerie
   * 
   * @returns Promise<string> - Image en format base64
   * @throws Error si permission refusée ou erreur galerie
   */
  static async pickFromGallery(): Promise<string> {
    try {
      // 🎯 Ouvrir galerie photos
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true, // Permettre crop/edit
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos, // Source: Galerie
      });

      // ✅ Retourner image en base64
      if (image.dataUrl) {
        console.log('✅ Image sélectionnée depuis galerie');
        return image.dataUrl;
      }

      throw new Error('Aucune image sélectionnée');
    } catch (error) {
      console.error('❌ Erreur sélection galerie:', error);
      throw error;
    }
  }

  /**
   * 🎭 Demander choix entre Caméra ou Galerie
   * 
   * @param useCamera - true = caméra, false = galerie
   * @returns Promise<string> - Image en format base64
   */
  static async getPhoto(useCamera: boolean = true): Promise<string> {
    if (useCamera) {
      return this.takePicture();
    } else {
      return this.pickFromGallery();
    }
  }

  /**
   * 🔍 Vérifier si Camera disponible
   * 
   * @returns Promise<boolean> - true si disponible
   */
  static async isCameraAvailable(): Promise<boolean> {
    try {
      // Sur web, Camera API peut ne pas être disponible
      // Sur mobile (Android/iOS), toujours disponible
      return true;
    } catch (error) {
      console.error('❌ Camera non disponible:', error);
      return false;
    }
  }
}

export default CameraService;