<script setup>
import Timeline from '../components/Timeline.vue'
import { posts } from '../data/posts.js'
</script>

<template>
  <main class="home-view">
    <div class="hero">
      <h1 class="hero-title">Stapelweise Ungelesen</h1>
      <p class="hero-subtitle">Welten entdecken, Seite für Seite.</p>
    </div>
    
    <Timeline :posts="posts" />
  </main>
</template>

<style scoped>
.home-view {
  min-height: 100vh;
}

.hero {
  text-align: center;
  padding: var(--spacing-xl) var(--spacing-md);
  background-color: var(--color-background);
}

.hero-title {
  font-family: var(--font-heading);
  font-size: 3rem;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.hero-subtitle {
  font-family: var(--font-body);
  font-size: 1.2rem;
  color: var(--color-text-secondary);
  font-style: italic;
}
</style>
