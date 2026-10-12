<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary px-4">
      <router-link class="navbar-brand" to="/">
        Financial Services
      </router-link>

      <div class="navbar-nav flex-row flex-wrap gap-3 ms-auto">
        <router-link class="nav-link" to="/">Home</router-link>

        <template v-if="auth.isAuthenticated">
          <router-link class="nav-link" to="/customer-list">Customers</router-link>
          <router-link class="nav-link" to="/mycustomer-list">My Customers</router-link>
          <router-link class="nav-link" to="/investment-list">Investments</router-link>
          <router-link class="nav-link" to="/stock-list">Stocks</router-link>
          <button class="btn btn-light btn-sm" @click="logout">Logout</button>
        </template>

        <template v-else>
          <router-link class="nav-link" to="/register">Register</router-link>
          <router-link class="nav-link" to="/auth">Login</router-link>
        </template>
      </div>
    </nav>

    <main class="container py-4">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from './store/AuthStore'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

function logout() {
  auth.clearAuth()
  router.push('/')
}
</script>
