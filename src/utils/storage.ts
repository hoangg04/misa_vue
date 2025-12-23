/**
 * Creates a storage instance for managing JSON data in localStorage.
 * @param {string} key - The localStorage key to use for storage operations.
 * @returns {Object} Storage instance with get and set methods.
 */
const storage = (
  key: string,
): { get: (fallback: unknown) => typeof fallback; set: (value: unknown) => boolean } => {
  /**
   * Checks if localStorage is available in the current environment.
   * @returns {boolean} True if localStorage is available, false otherwise.
   */
  const isAvailable = (): boolean => {
    try {
      const testKey = '__storage_test__'
      window.localStorage.setItem(testKey, '1')
      window.localStorage.removeItem(testKey)
      return true
    } catch {
      return false
    }
  }

  const enabled = isAvailable()

  return {
    /**
     * Retrieves and parses JSON data from localStorage.
     * @param {*} fallback - Value to return if key doesn't exist or parsing fails.
     * @returns {*} Parsed JSON data or fallback value.
     */
    get: (fallback: unknown = null): unknown => {
      if (!enabled || !key) return fallback
      try {
        const raw = window.localStorage.getItem(key)
        if (raw === null) return fallback
        return JSON.parse(raw)
      } catch {
        return fallback
      }
    },

    /**
     * Serializes and stores data as JSON in localStorage.
     * @param {*} value - Data to serialize and store.
     * @returns {boolean} True if successful, false otherwise.
     */
    set: (value: unknown): boolean => {
      if (!enabled || !key) return false
      try {
        const serialized = JSON.stringify(value)
        window.localStorage.setItem(key, serialized)
        return true
      } catch {
        return false
      }
    },
  }
}

export default storage
