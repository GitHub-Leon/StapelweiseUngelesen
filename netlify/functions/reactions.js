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

const isValidPostId = (value) => typeof value === 'string' && /^[A-Za-z0-9_-]{1,120}$/.test(value)

const toSafeCount = (value, fallback = 0) => {
  const numeric = Number(value)
  if (!Number.isFinite(numeric) || numeric < 0) return Math.max(0, Math.trunc(fallback))
  return Math.trunc(numeric)
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
      const key = getCountsKey(postId)
      const existingCounts = await store.get(key, { type: 'json' })

      const likes = toSafeCount(existingCounts?.likes, fallbackLikes)

      if (!existingCounts) {
        await store.setJSON(key, { likes })
      }

      return jsonResponse(200, {
        postId,
        likes,
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

      const previousLiked = Boolean(body.previousLiked)
      const nextLiked = Boolean(body.nextLiked)
      const fallbackLikes = toSafeCount(body.fallbackLikes, 0)

      const key = getCountsKey(postId)
      const existingCounts = await store.get(key, { type: 'json' })
      let likes = toSafeCount(existingCounts?.likes, fallbackLikes)

      if (previousLiked !== nextLiked) {
        likes += nextLiked ? 1 : -1
        likes = Math.max(0, likes)
      }

      await store.setJSON(key, { likes })

      return jsonResponse(200, {
        postId,
        likes,
        userLiked: nextLiked,
      })
    }

    return jsonResponse(405, { error: 'Method Not Allowed' })
  } catch (error) {
    console.error('Reactions function failed:', error)
    return jsonResponse(500, { error: 'Internal server error.' })
  }
}
