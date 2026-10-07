<script setup>
import { ref, computed, watch, onMounted, nextTick, inject } from 'vue'
import { marked } from 'marked'
import mermaid from 'mermaid'

const rawText = ref('')
const addToast = inject('addToast')

onMounted(() => {
  const saved = localStorage.getItem('markdown_draft')
  if (saved) {
    rawText.value = saved
  } else {
    rawText.value = `# 🛠️ Welcome to DevToolbox Editor

This is a real-time Markdown editor designed for modern developers.

## ✨ Key Features Showcase
- **Live Reactivity:** Powered by Vue's \`v-model\` and \`computed\` properties for instant rendering.
- **Live Statistics:** Check the counter below for real-time word and character tracking.
- **Export Options:** Instantly copy the rendered HTML or download the \`.md\` file.

## 📊 Architecture Visualization (Mermaid.js)
You can render complex diagrams directly from text:

\`\`\`mermaid
graph LR;
    User((User))-->|Types| Input(Raw Markdown);
    Input-->|v-model| State{Vue State};
    State-->|computed| Parser[Marked.js];
    State-->|watch| Storage[(LocalStorage)]
\`\`\`

> *Pro tip: Try changing this text, adding a numbered list, or editing the flowchart above to see the Vue reactivity engine in action!*`
  }
  mermaid.initialize({ startOnLoad: false, theme: 'default' })
})

watch(rawText, (newText) => {
  localStorage.setItem('markdown_draft', newText)
})

const htmlText = computed(() => marked(rawText.value))

watch(htmlText, async () => {
  await nextTick()
  const mermaidBlocks = document.querySelectorAll('.language-mermaid')
  mermaidBlocks.forEach(async (block, index) => {
    try {
      const code = block.textContent
      const id = `mermaid-svg-${Date.now()}-${index}`
      const { svg } = await mermaid.render(id, code)
      const container = document.createElement('div')
      container.className = 'mermaid flex justify-center my-6'
      container.innerHTML = svg
      const preElement = block.parentElement
      preElement.parentNode.replaceChild(container, preElement)
    } catch (error) {
      console.error('Mermaid rendering failed:', error)
    }
  })
}, { immediate: true })

const wordCount = computed(() => rawText.value.trim() === '' ? 0 : rawText.value.trim().split(/\s+/).length)
const charCount = computed(() => rawText.value.length)

const downloadFile = () => {
  const blob = new Blob([rawText.value], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'document.md'
  link.click()
  URL.revokeObjectURL(url)
  addToast('File downloaded successfully!', 'success')
}

const copyHtml = async () => {
  await navigator.clipboard.writeText(htmlText.value)
  addToast('HTML Copied to clipboard!', 'success')
}
</script>

<template>
  <div class="h-full flex flex-col">
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center gap-3">
        <h2 class="text-3xl font-bold text-slate-800 tracking-tight">Markdown Editor</h2>
        <div v-tooltip="'To create a diagram, add a code block with the mermaid language. \n\nExample:\n```mermaid\ngraph TD;\n    A-->B;\n```\n\nText formatting:\n- Bulleted list: * text\n- Numbered list: 1. text\n- Bold: **text**\n- Italic: *text*'" class="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-sm cursor-help hover:bg-slate-300 transition-colors">?</div>
      </div>
      <div class="flex gap-3">
        <button @click="downloadFile" class="px-5 py-2.5 bg-white text-slate-800 rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 font-bold transition-colors">
          Download .md
        </button>
        <button @click="copyHtml" class="px-5 py-2.5 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 font-bold transition-colors">
          Copy HTML
        </button>
      </div>
    </div>
    
    <div class="flex h-full gap-8">
      <div class="w-1/2 flex flex-col gap-3">
        <textarea 
          v-model="rawText" 
          class="flex-1 p-8 bg-white text-slate-800 border border-slate-200 rounded-2xl shadow-sm resize-none focus:ring-4 focus:ring-blue-500/20 outline-none transition-shadow font-mono text-sm"
        ></textarea>
        <div class="text-slate-500 text-sm px-2 font-bold flex gap-6">
          <span>Words: <strong class="text-blue-600">{{ wordCount }}</strong></span>
          <span>Characters: <strong class="text-blue-600">{{ charCount }}</strong></span>
          <span class="ml-auto text-green-500">● Auto-saved</span>
        </div>
      </div>
      
      <div 
        v-html="htmlText" 
        class="custom-prose w-1/2 p-8 bg-white text-slate-800 border border-slate-200 rounded-2xl shadow-sm overflow-auto"
      ></div>
    </div>
  </div>
</template>

<style scoped>
:deep(.custom-prose h1) {
  font-size: 1.7rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: #0f172a;
}
:deep(.custom-prose h2) {
  font-size: 1.3rem;
  font-weight: 700;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  color: #1e293b;
}
:deep(.custom-prose p) {
  margin-bottom: 1rem;
  line-height: 1.6;
}

/* Примусове відновлення стилів списків від Tailwind */
:deep(.custom-prose ul) {
  list-style-type: disc !important;
  padding-left: 2rem !important; 
  margin-bottom: 1rem;
  margin-top: 0.5rem;
  display: block;
}
:deep(.custom-prose ol) {
  list-style-type: decimal !important;
  padding-left: 2rem !important;
  margin-bottom: 1rem;
  margin-top: 0.5rem;
  display: block;
}
:deep(.custom-prose li) {
  display: list-item !important; 
  margin-bottom: 0.3rem;
}

:deep(.custom-prose strong) {
  font-weight: 700;
  color: #0f172a;
}
:deep(.custom-prose blockquote) {
  border-left: 4px solid #cbd5e1;
  padding-left: 1rem;
  color: #64748b;
  font-style: italic;
  margin: 1.5rem 0;
}
</style>