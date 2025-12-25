/**
 * Creates a storage instance for managing JSON data in localStorage.
 * @param {string} key - The localStorage key to use for storage operations.
 * @returns Storage instance with typed `get` and `set` methods.
 */
const storage = <T>(key: string): { get: (fallback: T) => T; set: (value: T) => boolean } => {
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
    get: (fallback: T): T => {
      if (!enabled || !key) return fallback
      try {
        const raw = window.localStorage.getItem(key)
        if (raw === null) return fallback
        return JSON.parse(raw) as T
      } catch {
        return fallback
      }
    },

    /**
     * Serializes and stores data as JSON in localStorage.
     * @param {*} value - Data to serialize and store.
     * @returns {boolean} True if successful, false otherwise.
     */
    set: (value: T): boolean => {
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
