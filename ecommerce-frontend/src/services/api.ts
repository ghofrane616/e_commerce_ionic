// 📁 services/api.ts
import axios from "axios";

// 🧾 Type produit
export interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
  stock?: number;
}

// 🌐 URL du backend
const API_URL = "http://localhost:5000/api";

// 📡 Créer instance axios
export const api = axios.create({
  baseURL: API_URL,
});

// 🔐 Fonction pour set / remove token
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("token", token);
    console.log("✅ Token enregistré");
  } else {
    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
    console.log("🚪 Token supprimé");
  }
};

// 🚀 Charger token automatiquement au démarrage
const initializeAuth = () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      if (payload.exp && payload.exp < currentTime) {
        console.log("⚠️ Token expiré au chargement");
        localStorage.removeItem("token");
      } else {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        console.log("✅ Token chargé depuis localStorage");
      }
    } catch (error) {
      console.error("❌ Token invalide:", error);
      localStorage.removeItem("token");
    }
  }
};

initializeAuth();

// 🔄 Intercepteur pour gérer les erreurs 401 (token expiré)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("⚠️ Token invalide ou expiré (401)");
      setAuthToken(null);
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// 🛍️ Fonctions CRUD Produits avec typing
export const addProduct = (data: Product) => api.post("/products", data);
export const getProducts = () => api.get<Product[]>("/products");
export const deleteProduct = (id: string) => api.delete(`/products/${id}`);
export const updateProduct = (id: string, data: Product) =>
  api.put(`/products/${id}`, data);

export default api;
