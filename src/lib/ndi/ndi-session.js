/**
 * Utility for managing Bhutan NDI session persistence in the browser.
 */
const SESSION_KEY = 'bgps_ndi_session';

export const NDISession = {
  /**
   * Persists the NDI profile to local storage.
   */
  saveSession(profile) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
  },

  /**
   * Retrieves the NDI profile from local storage.
   */
  getSession() {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(SESSION_KEY);
    try {
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Failed to parse NDI session', e);
      return null;
    }
  },

  /**
   * Clears the NDI session.
   */
  clearSession() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(SESSION_KEY);
  },

  /**
   * Checks if an active NDI session exists.
   */
  hasActiveSession() {
    return !!this.getSession();
  }
};
