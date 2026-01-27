<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { posts } from '../data/posts.js'

const route = useRoute()
// Using a ref for the post so we can mutate likes locally (won't persist on refresh without backend/store)
const post = ref(null)

onMounted(() => {
  const foundPost = posts.find(p => p.id === route.params.id)
  if (foundPost) {
    // Clone it so we don't mutate the original import directly (though typical ES module imports are read-only bindings, the object refs can be mutable)
    // But since we want reactivity, let's just use it.
    post.value = { ...foundPost } 
    // Check local storage for liked status
    const liked = localStorage.getItem(`liked_${post.value.id}`)
    if (liked) {
      hasLiked.value = true
    }
  }
})

const hasLiked = ref(false)

const formattedDate = computed(() => {
  if (!post.value) return ''
  return new Date(post.value.date).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const handleLike = () => {
    if (hasLiked.value) {
        // Optional: unlike? For now let's just say once liked, stays liked or toggle
        post.value.likes--
        hasLiked.value = false
        localStorage.removeItem(`liked_${post.value.id}`)
    } else {
        post.value.likes++
        hasLiked.value = true
        localStorage.setItem(`liked_${post.value.id}`, 'true')
    }
}
</script>

<template>
  <div v-if="post" class="post-details">
    <div class="post-header">
      <div class="header-content">
        <div class="meta">
          <span class="date">{{ formattedDate }}</span>
          <span class="type-badge">{{ post.type }}</span>
        </div>
        <h1 class="title">{{ post.title }}</h1>
        <h2 v-if="post.author" class="author">von {{ post.author }}</h2>
        
             <div v-if="post.rating" class="rating">
          <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= Math.round(post.rating) }">★</span>
        </div>
      </div>
    </div>

    <div class="post-image-container" v-if="post.coverImage">
        <img :src="post.coverImage" :alt="post.title" class="post-hero-image" />
    </div>

    <div class="content-wrapper">
      <article class="post-content" v-html="post.content"></article>
      
      <div class="engagement">
          <button 
            class="like-button" 
            :class="{ active: hasLiked }"
            @click="handleLike"
          >
              <span class="heart">♥</span> 
              <span class="count">{{ post.likes }}</span>
              <span class="label">{{ hasLiked ? 'Gefällt dir' : 'Gefällt mir' }}</span>
          </button>
      </div>
    </div>
  </div>
  <div v-else class="not-found">
    <h1>Beitrag nicht gefunden</h1>
    <router-link to="/">Zurück zur Startseite</router-link>
  </div>
</template>

<style scoped>
.post-details {
  background-color: var(--color-background);
  min-height: 100vh;
}

.post-header {
  padding: var(--spacing-xl) var(--spacing-md);
  text-align: center;
  background-color: var(--color-surface);
  border-bottom: 0px; /* Removing border to blend if we want, or keep it */
  box-shadow: 0 4px 6px -1px var(--color-shadow);
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
}

.meta {
  display: flex;
  justify-content: center;
  gap: var(--spacing-sm);
  align-items: center;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 1px;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm);
}

.type-badge {
    background-color: var(--color-background);
    padding: 2px 8px;
    border-radius: 4px;
    border: 1px solid var(--color-border);
}

.title {
  font-size: 3rem;
  margin-bottom: var(--spacing-xs);
  color: var(--color-text-primary);
}

.author {
  font-family: var(--font-body);
  font-weight: 400;
  font-style: italic;
  color: var(--color-text-secondary);
  font-size: 1.2rem;
  margin-bottom: var(--spacing-sm);
}

.rating {
  color: #d1d5db;
  font-size: 1.5rem;
}

.star.filled {
  color: #f39c12;
}

.post-image-container {
    width: 100%;
    height: 400px;
    overflow: hidden;
    position: relative;
}

.post-hero-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
}

.content-wrapper {
  max-width: 720px;
  margin: 0 auto;
  padding: var(--spacing-xl) var(--spacing-md);
}

.post-content {
  font-size: 1.125rem;
  line-height: 1.8;
  color: var(--color-text-primary);
}

.post-content :deep(p) {
  margin-bottom: var(--spacing-md);
}

.post-content :deep(h3) {
  font-size: 1.5rem;
  margin-top: var(--spacing-lg);
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-primary);
}

.post-content :deep(ul) {
  list-style: disc;
  padding-left: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
}

.post-content :deep(li) {
  margin-bottom: var(--spacing-xs);
}

.engagement {
    margin-top: var(--spacing-xl);
    padding-top: var(--spacing-md);
    border-top: 1px solid var(--color-border);
    display: flex;
    justify-content: center; /* Center the button */
}

.like-button {
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  padding: 10px 24px;
  border-radius: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  color: var(--color-text-secondary);
}

.like-button:hover {
  border-color: var(--color-accent-warm);
  transform: scale(1.05);
}

.like-button.active {
  background-color: var(--color-accent-warm);
  border-color: var(--color-accent-warm);
  color: white;
}

.heart {
  font-size: 1.3rem;
  line-height: 1;
}

.not-found {
  text-align: center;
  padding: var(--spacing-xl);
}
</style>
