import type { Directive } from 'vue'

// v-loading="isLoading"
export const vLoading: Directive<HTMLElement, boolean> = {
  mounted(el, binding) {
    if (binding.value) showLoading(el)
  },
  updated(el, binding) {
    if (binding.value !== binding.oldValue) {
      binding.value ? showLoading(el) : hideLoading(el)
    }
  },
  unmounted(el) {
    hideLoading(el)
  },
}

function showLoading(el: HTMLElement) {
  const existing = el.querySelector('.v-loading-mask')
  if (existing) return

  el.style.position = 'relative'
  const mask = document.createElement('div')
  mask.className = 'v-loading-mask'
  mask.innerHTML = `
    <div class="v-loading-spinner">
      <svg viewBox="0 0 50 50">
        <circle cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
      </svg>
    </div>
  `
  el.appendChild(mask)
}

function hideLoading(el: HTMLElement) {
  const mask = el.querySelector('.v-loading-mask')
  if (mask) mask.remove()
}
