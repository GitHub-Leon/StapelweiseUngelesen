<script setup>
import { computed } from 'vue'

const props = defineProps({
  book: {
    type: Object,
    required: true
  }
})

const formattedDate = computed(() => {
  return new Date(props.book.date).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
})
</script>

<template>
  <div class="book-card">
    <div class="card-image" v-if="book.coverImage">
       <img :src="book.coverImage" :alt="book.title + ' Cover'" loading="lazy" />
       <!-- Overlay gradient on image for text contrast if needed, or just style -->
       <div class="image-overlay"></div>
    </div>
    
    <div class="card-content">
      <div class="meta">
        <span class="date">{{ formattedDate }}</span>
        <span class="type-badge" :class="book.type">{{ book.type }}</span>
      </div>
      
      <!-- FIX: overflow-wrap added to title -->
      <h3 class="title">{{ book.title }}</h3>
      <h4 v-if="book.author" class="author">von {{ book.author }}</h4>
      
      <p class="summary">{{ book.summary }}</p>
      
      <div v-if="book.rating" class="rating">
        <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= Math.round(book.rating) }">★</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.book-card {
  background-color: var(--color-surface);
  backdrop-filter: blur(5px);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.book-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  border-color: var(--color-accent); /* Glow effect on hover */
  background-color: var(--color-surface-hover);
}

.card-image {
  height: 200px;
  overflow: hidden;
  position: relative;
  border-bottom: 1px solid var(--color-border);
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
  opacity: 0.9; /* Slightly dimmed to fit dark theme */
}

.book-card:hover .card-image img {
  transform: scale(1.05);
  opacity: 1;
}

.card-content {
  padding: var(--spacing-md);
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xs);
}

.type-badge {
  text-transform: uppercase;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  letter-spacing: 0.5px;
  border: 1px solid transparent;
}

.type-badge.rezension {
  color: #a7f3d0;
  background-color: rgba(6, 95, 70, 0.5);
  border-color: rgba(16, 185, 129, 0.2);
}

.type-badge.gedanken {
  color: #fde68a;
  background-color: rgba(146, 64, 14, 0.5);
  border-color: rgba(245, 158, 11, 0.2);
}

.title {
  font-size: 1.35rem; /* Slightly larger for Cinzel */
  margin-bottom: 0.25rem;
  color: var(--color-text-primary);
  /* FIX: Ensure long words break */
  overflow-wrap: break-word; 
  word-wrap: break-word;
  hyphens: auto;
  line-height: 1.3;
}

.author {
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 400; 
  color: var(--color-accent); /* Gold author name */
  font-style: italic;
  margin-bottom: var(--spacing-sm);
}

.summary {
  font-size: 0.95rem;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm);
  line-height: 1.6;
  flex-grow: 1;
}

.rating {
  color: #4b5563; /* Darker gray star base */
  font-size: 1.2rem;
}

.star.filled {
  color: var(--color-accent); /* Gold stars */
  text-shadow: 0 0 5px rgba(212, 175, 55, 0.4);
}
</style>
