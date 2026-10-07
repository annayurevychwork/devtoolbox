export const vTooltip = {
  mounted(el, binding) {
    el.setAttribute('title', binding.value)
    el.classList.add('cursor-help', 'relative')
  }
}