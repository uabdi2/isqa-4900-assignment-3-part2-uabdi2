
<template>
  <div class="row justify-content-center mt-5">
    <div class="col-md-5">
      <div class="card shadow-sm">
        <div class="card-header"><h4>Login</h4></div>
        <div class="card-body">
          <div v-if="error" class="alert alert-danger">{{ error }}</div>

          <form @submit.prevent="login">
            <div class="mb-3">
              <label class="form-label">Username</label>
              <input v-model="credentials.username" class="form-control" required />
            </div>

            <div class="mb-3">
              <label class="form-label">Password</label>
              <input v-model="credentials.password" type="password"
                     class="form-control" required />
            </div>

            <button class="btn btn-primary w-100" :disabled="loading">
              {{ loading ? 'Logging in...' : 'Login' }}
            </button>
          </form>

          <p class="mt-3">
            Don't have an account?
            <router-link to="/register">Register</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/AuthStore'
import { APIService } from '../api/APIService'

const router = useRouter()
const auth = useAuthStore()
const api = new APIService()

const credentials = reactive({ username: '', password: '' })
const error = ref('')
const loading = ref(false)

async function login() {
  loading.value = true
  error.value = ''

  try {
    const response = await api.authenticateLogin(credentials)

    auth.setAuth({
      user: credentials.username,
      access: response.data.access,
      refresh: response.data.refresh
    })

    const userResponse = await api.getUser()

    auth.setUserDetails({
      userID: userResponse.data.pk,
      is_superuser: userResponse.data.is_superuser
    })

    router.push('/')
  } catch (err) {
    auth.clearAuth()
    error.value = err.response?.data?.detail ||
      (err.response ? 'Login failed. Check your credentials.' :
        'Unable to connect to the backend. Check CORS and network settings.')
  } finally {
    loading.value = false
  }
}
</script>
