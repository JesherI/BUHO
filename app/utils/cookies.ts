import Cookies from 'js-cookie';

const defaultOptions = {
  expires: 30,
  secure: process.env.NODE_ENV === 'production', 
  sameSite: 'lax' as const,
  path: '/' 
};

export const COOKIE_KEYS = {
  COOKIES_ACCEPTED: 'cookies_accepted',
  AUTH_TOKEN: 'auth_token',
  USER_SESSION: 'user_session',
  CHAT_PREFERENCES: 'chat_preferences' 
} as const;

export const cookieUtils = {
  set: (key: string, value: string | object, options = {}) => {
    const valueToStore = typeof value === 'object' ? JSON.stringify(value) : String(value);
    try {
      Cookies.set(key, valueToStore, { ...defaultOptions, ...options });
      console.log(`✅ Cookie guardada: ${key}`);
      return true;
    } catch (error) {
      console.error(`❌ Error guardando cookie ${key}:`, error);
      return false;
    }
  },

  get: (key: string) => {
    try {
      const value = Cookies.get(key);
      if (!value) return null;
      
      if (value === 'true') return true;
      if (value === 'false') return false;
      
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch (error) {
      console.error(`❌ Error obteniendo cookie ${key}:`, error);
      return null;
    }
  },

  remove: (key: string) => {
    try {
      Cookies.remove(key, { path: '/' });
      console.log(`🗑️ Cookie eliminada: ${key}`);
      return true;
    } catch (error) {
      console.error(`❌ Error eliminando cookie ${key}:`, error);
      return false;
    }
  },

  exists: (key: string) => {
    return Cookies.get(key) !== undefined;
  },

  getAll: () => {
    return Cookies.get();
  },

  acceptCookies: () => {
    const success = cookieUtils.set(COOKIE_KEYS.COOKIES_ACCEPTED, 'true');
    if (success) {
      console.log('🎉 Usuario aceptó las cookies');
    }
    return success;
  },

  areCookiesAccepted: () => {
    const accepted = cookieUtils.get(COOKIE_KEYS.COOKIES_ACCEPTED);
    return accepted === true || accepted === 'true';
  },

  setAuthToken: (token: string, rememberMe: boolean = false) => {
    const expires = rememberMe ? 30 : 1; // 30 días si "recordar", 1 día si no
    const success = cookieUtils.set(COOKIE_KEYS.AUTH_TOKEN, token, { expires });
    if (success) {
      console.log(`🔐 Token de auth guardado (expira en ${expires} días)`);
    }
    return success;
  },

  getAuthToken: () => {
    return cookieUtils.get(COOKIE_KEYS.AUTH_TOKEN);
  },

  logout: () => {
    const tokenRemoved = cookieUtils.remove(COOKIE_KEYS.AUTH_TOKEN);
    const sessionRemoved = cookieUtils.remove(COOKIE_KEYS.USER_SESSION);
    
    if (tokenRemoved || sessionRemoved) {
      console.log('👋 Sesión cerrada - cookies eliminadas');
    }
    return tokenRemoved;
  },

  setUserSession: (userData: { userId: string; username: string; email?: string }) => {
    const success = cookieUtils.set(COOKIE_KEYS.USER_SESSION, userData);
    if (success) {
      console.log('👤 Datos de usuario guardados');
    }
    return success;
  },

  getUserSession: () => {
    return cookieUtils.get(COOKIE_KEYS.USER_SESSION);
  },

  setChatPreferences: (preferences: { language?: string; notifications?: boolean }) => {
    const success = cookieUtils.set(COOKIE_KEYS.CHAT_PREFERENCES, preferences);
    if (success) {
      console.log('⚙️ Preferencias del chat guardadas');
    }
    return success;
  },

  getChatPreferences: () => {
    return cookieUtils.get(COOKIE_KEYS.CHAT_PREFERENCES) || { language: 'es', notifications: true };
  },

  isLoggedIn: () => {
    const token = cookieUtils.getAuthToken();
    const session = cookieUtils.getUserSession();
    return !!(token && session);
  },

  debugAllCookies: () => {
    console.log('=== 🍪 DEBUG COOKIES ===');
    console.log('Cookies aceptadas:', cookieUtils.areCookiesAccepted());
    console.log('Usuario logueado:', cookieUtils.isLoggedIn());
    console.log('Token de auth:', cookieUtils.getAuthToken() ? '✅ Existe' : '❌ No existe');
    console.log('Sesión de usuario:', cookieUtils.getUserSession());
    console.log('Preferencias:', cookieUtils.getChatPreferences());
    console.log('Todas las cookies:', cookieUtils.getAll());
    console.log('========================');
  }
};