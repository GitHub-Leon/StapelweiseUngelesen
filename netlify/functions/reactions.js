import { connectLambda, getStore } from '@netlify/blobs'

const STORE_NAME = 'post-reactions'

const jsonResponse = (statusCode, payload) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  },
  body: JSON.stringify(payload),
})

const normalizeReaction = (value) => {
  if (value === 'like' || value === 'dislike') return value
  return 'none'
}

const isValidPostId = (value) => typeof value === 'string' && /^[A-Za-z0-9_-]{1,120}$/.test(value)

const toSafeCount = (value, fallback = 0) => {
  const numeric = Number(value)
  if (!Number.isFinite(numeric) || numeric < 0) return Math.max(0, Math.trunc(fallback))
  return Math.trunc(numeric)
}

const applyTransition = (counts, previousReaction, nextReaction) => {
  const previous = normalizeReaction(previousReaction)
  const next = normalizeReaction(nextReaction)

  let likes = toSafeCount(counts.likes, 0)
  let dislikes = toSafeCount(counts.dislikes, 0)

  if (previous === next) return { likes, dislikes }

  if (previous === 'like') likes -= 1
  if (previous === 'dislike') dislikes -= 1
  if (next === 'like') likes += 1
  if (next === 'dislike') dislikes += 1

  return {
    likes: Math.max(0, likes),
    dislikes: Math.max(0, dislikes),
  }
}

const getCountsKey = (postId) => `post:${postId}:counts`

export const handler = async (event) => {
  try {
    connectLambda(event)

    if (event.httpMethod === 'OPTIONS') {
      return jsonResponse(204, {})
    }

    const store = getStore(STORE_NAME)

    if (event.httpMethod === 'GET') {
      const postId = event.queryStringParameters?.postId
      if (!isValidPostId(postId)) {
        return jsonResponse(400, { error: 'Invalid postId.' })
      }

      const fallbackLikes = toSafeCount(event.queryStringParameters?.likes, 0)
      const fallbackDislikes = toSafeCount(event.queryStringParameters?.dislikes, 0)

      const key = getCountsKey(postId)
      const existingCounts = await store.get(key, { type: 'json' })

      const counts = {
        likes: toSafeCount(existingCounts?.likes, fallbackLikes),
        dislikes: toSafeCount(existingCounts?.dislikes, fallbackDislikes),
      }

      if (!existingCounts) {
        await store.setJSON(key, counts)
      }

      return jsonResponse(200, {
        postId,
        likes: counts.likes,
        dislikes: counts.dislikes,
      })
    }

    if (event.httpMethod === 'POST') {
      let body
      try {
        body = JSON.parse(event.body || '{}')
      } catch {
        return jsonResponse(400, { error: 'Invalid JSON body.' })
      }

      const postId = body.postId
      if (!isValidPostId(postId)) {
        return jsonResponse(400, { error: 'Invalid postId.' })
      }

      const previousReaction = normalizeReaction(body.previousReaction)
      const nextReaction = normalizeReaction(body.nextReaction)

      const fallbackLikes = toSafeCount(body.fallbackLikes, 0)
      const fallbackDislikes = toSafeCount(body.fallbackDislikes, 0)

      const key = getCountsKey(postId)
      const existingCounts = await store.get(key, { type: 'json' })
      const baseCounts = {
        likes: toSafeCount(existingCounts?.likes, fallbackLikes),
        dislikes: toSafeCount(existingCounts?.dislikes, fallbackDislikes),
      }

      const updatedCounts = applyTransition(baseCounts, previousReaction, nextReaction)

      await store.setJSON(key, updatedCounts)

      return jsonResponse(200, {
        postId,
        likes: updatedCounts.likes,
        dislikes: updatedCounts.dislikes,
        userReaction: nextReaction,
      })
    }

    return jsonResponse(405, { error: 'Method Not Allowed' })
  } catch (error) {
    console.error('Reactions function failed:', error)
    return jsonResponse(500, { error: 'Internal server error.' })
  }
}
