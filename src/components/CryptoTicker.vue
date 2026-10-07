<script setup>
import { ref, watch, onMounted, onUnmounted, computed, inject } from 'vue'

const symbol = ref('BTCUSDT')
const price = ref(0)
const history = ref([])
const isLoading = ref(true)
const error = ref(false)
const alertTrigger = ref('')
const isAlertActive = ref(false)
const holdings = ref(0)
const addToast = inject('addToast')
let intervalId = null

const coins = [
  { id: 'BTCUSDT', name: 'Bitcoin', icon: '₿', bg: 'bg-gradient-to-br from-orange-400 to-orange-500' },
  { id: 'ETHUSDT', name: 'Ethereum', icon: 'Ξ', bg: 'bg-gradient-to-br from-blue-400 to-blue-600' },
  { id: 'SOLUSDT', name: 'Solana', icon: 'S', bg: 'bg-gradient-to-br from-purple-400 to-purple-600' }
]

const currentCoin = computed(() => coins.find(c => c.id === symbol.value))
const portfolioValue = computed(() => (holdings.value * price.value).toLocaleString('en-US', { style: 'currency', currency: 'USD' }))

const chartOptions = computed(() => ({
  chart: { type: 'area', animations: { enabled: false }, toolbar: { show: false } },
  stroke: { curve: 'smooth', width: 3 },
  fill: { opacity: 0.2, type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0 } },
  colors: ['#3b82f6'],
  dataLabels: { enabled: false },
  xaxis: { 
    type: 'datetime', 
    labels: { show: true, datetimeUTC: false, format: 'HH:mm:ss' },
    tooltip: { enabled: false }
  },
  yaxis: { show: false },
  grid: { show: false },
  tooltip: { x: { format: 'HH:mm:ss' } }
}))

const chartSeries = computed(() => [{ name: 'Price', data: history.value }])

const fetchPrice = async () => {
  try {
    error.value = false
    const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol.value}`)
    const data = await res.json()
    const currentPrice = parseFloat(data.price)
    price.value = currentPrice
    isLoading.value = false

    const now = Date.now()
    if (history.value.length === 0) {
      history.value = Array.from({length: 15}, (_, i) => ({
        x: now - (15 - i) * 3000,
        y: currentPrice * (1 + (Math.random() - 0.5) * 0.01)
      }))
    }
    history.value.push({ x: now, y: currentPrice })
    if (history.value.length > 15) history.value.shift()

    if (alertTrigger.value && price.value >= parseFloat(alertTrigger.value) && !isAlertActive.value) {
      isAlertActive.value = true
      addToast(`Target price for ${currentCoin.value.name} reached!`, 'success')
    } else if (alertTrigger.value && price.value < parseFloat(alertTrigger.value)) {
      isAlertActive.value = false
    }
  } catch (e) {
    error.value = true
    isLoading.value = false
  }
}

watch(symbol, () => {
  isLoading.value = true
  history.value = []
  isAlertActive.value = false
  fetchPrice()
})

onMounted(() => {
  fetchPrice()
  intervalId = setInterval(fetchPrice, 3000)
})

onUnmounted(() => clearInterval(intervalId))
</script>

<template>
  <div class="max-w-md mx-auto">
    <h2 class="text-2xl font-bold text-slate-800 mb-6 tracking-tight">Live Crypto Market</h2>
    
    <div class="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 relative overflow-hidden">
      <div v-if="isAlertActive" class="absolute top-0 left-0 w-full bg-green-500 text-white text-center text-xs font-bold py-1.5 animate-pulse z-20">
        TARGET PRICE REACHED!
      </div>

      <div class="flex justify-between items-center mb-6 relative z-10">
        <div class="flex items-center gap-3">
          <div :class="`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg ${currentCoin.bg}`">
            <span class="font-bold text-2xl">{{ currentCoin.icon }}</span>
          </div>
          <h2 class="text-xl font-black text-slate-800">{{ currentCoin.name }}</h2>
        </div>
        <select v-model="symbol" class="bg-slate-50 border border-slate-200 text-slate-800 font-bold rounded-xl px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-sm">
          <option v-for="coin in coins" :key="coin.id" :value="coin.id">{{ coin.id.replace('USDT', '') }}</option>
        </select>
      </div>
      
      <div v-if="isLoading" class="h-12 bg-slate-100 animate-pulse rounded-xl mb-6"></div>
      <p v-else :class="{'text-red-500': error, 'text-slate-900': !error}" class="text-4xl font-black mb-4 tracking-tight relative z-10">
        {{ error ? 'Error' : price.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }}
      </p>

      <div class="h-28 w-full mb-4 relative z-10">
        <apexchart type="area" height="100%" :options="chartOptions" :series="chartSeries"></apexchart>
      </div>
      
      <div class="space-y-4 relative z-10 border-t border-slate-100 pt-5">
        <div>
          <label class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Alert if price above ($)</label>
          <input type="number" v-model="alertTrigger" placeholder="e.g. 90000" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-800 transition-all text-sm">
        </div>
        
        <div class="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <label class="text-[10px] font-bold text-slate-500 uppercase block mb-2">My Portfolio Balance</label>
          <input type="number" v-model="holdings" placeholder="0.00" class="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500 mb-3 font-bold text-slate-800 placeholder-slate-400 text-sm">
          <div class="flex justify-between items-center border-t border-slate-200 pt-3">
            <span class="text-xs font-bold text-slate-500">Total Value:</span>
            <span class="font-black text-lg text-green-600">{{ portfolioValue }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>