import {
  defineConfig,
  presetUno,
  presetAttributify,
  presetIcons,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
      collections: {
        lucide: () => import('@iconify-json/lucide/icons.json').then((i) => i.default),
      },
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],

  shortcuts: [
    // Layout
    ['flex-center', 'flex items-center justify-center'],
    ['flex-between', 'flex items-center justify-between'],
    ['flex-start', 'flex items-center justify-start'],
    ['flex-end', 'flex items-center justify-end'],
    ['abs-center', 'absolute inset-0 flex items-center justify-center'],

    // Typography
    ['text-primary', 'text-[var(--color-text-primary)]'],
    ['text-secondary', 'text-[var(--color-text-secondary)]'],
    ['text-tertiary', 'text-[var(--color-text-tertiary)]'],
    ['text-disabled', 'text-[var(--color-text-disabled)]'],

    // Containers
    ['card', 'bg-[var(--color-bg-container)] rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] p-4'],
    ['page-container', 'p-6 h-full overflow-auto'],
  ],

  theme: {
    colors: {
      primary: 'var(--primary-color)',
      'primary-hover': 'var(--primary-hover)',
      'primary-active': 'var(--primary-active)',
      success: 'var(--success-color)',
      warning: 'var(--warning-color)',
      error: 'var(--error-color)',
    },
    animation: {
      'fade-in': 'fadeIn 0.2s ease',
      'slide-up': 'slideUp 0.3s ease',
    },
    keyframes: {
      fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
      slideUp: { from: { opacity: '0', transform: 'translateY(10px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
    },
  },

  // safelist ensures certain classes are always included
  safelist: [
    'i-lucide-layout-dashboard',
    'i-lucide-settings',
    'i-lucide-users',
    'i-lucide-shield',
    'i-lucide-menu',
    'i-lucide-sun',
    'i-lucide-moon',
  ],
})
