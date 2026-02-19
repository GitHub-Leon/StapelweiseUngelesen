<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { posts } from '../data/posts.js'

const route = useRoute()

const post = ref(null)
const reactionCounts = ref({ likes: 0, dislikes: 0 })
const userReaction = ref('none')
const isSyncingReaction = ref(false)
const reactionNotice = ref('')

const REACTIONS_ENDPOINT = '/api/reactions'
const REACTION_STORAGE_PREFIX = 'reaction_vote_'
const COUNTS_STORAGE_PREFIX = 'reaction_counts_'

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

const isLiked = computed(() => userReaction.value === 'like')
const isDisliked = computed(() => userReaction.value === 'dislike')

const normalizeReaction = (value) => {
  if (value === 'like' || value === 'dislike') return value
  return 'none'
}

const toSafeCount = (value, fallback = 0) => {
  const numeric = Number(value)
  if (!Number.isFinite(numeric) || numeric < 0) return Math.max(0, Math.trunc(fallback))
  return Math.trunc(numeric)
}

const getBaseCounts = () => ({
  likes: toSafeCount(post.value?.likes, 0),
  dislikes: toSafeCount(post.value?.dislikes, 0),
})

const getReactionStorageKey = (postId) => `${REACTION_STORAGE_PREFIX}${postId}`
const getCountsStorageKey = (postId) => `${COUNTS_STORAGE_PREFIX}${postId}`

const readStoredReaction = (postId) => {
  try {
    return normalizeReaction(localStorage.getItem(getReactionStorageKey(postId)))
  } catch {
    return 'none'
  }
}

const persistStoredReaction = (postId, reaction) => {
  try {
    localStorage.setItem(getReactionStorageKey(postId), normalizeReaction(reaction))
  } catch {
    // no-op
  }
}

const readStoredCounts = (postId) => {
  try {
    const raw = localStorage.getItem(getCountsStorageKey(postId))
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return {
      likes: toSafeCount(parsed.likes, 0),
      dislikes: toSafeCount(parsed.dislikes, 0),
    }
  } catch {
    return null
  }
}

const persistStoredCounts = (postId, counts) => {
  try {
    localStorage.setItem(
      getCountsStorageKey(postId),
      JSON.stringify({
        likes: toSafeCount(counts.likes, 0),
        dislikes: toSafeCount(counts.dislikes, 0),
      }),
    )
  } catch {
    // no-op
  }
}

const setReactionCounts = (likes, dislikes) => {
  reactionCounts.value = {
    likes: toSafeCount(likes, 0),
    dislikes: toSafeCount(dislikes, 0),
  }
}

const applyTransition = (counts, previousReaction, nextReaction) => {
  let likes = toSafeCount(counts.likes, 0)
  let dislikes = toSafeCount(counts.dislikes, 0)

  const previous = normalizeReaction(previousReaction)
  const next = normalizeReaction(nextReaction)

  if (previous === next) {
    return { likes, dislikes }
  }

  if (previous === 'like') likes -= 1
  if (previous === 'dislike') dislikes -= 1
  if (next === 'like') likes += 1
  if (next === 'dislike') dislikes += 1

  return {
    likes: Math.max(0, likes),
    dislikes: Math.max(0, dislikes),
  }
}

const loadPost = async () => {
  const foundPost = posts.find((entry) => entry.id === route.params.id)
  if (!foundPost) {
    post.value = null
    return
  }

  post.value = { ...foundPost }
  reactionNotice.value = ''

  const baseCounts = getBaseCounts()
  const cachedCounts = readStoredCounts(post.value.id)
  const initialCounts = cachedCounts ?? baseCounts

  setReactionCounts(initialCounts.likes, initialCounts.dislikes)
  userReaction.value = readStoredReaction(post.value.id)

  await fetchRemoteCounts()
}

const fetchRemoteCounts = async () => {
  if (!post.value) return

  const params = new URLSearchParams({
    postId: post.value.id,
    likes: String(reactionCounts.value.likes),
    dislikes: String(reactionCounts.value.dislikes),
  })

  try {
    const response = await fetch(`${REACTIONS_ENDPOINT}?${params.toString()}`)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const data = await response.json()
    setReactionCounts(data.likes, data.dislikes)
    persistStoredCounts(post.value.id, reactionCounts.value)
  } catch (error) {
    // Local fallback remains active when function endpoint is unavailable.
    console.warn('Could not load remote reactions, using local fallback.', error)
  }
}

const syncReaction = async (nextReaction) => {
  if (!post.value || isSyncingReaction.value) return

  const next = normalizeReaction(nextReaction)
  const previous = userReaction.value

  if (previous === next) return

  const originalCounts = { ...reactionCounts.value }
  const optimisticCounts = applyTransition(originalCounts, previous, next)

  setReactionCounts(optimisticCounts.likes, optimisticCounts.dislikes)
  userReaction.value = next
  persistStoredReaction(post.value.id, userReaction.value)
  persistStoredCounts(post.value.id, reactionCounts.value)
  reactionNotice.value = ''

  isSyncingReaction.value = true

  try {
    const response = await fetch(REACTIONS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        postId: post.value.id,
        previousReaction: previous,
        nextReaction: next,
        fallbackLikes: originalCounts.likes,
        fallbackDislikes: originalCounts.dislikes,
      }),
    })

    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const data = await response.json()
    setReactionCounts(data.likes, data.dislikes)
    userReaction.value = normalizeReaction(data.userReaction)

    persistStoredReaction(post.value.id, userReaction.value)
    persistStoredCounts(post.value.id, reactionCounts.value)
  } catch (error) {
    // Keep optimistic local state, but inform user persistence is local-only.
    if (!import.meta.env.DEV) {
      reactionNotice.value = 'Server nicht erreichbar. Reaktion nur lokal gespeichert.'
    }
    console.warn('Could not sync reaction to backend.', error)
  } finally {
    isSyncingReaction.value = false
  }
}

const toggleLike = () => {
  const next = isLiked.value ? 'none' : 'like'
  syncReaction(next)
}

const toggleDislike = () => {
  const next = isDisliked.value ? 'none' : 'dislike'
  syncReaction(next)
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
            :class="{ active: isLiked }"
            :disabled="isSyncingReaction"
            @click="toggleLike"
          >
            <span class="reaction-icon" aria-hidden="true">&#9829;</span>
            <span class="count">{{ reactionCounts.likes }}</span>
            <span class="label">{{ isLiked ? 'Like entfernen' : 'Gefaellt mir' }}</span>
          </button>

          <button
            class="reaction-button dislike"
            :class="{ active: isDisliked }"
            :disabled="isSyncingReaction"
            @click="toggleDislike"
          >
            <span class="reaction-icon" aria-hidden="true">&#128078;</span>
            <span class="count">{{ reactionCounts.dislikes }}</span>
            <span class="label">{{ isDisliked ? 'Dislike entfernen' : 'Gefaellt mir nicht' }}</span>
          </button>
        </div>

        <p v-if="reactionNotice" class="reaction-notice">{{ reactionNotice }}</p>
      </div>
    </div>
  </div>

  <div v-else class="not-found">
    <h1>Beitrag nicht gefunden</h1>
    <router-link to="/">Zurueck zur Startseite</router-link>
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

.post-content :deep(ul) {
  list-style: disc;
  padding-left: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
}

.post-content :deep(li) {
  margin-bottom: var(--spacing-xs);
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
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--spacing-sm);
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

.reaction-button.dislike.active {
  background-color: #7f1d1d;
  border-color: #7f1d1d;
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
