<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { posts } from '../data/posts.js'

const route = useRoute()

const post = ref(null)
const likesCount = ref(0)
const hasLiked = ref(false)
const isSyncingLike = ref(false)
const likeNotice = ref('')

const REACTIONS_ENDPOINT = '/api/reactions'
const LIKE_STORAGE_PREFIX = 'reaction_like_'
const LIKE_COUNT_STORAGE_PREFIX = 'reaction_likes_'

const formattedDate = computed(() => {
  if (!post.value) return ''
  return new Date(post.value.date).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

const galleryImages = computed(() => {
  if (!post.value?.extraImages) return []
  return post.value.extraImages
})

const toSafeCount = (value, fallback = 0) => {
  const numeric = Number(value)
  if (!Number.isFinite(numeric) || numeric < 0) return Math.max(0, Math.trunc(fallback))
  return Math.trunc(numeric)
}

const getLikeStorageKey = (postId) => `${LIKE_STORAGE_PREFIX}${postId}`
const getLikeCountStorageKey = (postId) => `${LIKE_COUNT_STORAGE_PREFIX}${postId}`

const readStoredLikeState = (postId) => {
  try {
    return localStorage.getItem(getLikeStorageKey(postId)) === 'true'
  } catch {
    return false
  }
}

const persistLikeState = (postId, liked) => {
  try {
    localStorage.setItem(getLikeStorageKey(postId), liked ? 'true' : 'false')
  } catch {
    // no-op
  }
}

const readStoredLikes = (postId) => {
  try {
    const raw = localStorage.getItem(getLikeCountStorageKey(postId))
    if (!raw) return null
    return toSafeCount(raw, 0)
  } catch {
    return null
  }
}

const persistLikes = (postId, likes) => {
  try {
    localStorage.setItem(getLikeCountStorageKey(postId), String(toSafeCount(likes, 0)))
  } catch {
    // no-op
  }
}

const loadPost = async () => {
  const foundPost = posts.find((entry) => entry.id === route.params.id)
  if (!foundPost) {
    post.value = null
    return
  }

  post.value = { ...foundPost }
  likeNotice.value = ''

  const baseLikes = toSafeCount(post.value.likes, 0)
  const cachedLikes = readStoredLikes(post.value.id)

  likesCount.value = cachedLikes ?? baseLikes
  hasLiked.value = readStoredLikeState(post.value.id)

  await fetchRemoteLikes()
}

const fetchRemoteLikes = async () => {
  if (!post.value) return

  const params = new URLSearchParams({
    postId: post.value.id,
    likes: String(likesCount.value),
  })

  try {
    const response = await fetch(`${REACTIONS_ENDPOINT}?${params.toString()}`)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const data = await response.json()
    likesCount.value = toSafeCount(data.likes, likesCount.value)
    persistLikes(post.value.id, likesCount.value)
  } catch (error) {
    console.warn('Could not load remote likes, using local fallback.', error)
  }
}

const syncLike = async (nextLiked) => {
  if (!post.value || isSyncingLike.value) return

  const previousLiked = hasLiked.value
  if (previousLiked === nextLiked) return

  const originalLikes = likesCount.value
  likesCount.value = Math.max(0, originalLikes + (nextLiked ? 1 : -1))
  hasLiked.value = nextLiked
  persistLikeState(post.value.id, hasLiked.value)
  persistLikes(post.value.id, likesCount.value)
  likeNotice.value = ''

  isSyncingLike.value = true

  try {
    const response = await fetch(REACTIONS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        postId: post.value.id,
        previousLiked,
        nextLiked,
        fallbackLikes: originalLikes,
      }),
    })

    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const data = await response.json()
    likesCount.value = toSafeCount(data.likes, likesCount.value)
    hasLiked.value = Boolean(data.userLiked)

    persistLikeState(post.value.id, hasLiked.value)
    persistLikes(post.value.id, likesCount.value)
  } catch (error) {
    if (!import.meta.env.DEV) {
      likeNotice.value = 'Server nicht erreichbar. Reaktion nur lokal gespeichert.'
    }
    console.warn('Could not sync like to backend.', error)
  } finally {
    isSyncingLike.value = false
  }
}

const toggleLike = () => {
  syncLike(!hasLiked.value)
}

watch(
  () => route.params.id,
  async () => {
    await loadPost()
  },
  { immediate: true },
)
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
      <article class="post-content" v-html="post.content"></article>

      <section v-if="galleryImages.length" class="post-gallery">
        <h3 class="gallery-title">Impressionen</h3>
        <div class="gallery-grid">
          <figure v-for="(image, index) in galleryImages" :key="image" class="gallery-item">
            <img :src="image" :alt="`${post.title} Bild ${index + 1}`" loading="lazy" />
          </figure>
        </div>
      </section>

      <div class="engagement">
        <div class="engagement-actions">
          <button
            class="reaction-button like"
            :class="{ active: hasLiked }"
            :disabled="isSyncingLike"
            @click="toggleLike"
          >
            <span class="reaction-icon" aria-hidden="true">&#9829;</span>
            <span class="count">{{ likesCount }}</span>
            <span class="label">{{ hasLiked ? 'Like entfernen' : 'Gefällt mir' }}</span>
          </button>
        </div>

        <p v-if="likeNotice" class="reaction-notice">{{ likeNotice }}</p>
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

.engagement {
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
}

.engagement-actions {
  display: flex;
  justify-content: center;
}

.reaction-button {
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  padding: 10px 18px;
  border-radius: 999px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  transition: all 0.25s ease;
  color: var(--color-text-secondary);
}

.reaction-button:hover:not(:disabled) {
  transform: translateY(-2px);
}

.reaction-button:disabled {
  opacity: 0.7;
  cursor: wait;
}

.reaction-button.like.active {
  background-color: var(--color-accent-warm);
  border-color: var(--color-accent-warm);
  color: white;
}

.reaction-icon {
  font-size: 1.1rem;
  line-height: 1;
}

.count {
  min-width: 1.5ch;
  font-weight: 700;
  text-align: center;
}

.reaction-notice {
  margin-top: var(--spacing-sm);
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}

.not-found {
  text-align: center;
  padding: var(--spacing-xl);
}

@media (max-width: 768px) {
  .title {
    font-size: 2.2rem;
  }

  .gallery-grid {
    grid-template-columns: 1fr;
  }
}
</style>
