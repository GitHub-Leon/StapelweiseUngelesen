import { computed, ref } from 'vue'

export function useMouseSpotlight() {
  const x = ref('50%')
  const y = ref('35%')
  const active = ref(false)

  const isFinePointer = () => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return false
    }
    return window.matchMedia('(pointer: fine)').matches
  }

  const onSpotlightMove = (event) => {
    if (!isFinePointer()) {
      active.value = false
      return
    }

    const target = event.currentTarget
    if (!target || typeof target.getBoundingClientRect !== 'function') {
      return
    }

    const rect = target.getBoundingClientRect()
    x.value = `${(event.clientX - rect.left).toFixed(1)}px`
    y.value = `${(event.clientY - rect.top).toFixed(1)}px`
    active.value = true
  }

  const onSpotlightLeave = () => {
    active.value = false
  }

  const spotlightStyle = computed(() => ({
    '--spotlight-x': x.value,
    '--spotlight-y': y.value,
    '--spotlight-opacity': active.value ? '1' : '0',
  }))

  return {
    spotlightStyle,
    onSpotlightMove,
    onSpotlightLeave,
  }
}
