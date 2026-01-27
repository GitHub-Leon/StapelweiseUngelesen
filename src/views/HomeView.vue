<script setup>
import Timeline from '../components/Timeline.vue'
import { posts } from '../data/posts.js'
import backgroundImage from '@/assets/Hintergrund.png' // Using alias @ to point to src
</script>

<template>
  <main class="home-view">
    <!-- Separate div for background image to handle opacity -->
    <div class="background-image" :style="{ backgroundImage: `url(${backgroundImage})` }"></div>
    <div class="background-overlay"></div>
    
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
  position: relative;
  /* Removed direct background to allow opacity control */
}

.background-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 0;
  opacity: 0.3; /* Adjust opacity here as needed by user */
}

/* Gradient overlay */
.background-overlay {
  position: fixed; /* Fixed to match background image behavior */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(11, 15, 25, 0.4) 0%, /* Lighter top to let image show */
    rgba(11, 15, 25, 0.95) 100%
  );
  z-index: 1;
  pointer-events: none; /* Let clicks pass through if needed, though z-index handles it */
}

.hero {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: var(--spacing-xl) var(--spacing-md);
  padding-top: 100px;
}

.hero-title {
  font-family: var(--font-heading);
  font-size: 3.5rem;
  color: var(--color-accent);
  margin-bottom: var(--spacing-sm);
  text-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
}

.hero-subtitle {
  font-family: var(--font-heading);
  font-size: 1.2rem;
  color: var(--color-text-primary);
  font-style: italic;
  letter-spacing: 0.1em;
  opacity: 0.9;
}

:deep(.timeline-container) {
  position: relative;
  z-index: 2;
}
</style>
