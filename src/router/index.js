import { createRouter, createWebHistory } from 'vue-router'
import MarkdownEditor from '../components/MarkdownEditor.vue'
import PricingWidget from '../components/PricingWidget.vue'
import CryptoTicker from '../components/CryptoTicker.vue'

const routes = [
  { path: '/', redirect: '/editor' },
  { path: '/editor', component: MarkdownEditor },
  { path: '/pricing', component: PricingWidget },
  { path: '/crypto', component: CryptoTicker }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})