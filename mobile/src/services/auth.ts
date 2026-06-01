import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { BASE_URL } from './api';

const USER_TOKEN_KEY = '@user_token';
const SESSION_ID_KEY = '@session_id';

export const authService = {
  initializeUser: async (forceNew: boolean = false): Promise<string> => {
    try {
      if (forceNew) {
        await AsyncStorage.removeItem(USER_TOKEN_KEY);
        await AsyncStorage.removeItem(SESSION_ID_KEY);
      }

      let token = await AsyncStorage.getItem(USER_TOKEN_KEY);

      if (!token) {
        token = Crypto.randomUUID();
        await AsyncStorage.setItem(USER_TOKEN_KEY, token);
      }

      // Sync with backend
      const response = await fetch(`${BASE_URL}/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_token: token }),
      });

      if (!response.ok) {
        console.error('Failed to sync user with backendn');
      } else {
        const data = await response.json();
        console.log('User synced with backend:', data);
      }

      return token;
    } catch (error) {
      console.error('Auth Error:', error);
      throw error;
    }
  },

  getToken: async (): Promise<string | null> => {
    return await AsyncStorage.getItem(USER_TOKEN_KEY);
  },

  clearToken: async (): Promise<void> => {
    await AsyncStorage.removeItem(USER_TOKEN_KEY);
  },

  getSessionId: async (): Promise<string | null> => {
    return await AsyncStorage.getItem(SESSION_ID_KEY);
  },

  setSessionId: async (sessionId: string): Promise<void> => {
    await AsyncStorage.setItem(SESSION_ID_KEY, sessionId);
  },

  clearSessionId: async (): Promise<void> => {
    await AsyncStorage.removeItem(SESSION_ID_KEY);
  }
};
