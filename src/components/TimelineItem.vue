<script setup>
import { RouterLink } from 'vue-router'
import BookCard from './BookCard.vue'

const props = defineProps({
  post: {
    type: Object,
    required: true
  },
  side: {
    type: String,
    default: 'left' // 'left' or 'right'
  }
})
</script>

<template>
  <div class="timeline-item-wrapper" :class="side">
    <div class="timeline-dot"></div>
    
    <RouterLink :to="{ name: 'post', params: { id: post.id } }" class="item-content">
      <BookCard :book="post" />
    </RouterLink>
  </div>
</template>

<style scoped>
.timeline-item-wrapper {
  display: flex;
  position: relative;
  width: 50%;
  padding: 0 var(--spacing-lg); 
}

.timeline-item-wrapper.left {
  align-self: flex-start;
  justify-content: flex-end; 
  text-align: right;
}

.timeline-item-wrapper.right {
  align-self: flex-end;
  justify-content: flex-start;
  margin-left: 50%; 
  text-align: left;
}

.item-content {
  width: 100%;
  max-width: 400px;
  text-decoration: none; 
  color: inherit;
  display: block; 
}

.timeline-dot {
  position: absolute;
  top: 20px; 
  width: 12px;
  height: 12px;
  background-color: var(--color-background);
  border: 2px solid var(--color-accent); /* Gold border */
  box-shadow: 0 0 10px var(--color-accent); /* Glowing dot */
  transform: rotate(45deg); /* Diamond shape for fantasy feel */
  z-index: 2;
}

.timeline-item-wrapper.left .timeline-dot {
  right: -6px; /* Half of 12 */
}

.timeline-item-wrapper.right .timeline-dot {
  left: -6px;
}

@media (max-width: 768px) {
  .timeline-item-wrapper {
    width: 100%;
    margin-left: 0 !important; 
    padding-left: 50px; 
    padding-right: 0;
    align-self: flex-start;
    justify-content: flex-start;
    text-align: left;
  }
  
  .timeline-dot {
    left: 14px !important; 
    right: auto !important; 
  }
}
</style>
