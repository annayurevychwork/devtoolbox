import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { marked } from 'marked'
import mermaid from 'mermaid'

export function useMarkdown(storageKey = 'markdown_draft') {
  const rawText = ref('')

  onMounted(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) rawText.value = saved
    mermaid.initialize({ startOnLoad: false, theme: 'default' })
  })

  watch(rawText, (newText) => {
    localStorage.setItem(storageKey, newText)
  })

  const htmlText = computed(() => {
    const renderer = new marked.Renderer()
    renderer.code = (code, language) => {
      if (language === 'mermaid') return `<div class="mermaid">${code}</div>`
      return `<pre><code>${code}</code></pre>`
    }
    return marked(rawText.value, { renderer })
  })

  const renderMermaid = async () => {
    await nextTick()
    try { await mermaid.run({ querySelector: '.mermaid' }) } catch (e) {}
  }

  return { rawText, htmlText, renderMermaid }
}