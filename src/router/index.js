import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/AuthStore'

import Home from '../components/Home.vue'
import Auth from '../components/Auth.vue'
import Register from '../components/Register.vue'
import CustomerList from '../components/CustomerList.vue'
import CustomerCreate from '../components/CustomerCreate.vue'
import MyCustomerList from '../components/MyCustomerList.vue'
import InvestmentList from '../components/InvestmentList.vue'
import InvestmentCreate from '../components/InvestmentCreate.vue'
import StockList from '../components/StockList.vue'
import StockCreate from '../components/StockCreate.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/auth', name: 'Auth', component: Auth, meta: { guestOnly: true } },
  { path: '/register', name: 'Register', component: Register, meta: { guestOnly: true } },

  { path: '/customer-list/:msg?', name: 'CustomerList', component: CustomerList, meta: { requiresAuth: true } },
  { path: '/customer-create/:pk?', name: 'CustomerCreate', component: CustomerCreate, meta: { requiresAuth: true } },
  { path: '/mycustomer-list/:msg?', name: 'MyCustomerList', component: MyCustomerList, meta: { requiresAuth: true } },

  { path: '/investment-list/:msg?', name: 'InvestmentList', component: InvestmentList, meta: { requiresAuth: true } },
  { path: '/investment-create/:pk?', name: 'InvestmentCreate', component: InvestmentCreate, meta: { requiresAuth: true } },

  { path: '/stock-list/:msg?', name: 'StockList', component: StockList, meta: { requiresAuth: true } },
  { path: '/stock-create/:pk?', name: 'StockCreate', component: StockCreate, meta: { requiresAuth: true } }
]


const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'Auth' }
  }

  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { name: 'Home' }
  }

  return true
})

export default router

