<script setup>
import { ref, computed } from 'vue'

const users = ref(10)
const storage = ref(50)
const isAnnual = ref(false)
const currency = ref('USD')
const addons = ref({ priority: false, whitelabel: false })

const rates = { USD: { rate: 1, sym: '$' }, EUR: { rate: 0.92, sym: '€' }, GBP: { rate: 0.79, sym: '£' } }

const pricingData = computed(() => {
  const base = 29
  const usrCost = users.value * 5
  const stgCost = storage.value * 0.5
  const extraCost = (addons.value.priority ? 50 : 0) + (addons.value.whitelabel ? 100 : 0)
  
  const subtotal = base + usrCost + stgCost + extraCost
  const discount = isAnnual.value ? subtotal * 0.2 : 0
  const finalUsd = subtotal - discount

  const usrPct = (usrCost / subtotal) * 100
  const stgPct = (stgCost / subtotal) * 100

  return {
    total: (finalUsd * rates[currency.value].rate).toFixed(2),
    sym: rates[currency.value].sym,
    chartStyle: `conic-gradient(#3b82f6 0% ${usrPct}%, #10b981 ${usrPct}% ${usrPct + stgPct}%, #f59e0b ${usrPct + stgPct}% 100%)`
  }
})
</script>

<template>
  <div class="max-w-3xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-slate-800 tracking-tight">SaaS Pricing</h2>
      <select v-model="currency" class="bg-white text-slate-800 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer">
        <option value="USD">USD ($)</option>
        <option value="EUR">EUR (€)</option>
        <option value="GBP">GBP (£)</option>
      </select>
    </div>

    <div class="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 flex gap-8">
      <div class="flex-1">
        <div class="flex justify-between items-center bg-slate-100 p-1 rounded-xl mb-6 border border-slate-200">
          <button @click="isAnnual = false" :class="!isAnnual ? 'bg-white shadow text-slate-800' : 'text-slate-500'" class="flex-1 py-2 text-sm rounded-lg font-bold transition-all">Monthly</button>
          <button @click="isAnnual = true" :class="isAnnual ? 'bg-white shadow text-slate-800' : 'text-slate-500'" class="flex-1 py-2 text-sm rounded-lg font-bold transition-all">Annual (-20%)</button>
        </div>

        <div class="mb-6">
          <div class="flex justify-between mb-2">
            <label class="font-bold text-slate-700 text-sm">Users ($5/user)</label>
            <span class="font-extrabold text-blue-600 text-lg">{{ users }}</span>
          </div>
          <input type="range" v-model="users" min="1" max="100" class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600">
        </div>
        
        <div class="mb-6">
          <div class="flex justify-between mb-2">
            <label class="font-bold text-slate-700 text-sm">Storage ($0.5/GB)</label>
            <span class="font-extrabold text-green-500 text-lg">{{ storage }} GB</span>
          </div>
          <input type="range" v-model="storage" min="10" max="1000" step="10" class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-green-500">
        </div>

        <div class="space-y-3">
          <label class="flex items-center gap-3 cursor-pointer p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
            <input type="checkbox" v-model="addons.priority" class="w-4 h-4 accent-orange-500">
            <span class="font-bold text-slate-700 text-sm">Priority Support (+$50)</span>
          </label>
          <label class="flex items-center gap-3 cursor-pointer p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
            <input type="checkbox" v-model="addons.whitelabel" class="w-4 h-4 accent-orange-500">
            <span class="font-bold text-slate-700 text-sm">White-label (+$100)</span>
          </label>
        </div>
      </div>

      <div class="w-64 bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col items-center justify-center">
        <div class="w-36 h-36 rounded-full mb-6 shadow-lg border-4 border-white" :style="{ background: pricingData.chartStyle }"></div>
        
        <div class="w-full space-y-2 mb-6 text-xs font-bold text-slate-600">
          <div class="flex items-center gap-2"><span class="w-3 h-3 bg-blue-500 rounded-full"></span> Users</div>
          <div class="flex items-center gap-2"><span class="w-3 h-3 bg-green-500 rounded-full"></span> Storage</div>
          <div class="flex items-center gap-2"><span class="w-3 h-3 bg-orange-500 rounded-full"></span> Base + Addons</div>
        </div>

        <p class="text-xs text-slate-400 mb-1 font-black uppercase tracking-widest">Total Estimate</p>
        <div class="text-4xl font-black text-slate-900 flex items-baseline gap-1">
          <span class="text-2xl text-slate-400">{{ pricingData.sym }}</span>
          {{ pricingData.total }}
        </div>
      </div>
    </div>
  </div>
</template>