
<template>
  <div class="text-center py-5">
    <h1>Welcome {{ auth.user || 'Guest' }}!</h1>
    <p class="lead text-muted">
      Financial Services — Your Midwest Financial Services Partner
    </p>

    <div class="row g-4 mt-4">
      <div v-for="item in items" :key="item.title" class="col-md-4">
        <div class="card h-100 shadow-sm">
          <div class="card-body py-5">
            <i :class="item.icon" class="fs-1 text-primary"></i>
            <h4 class="mt-3">{{ item.title }}</h4>
            <p class="text-muted">{{ item.description }}</p>
            <router-link :to="item.path" class="btn btn-primary">
              View {{ item.title }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../store/AuthStore'

const auth = useAuthStore()

const items = [
  {
    title: 'Customers',
    icon: 'bi bi-people',
    description: 'Manage customer information',
    path: '/customer-list'
  },
  {
    title: 'Investments',
    icon: 'bi bi-graph-up-arrow',
    description: 'Manage investment portfolios',
    path: '/investment-list'
  },
  {
    title: 'Stocks',
    icon: 'bi bi-bar-chart',
    description: 'Manage stock holdings',
    path: '/stock-list'
  }
]
</script>
