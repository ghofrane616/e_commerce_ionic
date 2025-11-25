// 💾 Storage Service - Capacitor Preferences
// Bech ne5zenou data locally (token, user info, etc.)

import { Preferences } from '@capacitor/preferences';

// 🔑 Keys bech nestaamlou fel storage
const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'user_data',
  CART_COUNT: 'cart_count',
  THEME: 'app_theme',
};

// 📝 User interface (bech nesta3mlou instead of any)
interface UserData {
  id: string;
  username: string;
  email?: string;
  role: 'admin' | 'user';
}

export const storageService = {
  // 🔐 Token Management
  
  // Na7fdhhou token
  setToken: async (token: string): Promise<void> => {
    try {
      await Preferences.set({
        key: STORAGE_KEYS.TOKEN,
        value: token,
      });
      console.log('✅ Token saved successfully');
    } catch (error) {
      console.error('❌ Error saving token:', error);
      throw error;
    }
  },

  // Njibou token
  getToken: async (): Promise<string | null> => {
    try {
      const { value } = await Preferences.get({ key: STORAGE_KEYS.TOKEN });
      return value;
    } catch (error) {
      console.error('❌ Error getting token:', error);
      return null;
    }
  },

  // Na7iw token (logout)
  removeToken: async (): Promise<void> => {
    try {
      await Preferences.remove({ key: STORAGE_KEYS.TOKEN });
      console.log('✅ Token removed');
    } catch (error) {
      console.error('❌ Error removing token:', error);
    }
  },

  // 👤 User Data Management
  
  // Na7fdhhou user data
  setUser: async (user: UserData): Promise<void> => {
    try {
      await Preferences.set({
        key: STORAGE_KEYS.USER,
        value: JSON.stringify(user),
      });
      console.log('✅ User data saved');
    } catch (error) {
      console.error('❌ Error saving user:', error);
      throw error;
    }
  },

  // Njibou user data
  getUser: async (): Promise<UserData | null> => {
    try {
      const { value } = await Preferences.get({ key: STORAGE_KEYS.USER });
      return value ? JSON.parse(value) as UserData : null;
    } catch (error) {
      console.error('❌ Error getting user:', error);
      return null;
    }
  },

  // 🛒 Cart Count (optional - for badge)
  
  // Na7fdhhou cart count
  setCartCount: async (count: number): Promise<void> => {
    try {
      await Preferences.set({
        key: STORAGE_KEYS.CART_COUNT,
        value: count.toString(),
      });
    } catch (error) {
      console.error('❌ Error saving cart count:', error);
    }
  },

  // Njibou cart count
  getCartCount: async (): Promise<number> => {
    try {
      const { value } = await Preferences.get({ key: STORAGE_KEYS.CART_COUNT });
      return value ? parseInt(value, 10) : 0;
    } catch (error) {
      console.error('❌ Error getting cart count:', error);
      return 0;
    }
  },

  // 🎨 Theme Management (Dark/Light mode)
  
  // Na7fdhhou theme preference
  setTheme: async (theme: 'light' | 'dark'): Promise<void> => {
    try {
      await Preferences.set({
        key: STORAGE_KEYS.THEME,
        value: theme,
      });
      console.log('✅ Theme saved:', theme);
    } catch (error) {
      console.error('❌ Error saving theme:', error);
    }
  },

  // Njibou theme
  getTheme: async (): Promise<'light' | 'dark'> => {
    try {
      const { value } = await Preferences.get({ key: STORAGE_KEYS.THEME });
      return (value as 'light' | 'dark') || 'light';
    } catch (error) {
      console.error('❌ Error getting theme:', error);
      return 'light';
    }
  },

  // 🗑️ Clear All Data (logout)
  clearAll: async (): Promise<void> => {
    try {
      await Preferences.clear();
      console.log('✅ All data cleared');
    } catch (error) {
      console.error('❌ Error clearing data:', error);
    }
  },

  // 📋 Get all keys (debugging)
  getAllKeys: async (): Promise<string[]> => {
    try {
      const { keys } = await Preferences.keys();
      console.log('📋 Stored keys:', keys);
      return keys;
    } catch (error) {
      console.error('❌ Error getting keys:', error);
      return [];
    }
  },
};

// 🎯 Export UserData type bech nestaamlou fil components
export type { UserData };