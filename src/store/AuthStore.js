import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    user: null,
    access: null,
    refresh: null,
    userID: null,
    is_superuser: false
  }),

  actions: {
    setAuth({ user, access, refresh }) {
      this.isAuthenticated = true
      this.user = user
      this.access = access
      this.refresh = refresh
    },

    setUserDetails({ userID, is_superuser }) {
      this.userID = userID
      this.is_superuser = is_superuser
    },

    clearAuth() {
      this.$reset()
    }
  },

  persist: {
    storage: sessionStorage,
    pick: [
      'isAuthenticated',
      'user',
      'access',
      'refresh',
      'userID',
      'is_superuser'
    ]
  }
})
