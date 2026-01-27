<script setup>
import { computed } from 'vue'

const props = defineProps({
  book: {
    type: Object,
    required: true
  }
})

// Example helper to format date
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
       <!-- In a real app, use optimized images. Using background-image for easy covering -->
       <img :src="book.coverImage" :alt="book.title + ' Cover'" loading="lazy" />
    </div>
    
    <div class="card-content">
      <div class="meta">
        <span class="date">{{ formattedDate }}</span>
        <span class="type-badge" :class="book.type">{{ book.type }}</span>
      </div>
      
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
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.book-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px var(--color-shadow);
  border-color: var(--color-accent);
}

.card-image {
  height: 200px;
  overflow: hidden;
  position: relative;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.book-card:hover .card-image img {
  transform: scale(1.05);
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
}

.type-badge.review {
  background-color: #e8f6f3;
  color: #16a085;
}

.type-badge.thought {
  background-color: #fef9e7;
  color: #f1c40f;
}

.title {
  font-size: 1.25rem;
  margin-bottom: 0.25rem;
  color: var(--color-text-primary);
}

.author {
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 400; /* Regular weight for author */
  color: var(--color-text-secondary);
  font-style: italic;
  margin-bottom: var(--spacing-sm);
}

.summary {
  font-size: 0.95rem;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm);
  line-height: 1.5;
  flex-grow: 1; /* Pushes content down */
}

.rating {
  color: #d1d5db; /* Gray star base */
  font-size: 1.2rem;
}

.star.filled {
  color: #f39c12; /* Gold for filled stars */
}
</style>
