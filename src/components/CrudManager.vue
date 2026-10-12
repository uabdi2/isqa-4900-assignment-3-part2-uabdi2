<template>
  <div class="container py-3">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>{{ title }}</h2>
      <button class="btn btn-primary" @click="startCreate">
        <i class="bi bi-plus-circle"></i> Add New
      </button>
    </div>

    <div v-if="error" class="alert alert-danger">
      {{ error }}
      <button
        v-if="authError"
        class="btn btn-sm btn-outline-danger ms-2"
        @click="logout"
      >Log in again</button>
    </div>

    <div v-if="message" class="alert alert-success">
      {{ message }}
    </div>

    <div v-if="editing" class="card shadow-sm mb-4">
      <div class="card-header">
        <strong>{{ form.pk ? 'Edit' : 'Add New' }} {{ singular }}</strong>
      </div>
      <div class="card-body">
        <form @submit.prevent="save">
          <div class="row">
            <div
              v-for="field in fields"
              :key="field.key"
              class="col-md-6 mb-3"
            >
              <label class="form-label">{{ field.label }}</label>

              <select
                v-if="field.type === 'customer'"
                v-model="form[field.key]"
                class="form-select"
                required
              >
                <option value="" disabled>Select Customer</option>
                <option
                  v-for="customer in customers"
                  :key="customer.pk"
                  :value="customer.pk"
                >
                  {{ customer.name }} (#{{ customer.cust_number }})
                </option>
              </select>

              <input
                v-else
                v-model="form[field.key]"
                :type="field.type || 'text'"
                :step="field.type === 'number' ? 'any' : undefined"
                :required="field.required !== false"
                class="form-control"
              />
            </div>
          </div>

          <button type="submit" class="btn btn-success me-2" :disabled="saving">
            {{ saving ? 'Saving...' : 'Save' }}
          </button>
          <button type="button" class="btn btn-secondary" @click="cancel">
            Cancel
          </button>
        </form>
      </div>
    </div>

    <div v-if="loading" class="text-center py-4">
      Loading {{ title.toLowerCase() }}...
    </div>

    <div v-else class="table-responsive">
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th v-for="field in fields" :key="field.key">
              {{ field.label }}
            </th>
            <th v-if="type === 'customer'">Agent</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in displayedItems" :key="item.pk">
            <td v-for="field in fields" :key="field.key">
              {{ displayValue(item, field) }}
            </td>
            <td v-if="type === 'customer'">
              {{ item.agent }}
            </td>
            <td>
              <template v-if="canModify(item)">
                <button
                  class="btn btn-sm btn-outline-primary me-2"
                  @click="startEdit(item)"
                >Edit</button>
                <button
                  class="btn btn-sm btn-outline-danger"
                  @click="remove(item)"
                >Delete</button>
              </template>
              <span v-else class="text-muted">View only</span>
            </td>
          </tr>

          <tr v-if="displayedItems.length === 0">
            <td
              :colspan="fields.length + (type === 'customer' ? 2 : 1)"
              class="text-center text-muted py-4"
            >
              No records found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../store/AuthStore'
import { APIService } from '../api/APIService'

const props = defineProps({
  type: { type: String, required: true },
  mineOnly: { type: Boolean, default: false }
})

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const api = new APIService()

const items = ref([])
const customers = ref([])
const form = ref({})
const editing = ref(false)
const loading = ref(false)
const saving = ref(false)
const error = ref('')
const message = ref('')
const authError = ref(false)

const config = {
  customer: {
    title: 'Customers',
    singular: 'Customer',
    fields: [
      { key: 'cust_number', label: 'Customer #', type: 'number' },
      { key: 'name', label: 'Name' },
      { key: 'address', label: 'Address' },
      { key: 'city', label: 'City' },
      { key: 'state', label: 'State' },
      { key: 'zipcode', label: 'ZIP Code' },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'cell_phone', label: 'Phone' }
    ],
    list: () => api.getCustomerList(),
    create: data => api.addNewCustomer(data),
    update: data => api.updateCustomer(data),
    delete: pk => api.deleteCustomer(pk)
  },
  investment: {
    title: 'Investments',
    singular: 'Investment',
    fields: [
      { key: 'customer', label: 'Customer', type: 'customer' },
      { key: 'category', label: 'Category' },
      { key: 'description', label: 'Description' },
      { key: 'acquired_value', label: 'Acquired Value', type: 'number' },
      { key: 'acquired_date', label: 'Acquired Date', type: 'date' },
      { key: 'recent_value', label: 'Recent Value', type: 'number' },
      { key: 'recent_date', label: 'Recent Date', type: 'date' }
    ],
    list: () => api.getInvestmentList(),
    create: data => api.addNewInvestment(data),
    update: data => api.updateInvestment(data),
    delete: pk => api.deleteInvestment(pk)
  },
  stock: {
    title: 'Stocks',
    singular: 'Stock',
    fields: [
      { key: 'customer', label: 'Customer', type: 'customer' },
      { key: 'symbol', label: 'Symbol' },
      { key: 'name', label: 'Company Name' },
      { key: 'shares', label: 'Shares', type: 'number' },
      { key: 'purchase_price', label: 'Purchase Price', type: 'number' },
      { key: 'purchase_date', label: 'Purchase Date', type: 'date' }
    ],
    list: () => api.getStockList(),
    create: data => api.addNewStock(data),
    update: data => api.updateStock(data),
    delete: pk => api.deleteStock(pk)
  }
}

