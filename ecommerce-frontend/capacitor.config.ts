// 🔧 Configuration Capacitor
// Fichier bech i9oul lel Capacitor kifeh yechtaghal el app
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'tn.ecommerce.app', // ID unique lel app mte3ek
  appName: 'E-Commerce TN', // Esm el app
  webDir: 'dist', // Wen ye5dem el build (Vite ywalli dist)
  
  // 🔌 Plugins Configuration
  plugins: {
    // 📸 Camera Plugin - Bech nestaamlou fel admin dashboard
    Camera: {
      // Qualité te3 e9sor (0-100)
      quality: 90,
      // Taille maximale
      width: 1024,
      height: 1024,
      // Allowed sources
      promptLabelHeader: 'Select Image Source',
      promptLabelPhoto: 'From Photos',
      promptLabelPicture: 'Take Picture'
    },
    
    // 🔔 Push Notifications - Bech admin yab3ath notifs
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    },
    
    // 💾 Preferences (Storage) - Bech ne5zenou token w data
    Preferences: {
      // Pas de config spéciale needed
    }
  },
  
  // 🌐 Server configuration (dev mode)
  server: {
    // URL te3 backend mte3ek (port 5000)
    androidScheme: 'https',
    // Autoriser CORS
    cleartext: true
  }
};

export default config;