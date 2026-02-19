<script setup>
import { computed } from 'vue'
import TimelineItem from './TimelineItem.vue'

const props = defineProps({
  posts: {
    type: Array,
    required: true
  }
})

const groupedPosts = computed(() => {
  const groups = []
  const groupsByKey = new Map()

  props.posts.forEach((post) => {
    const date = new Date(post.date)
    const key = `${date.getFullYear()}-${date.getMonth()}`

    if (!groupsByKey.has(key)) {
      const group = {
        label: date.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' }),
        posts: [],
      }
      groupsByKey.set(key, group)
      groups.push(group)
    }

    groupsByKey.get(key).posts.push(post)
  })

  return groups
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
  margin: 0 auto;
  padding: var(--spacing-lg) var(--spacing-md);
}

.timeline-line {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  /* Gold/Mystic Gradient Line */
  background: linear-gradient(to bottom, transparent, var(--color-accent), transparent);
  transform: translateX(-50%);
  z-index: 0;
  opacity: 0.5;
}

.timeline-group {
  position: relative;
  margin-bottom: var(--spacing-xl);
  z-index: 1; 
}

.month-marker {
  display: inline-block;
  background-color: var(--color-background); /* Matches bg to cover line behind it effectively if needed */
  border: 1px solid var(--color-accent);
  color: var(--color-accent);
  padding: 6px 20px;
  border-radius: 4px; /* More angular/parchment like */
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 1.2rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  
  position: relative; 
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: var(--spacing-lg);
  
  box-shadow: 0 0 10px rgba(212, 175, 55, 0.2);
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

@media (max-width: 768px) {
  .timeline-line {
    left: 20px;
    transform: none;
  }
  
  .month-marker {
    left: 20px;
    transform: none;
    margin-left: 20px;
  }
}
</style>
