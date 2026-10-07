<script setup>
import { ref, provide } from 'vue'

const toasts = ref([])
const addToast = (message, type = 'success') => {
  const id = Date.now()
  toasts.value.push({ id, message, type })
  setTimeout(() => { toasts.value = toasts.value.filter(t => t.id !== id) }, 3000)
}
provide('addToast', addToast)
</script>

<template>
  <div class="flex h-screen bg-slate-50 font-sans text-slate-900">
    <nav class="w-72 bg-white p-6 flex flex-col gap-4 z-10 border-r border-slate-200 shadow-sm">
      <div class="flex items-center gap-3 mb-8">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/20">
          <span class="font-bold text-xl text-white">🛠️</span>
        </div>
        <h1 class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
          DevToolbox
        </h1>
      </div>

      <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Widgets</p>
      
      <router-link to="/editor" class="p-3 rounded-xl hover:bg-slate-50 transition-all duration-300 flex items-center gap-3 font-medium text-slate-600" active-class="bg-blue-50 text-blue-700 font-bold border-l-4 border-blue-500">
        Markdown Editor
      </router-link>
      <router-link to="/pricing" class="p-3 rounded-xl hover:bg-slate-50 transition-all duration-300 flex items-center gap-3 font-medium text-slate-600" active-class="bg-blue-50 text-blue-700 font-bold border-l-4 border-blue-500">
        SaaS Pricing
      </router-link>
      <router-link to="/crypto" class="p-3 rounded-xl hover:bg-slate-50 transition-all duration-300 flex items-center gap-3 font-medium text-slate-600" active-class="bg-blue-50 text-blue-700 font-bold border-l-4 border-blue-500">
        Crypto Ticker
      </router-link>
    </nav>

    <main class="flex-1 p-10 overflow-auto relative">
      <div class="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-100/30 to-transparent pointer-events-none"></div>
      <div class="relative z-10 h-full max-w-6xl mx-auto">
        <router-view></router-view>
      </div>
    </main>

    <div class="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <div v-for="toast in toasts" :key="toast.id" class="px-6 py-4 rounded-xl shadow-2xl font-bold text-white transition-all transform animate-bounce" :class="toast.type === 'success' ? 'bg-slate-800' : 'bg-red-500'">
        {{ toast.message }}
      </div>
    </div>

    <Teleport to="body">
    <div v-if="isProfileOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full relative">
        <h2 class="text-2xl font-bold mb-4">Profile Settings</h2>
        <button @click="isProfileOpen = false" class="w-full py-2 bg-slate-800 text-white rounded-lg font-bold">Close</button>
      </div>
    </div>
  </Teleport>
  </div>
</template>