const current = computed(() => config[props.type])
const title = computed(() =>
  props.mineOnly ? 'My Customers' : current.value.title
)
const singular = computed(() => current.value.singular)
const fields = computed(() => current.value.fields)

const isAdmin = computed(() =>
  auth.is_superuser === true || auth.is_superuser === 'true'
)

const displayedItems = computed(() => {
  if (!props.mineOnly || isAdmin.value) return items.value
  return items.value.filter(
    item => Number(item.agent) === Number(auth.userID)
  )
})

function canModify(item) {
  if (props.type !== 'customer') return true
  return isAdmin.value ||
    (item.agent != null &&
      auth.userID != null &&
      Number(item.agent) === Number(auth.userID))
}

function displayValue(item, field) {
  if (field.type === 'customer') {
    const c = customers.value.find(
      c => Number(c.pk) === Number(item[field.key])
    )
    return c ? c.name : item[field.key]
  }
  return item[field.key] ?? ''
}

function handleError(err, fallback) {
  const status = err.response?.status
  const detail = err.response?.data

  if (status === 401) {
    authError.value = true
    error.value = 'Your login session has expired. Please log in again.'
  } else if (status === 403) {
    error.value = 'You do not have permission for this action.'
  } else {
    error.value = detail
      ? JSON.stringify(detail)
      : fallback
  }
}

function logout() {
  auth.clearAuth()
  router.push('/auth')
}

async function load() {
  loading.value = true
  error.value = ''
  authError.value = false

  try {
    const response = await current.value.list()
    const records = response.data.data ?? response.data
    items.value = Array.isArray(records) ? records : []

    if (props.type !== 'customer') {
      const result = await api.getCustomerList()
      const records = result.data.data ?? result.data
      customers.value = Array.isArray(records) ? records : []
    }
  } catch (err) {
    items.value = []
    handleError(err, 'Unable to load records.')
  } finally {
    loading.value = false
  }
}

function startCreate() {
  form.value = props.type === 'customer'
    ? { agent: auth.userID }
    : { customer: '' }
  editing.value = true
  error.value = ''
  message.value = ''
}

function startEdit(item) {
  if (!canModify(item)) return
  form.value = { ...item }
  editing.value = true
  error.value = ''
  message.value = ''
}

function cancel() {
  editing.value = false
  form.value = {}
}

async function save() {
  saving.value = true
  error.value = ''
  message.value = ''

  try {
    const data = { ...form.value }

    if (props.type === 'customer') {
      if (!data.pk) data.agent = auth.userID
      else if (!canModify(data)) {
        error.value = 'You cannot edit this customer.'
        return
      }
    } else {
      const selected = customers.value.find(
        c => Number(c.pk) === Number(data.customer)
      )
      if (!selected) {
        error.value = 'Please select a valid customer.'
        return
      }
      data.cust_number = selected.cust_number
    }

    if (data.pk) {
      await current.value.update(data)
      message.value = 'Record updated successfully.'
    } else {
      await current.value.create(data)
      message.value = 'Record created successfully.'
    }

    editing.value = false
    form.value = {}
    await load()
  } catch (err) {
    handleError(err, 'Unable to save record.')
  } finally {
    saving.value = false
  }
}

async function remove(item) {
  if (!canModify(item)) return
  if (!window.confirm('Delete this record?')) return

  error.value = ''
  message.value = ''

  try {
    await current.value.delete(item.pk)
    message.value = 'Record deleted successfully.'
    await load()
  } catch (err) {
    handleError(err, 'Unable to delete record.')
  }
}

watch(
  () => [props.type, props.mineOnly, route.params.pk],
  async () => {
    editing.value = false
    await load()
    if (route.params.pk) {
      const record = items.value.find(
        item => String(item.pk) === String(route.params.pk)
      )
      if (record) startEdit(record)
    }
  },
  { immediate: true }
)
</script>
