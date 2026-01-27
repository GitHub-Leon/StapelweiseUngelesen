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
    <!-- The dot on the timeline -->
    <div class="timeline-dot"></div>
    
    <!-- The content (card) -->
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
  padding: 0 var(--spacing-lg); /* Space from center line */
}

/* Left side alignment */
.timeline-item-wrapper.left {
  align-self: flex-start;
  justify-content: flex-end; /* Content pushes against center */
  text-align: right;
  /* Since width is 50%, left defaults to left side of container */
}

/* Right side alignment */
.timeline-item-wrapper.right {
  align-self: flex-end;
  justify-content: flex-start;
  margin-left: 50%; /* Push to right half */
  text-align: left;
}

.item-content {
  width: 100%;
  max-width: 400px;
  text-decoration: none; /* Remove link underline */
  color: inherit;
  display: block; /* Important for component inside */
}

/* The Dot */
.timeline-dot {
  position: absolute;
  top: 20px; /* Adjust based on card visual center roughly or top align */
  width: 16px;
  height: 16px;
  background-color: var(--color-background);
  border: 3px solid var(--color-text-secondary);
  border-radius: 50%;
  z-index: 2;
}

/* Positioning the dot */
.timeline-item-wrapper.left .timeline-dot {
  right: -8px; /* Half of width (16/2 = 8) to center on line */
}

.timeline-item-wrapper.right .timeline-dot {
  left: -8px;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .timeline-item-wrapper {
    width: 100%;
    margin-left: 0 !important; /* Reset potential right margin */
    padding-left: 50px; /* Make space for line on left */
    padding-right: 0;
    align-self: flex-start;
    justify-content: flex-start;
    text-align: left;
  }
  
  .timeline-dot {
    left: 12px !important; /* Align with new line position */
    right: auto !important; 
  }
}
</style>
