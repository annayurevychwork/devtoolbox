import { ref, watch, onMounted, onUnmounted } from 'vue'

export function useCrypto(initialSymbol = 'BTCUSDT') {
  const symbol = ref(initialSymbol)
  const price = ref(0)
  const history = ref([])
  const isLoading = ref(true)
  const error = ref(false)
  let intervalId = null

  const fetchPrice = async () => {
    try {
      error.value = false
      const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol.value}`)
      const data = await res.json()
      const currentPrice = parseFloat(data.price)
      price.value = currentPrice
      
      if (history.value.length === 0) {
        history.value = Array.from({length: 7}, () => currentPrice * (1 + (Math.random() - 0.5) * 0.02))
      }
      history.value.push(currentPrice)
      if (history.value.length > 10) history.value.shift()
      
      isLoading.value = false
    } catch (e) {
      error.value = true
      isLoading.value = false
    }
  }

  onMounted(() => {
    fetchPrice()
    intervalId = setInterval(fetchPrice, 5000)
  })

  onUnmounted(() => clearInterval(intervalId))

  watch(symbol, () => {
    isLoading.value = true
    history.value = []
    fetchPrice()
  })

  return { symbol, price, history, isLoading, error }
}