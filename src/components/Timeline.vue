<script setup>
import { computed } from 'vue'
import TimelineItem from './TimelineItem.vue'

const props = defineProps({
  posts: {
    type: Array,
    required: true
  }
})

// Group posts by Year-Month
const groupedPosts = computed(() => {
  const groups = {}
  
  // Sort by date descending first just in case
  const sorted = [...props.posts].sort((a, b) => new Date(b.date) - new Date(a.date))

  sorted.forEach(post => {
    const date = new Date(post.date)
    const key = `${date.getFullYear()}-${date.getMonth()}` // e.g. "2023-9" (October is 9)
    
    if (!groups[key]) {
      groups[key] = {
        label: date.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' }),
        posts: []
      }
    }
    groups[key].posts.push(post)
  })

  // Return as array for easy iteration (since object keys might not be ordered)
  // We want newest first, which we likely preserved if we iterate consistently,
  // but let's be safe and map the known keys from our sorted list logic or just Object.values
  // Since we sorted input, insertion order into object usually preserves key order in modern JS for strings...
  // but safer to rebuild:
  return Object.values(groups)
})
</script>

<template>
  <div class="timeline-container">
    <div class="timeline-line"></div>
    
    <div v-for="(group, gIndex) in groupedPosts" :key="gIndex" class="timeline-group">
      <div class="month-marker">{{ group.label }}</div>
      
      <div class="items-list">
        <TimelineItem 
          v-for="(post, index) in group.posts" 
          :key="post.id" 
          :post="post" 
          :side="index % 2 === 0 ? 'left' : 'right'" 
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.timeline-container {
  position: relative;
  max-width: 1000px;
  margin: 0 auto; /* Centered */
  padding: var(--spacing-lg) var(--spacing-md);
}

/* The vertical line */
.timeline-line {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: var(--color-border);
  transform: translateX(-50%);
  z-index: 0;
}

.timeline-group {
  position: relative;
  margin-bottom: var(--spacing-xl);
  z-index: 1; /* Above line */
}

/* Month marker on the line */
.month-marker {
  display: inline-block;
  background-color: var(--color-background);
  border: 2px solid var(--color-accent);
  color: var(--color-accent);
  padding: 4px 16px;
  border-radius: 20px;
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 1.1rem;
  
  /* Centering */
  position: relative; /* In flow of group, but let's just margin auto it */
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: var(--spacing-lg);
  
  /* Visual tweaks */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .timeline-line {
    left: 20px; /* Shift line to left */
    transform: none;
  }
  
  .month-marker {
    left: 20px;
    transform: none; /* Align to left too, or keep centered? Left is better for vertical flow */
    margin-left: 20px; /* Offset from line */
  }
}
</style>
