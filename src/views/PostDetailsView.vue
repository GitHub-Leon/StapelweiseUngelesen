<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getPostById } from '../data/posts/index.js'
import { useMouseSpotlight } from '../composables/useMouseSpotlight.js'

const route = useRoute()
const { spotlightStyle, onSpotlightMove, onSpotlightLeave } = useMouseSpotlight()

const post = computed(() => getPostById(String(route.params.id ?? '')))

const formattedDate = computed(() => {
  if (!post.value) return ''
  return new Date(post.value.date).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

const galleryImages = computed(() => post.value?.extraImages ?? [])
const floatingImages = computed(() => galleryImages.value.slice(0, 2))
</script>

<template>
  <div
    v-if="post"
    class="post-details spotlight-host"
    :style="spotlightStyle"
    @pointermove="onSpotlightMove"
    @pointerleave="onSpotlightLeave"
  >
    <div class="mouse-spotlight" aria-hidden="true"></div>

    <div class="post-header">
      <div class="header-content">
        <div class="meta">
          <span class="date">{{ formattedDate }}</span>
          <span class="type-badge">{{ post.type }}</span>
        </div>
        <h1 class="title">{{ post.title }}</h1>
        <h2 v-if="post.author" class="author">von {{ post.author }}</h2>

        <div v-if="post.rating" class="rating" aria-label="Bewertung">
          <span
            v-for="n in 5"
            :key="n"
            class="star"
            :class="{ filled: n <= Math.round(post.rating) }"
            >&#9733;</span
          >
        </div>
      </div>
    </div>

    <div class="post-image-container" v-if="post.coverImage">
      <img :src="post.coverImage" :alt="`${post.title} Cover`" class="post-hero-image" />
    </div>

    <div class="content-wrapper">
      <aside v-if="floatingImages.length" class="floating-visuals" aria-hidden="true">
        <figure
          v-for="(image, index) in floatingImages"
          :key="`floating-${index}-${image}`"
          class="floating-card"
          :class="`card-${index}`"
        >
          <img :src="image" :alt="''" loading="lazy" />
        </figure>
      </aside>

      <article class="post-content" v-html="post.content"></article>

      <section v-if="galleryImages.length" class="post-gallery mobile-gallery">
        <h3 class="gallery-title">Impressionen</h3>
        <div class="gallery-grid">
          <figure v-for="(image, index) in galleryImages" :key="image" class="gallery-item">
            <img :src="image" :alt="`${post.title} Bild ${index + 1}`" loading="lazy" />
          </figure>
        </div>
      </section>
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

.spotlight-host {
  position: relative;
  isolation: isolate;
  overflow-x: clip;
}

.mouse-spotlight {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: calc(var(--spotlight-opacity, 0) * 0.58);
  background: radial-gradient(
    260px circle at var(--spotlight-x, 50%) var(--spotlight-y, 35%),
    rgba(255, 255, 255, 0.065),
    rgba(255, 255, 255, 0.02) 35%,
    transparent 70%
  );
  transition: opacity 180ms ease;
}

.post-header,
.post-image-container,
.floating-visuals,
.content-wrapper {
  position: relative;
  z-index: 1;
}

.post-header {
  padding: var(--spacing-xl) var(--spacing-md);
  text-align: center;
  background-color: var(--color-surface);
  border-bottom: 0;
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

.floating-visuals {
  display: none;
}

.post-gallery {
  margin-top: var(--spacing-lg);
}

.gallery-title {
  margin-bottom: var(--spacing-sm);
  font-size: 1.4rem;
  color: var(--color-text-primary);
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--spacing-sm);
}

.gallery-item {
  margin: 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  overflow: hidden;
  background-color: var(--color-surface);
}

.gallery-item img {
  width: 100%;
  height: 100%;
  max-height: 320px;
  object-fit: cover;
  display: block;
}

.not-found {
  text-align: center;
  padding: var(--spacing-xl);
}

@media (min-width: 1280px) {
  .floating-visuals {
    display: block;
    position: absolute;
    inset: 0;
    z-index: 2;
    pointer-events: none;
  }

  .floating-card {
    position: absolute;
    width: min(17vw, 15rem);
    aspect-ratio: 4 / 5;
    border-radius: 1.2rem;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.22);
    background: rgba(18, 24, 36, 0.55);
    backdrop-filter: blur(8px) saturate(1.1);
    box-shadow:
      0 26px 60px rgba(0, 0, 0, 0.45),
      0 0 0 1px rgba(255, 255, 255, 0.08) inset;
  }

  .floating-card::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      170deg,
      rgba(255, 255, 255, 0.18),
      transparent 35%,
      rgba(0, 0, 0, 0.24)
    );
  }

  .floating-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: saturate(1.08) contrast(1.02);
  }

  .floating-card.card-0 {
    top: clamp(3rem, 5vw, 4.5rem);
    right: calc(100% + clamp(1rem, 2.4vw, 2rem));
    transform: rotate(-6deg);
  }

  .floating-card.card-1 {
    bottom: clamp(4rem, 7vw, 6.5rem);
    left: calc(100% + clamp(1rem, 2.4vw, 2rem));
    transform: rotate(6deg);
  }

  .mobile-gallery {
    display: none;
  }
}

@media (max-width: 768px) {
  .title {
    font-size: 2.2rem;
  }

  .gallery-grid {
    grid-template-columns: 1fr;
  }

  .mouse-spotlight {
    display: none;
  }
}
</style>
