
<template>
  <div class="row justify-content-center mt-4">
    <div class="col-md-6">
      <div class="card shadow-sm">
        <div class="card-header">
          <h4>Register New User</h4>
        </div>

        <div class="card-body">
          <div v-if="error" class="alert alert-danger">
            {{ error }}
          </div>

          <form @submit.prevent="register">
            <div v-for="field in fields" :key="field.key" class="mb-3">
              <label class="form-label">{{ field.label }}</label>
              <input
                v-model="credentials[field.key]"
                :type="field.type || 'text'"
                class="form-control"
                required
              />
            </div>

            <button class="btn btn-primary w-100" :disabled="loading">
              {{ loading ? 'Registering...' : 'Register' }}
            </button>
          </form>

          <p class="mt-3">
            Already registered?
            <router-link to="/auth">Login</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { APIService } from '../api/APIService'

const router = useRouter()
const api = new APIService()
const error = ref('')
const loading = ref(false)

const credentials = reactive({
  username: '',
  password: '',
  password2: '',
  email: '',
  first_name: '',
  last_name: ''
})

const fields = [
  { key: 'username', label: 'Username' },
  { key: 'password', label: 'Password', type: 'password' },
  { key: 'password2', label: 'Confirm Password', type: 'password' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'first_name', label: 'First Name' },
  { key: 'last_name', label: 'Last Name' }
]

async function register() {
  error.value = ''

  if (credentials.password !== credentials.password2) {
    error.value = 'Passwords do not match.'
    return
  }

  loading.value = true

  try {
    await api.registerUser(credentials)
    router.push('/auth')
  } catch (err) {
    const data = err.response?.data
    error.value = data
      ? JSON.stringify(data)
      : 'Registration failed. Check your backend connection.'
  } finally {
    loading.value = false
  }
}
</script>
