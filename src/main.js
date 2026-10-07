import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './router'
import VueApexCharts from 'vue3-apexcharts'
import { vTooltip } from './directives/vTooltip'

const app = createApp(App)
app.use(router)
app.use(VueApexCharts)
app.directive('tooltip', {
  mounted(el, binding) {
    el.setAttribute('title', binding.value)
    el.classList.add('cursor-help', 'relative')
  }
})
app.mount('#app')