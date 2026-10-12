import axios from 'axios'
import { useAuthStore } from '../store/AuthStore'

const API_URL = 'https://ubax022.pythonanywhere.com'

export class APIService {
  getAuthHeaders() {
    const auth = useAuthStore()
    return auth.access
      ? { Authorization: `JWT ${auth.access}` }
      : {}
  }

  authenticateLogin(credentials) {
    return axios.post(`${API_URL}/api/`, credentials)
  }

  registerUser(credentials) {
    return axios.post(`${API_URL}/register/`, credentials)
  }

  getUser() {
    return axios.get(`${API_URL}/api/getUser/`, {
      headers: this.getAuthHeaders()
    })
  }

  getCustomerList() {
    return axios.get(`${API_URL}/api/customers/`, {
      headers: this.getAuthHeaders()
    })
  }

  getMyCustomerList() {
    return axios.get(`${API_URL}/api/mycustomers/`, {
      headers: this.getAuthHeaders()
    })
  }

  getCustomer(pk) {
    return axios.get(`${API_URL}/api/customers/${pk}`, {
      headers: this.getAuthHeaders()
    })
  }

  addNewCustomer(customer) {
    return axios.post(`${API_URL}/api/customers/`, customer, {
      headers: this.getAuthHeaders()
    })
  }

  updateCustomer(customer) {
    return axios.put(`${API_URL}/api/customers/${customer.pk}`, customer, {
      headers: this.getAuthHeaders()
    })
  }

  deleteCustomer(pk) {
    return axios.delete(`${API_URL}/api/customers/${pk}`, {
      headers: this.getAuthHeaders()
    })
  }

  getInvestmentList() {
    return axios.get(`${API_URL}/api/investments/`, {
      headers: this.getAuthHeaders()
    })
  }

  getInvestment(pk) {
    return axios.get(`${API_URL}/api/investments/${pk}`, {
      headers: this.getAuthHeaders()
    })
  }

  addNewInvestment(investment) {
    return axios.post(`${API_URL}/api/investments/`, investment, {
      headers: this.getAuthHeaders()
    })
  }

  updateInvestment(investment) {
    return axios.put(
      `${API_URL}/api/investments/${investment.pk}`,
      investment,
      { headers: this.getAuthHeaders() }
    )
  }

  deleteInvestment(pk) {
    return axios.delete(`${API_URL}/api/investments/${pk}`, {
      headers: this.getAuthHeaders()
    })
  }

  getStockList() {
    return axios.get(`${API_URL}/api/stocks/`, {
      headers: this.getAuthHeaders()
    })
  }

  getStock(pk) {
    return axios.get(`${API_URL}/api/stocks/${pk}`, {
      headers: this.getAuthHeaders()
    })
  }

  addNewStock(stock) {
    return axios.post(`${API_URL}/api/stocks/`, stock, {
      headers: this.getAuthHeaders()
    })
  }

  updateStock(stock) {
    return axios.put(`${API_URL}/api/stocks/${stock.pk}`, stock, {
      headers: this.getAuthHeaders()
    })
  }

  deleteStock(pk) {
    return axios.delete(`${API_URL}/api/stocks/${pk}`, {
      headers: this.getAuthHeaders()
    })
  }
}
