/**
 * @typedef {Object} BlogPost
 * @property {string} id
 * @property {string} type
 * @property {string} title
 * @property {string} date
 * @property {string} [author]
 * @property {string} [coverImage]
 * @property {string[]} extraImages
 * @property {string} summary
 * @property {string} content
 * @property {number|null} [rating]
 */

const requiredString = (value, fieldName) => {
  const normalized = String(value ?? '').trim()
  if (!normalized) {
    throw new Error(`Post field "${fieldName}" is required.`)
  }
  return normalized
}

const optionalString = (value) => {
  if (value === undefined || value === null) return undefined
  const normalized = String(value).trim()
  return normalized || undefined
}

const normalizeDate = (value) => {
  const normalized = requiredString(value, 'date')
  const date = new Date(normalized)

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid post date: "${value}"`)
  }

  return normalized
}

const normalizeImages = (images) => {
  if (!Array.isArray(images)) return []
  return images
    .map((image) => optionalString(image))
    .filter((image) => Boolean(image))
}

const normalizeRating = (value) => {
  if (value === undefined || value === null) return null
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return null
  return Math.max(0, Math.min(5, numeric))
}

/**
 * Runtime-normalize post objects so every screen can rely on one shape.
 *
 * @param {Partial<BlogPost>} input
 * @returns {Readonly<BlogPost>}
 */
export const createPost = (input) =>
  Object.freeze({
    id: requiredString(input.id, 'id'),
    type: requiredString(input.type, 'type'),
    title: requiredString(input.title, 'title'),
    date: normalizeDate(input.date),
    author: optionalString(input.author),
    coverImage: optionalString(input.coverImage),
    extraImages: normalizeImages(input.extraImages),
    summary: requiredString(input.summary, 'summary'),
    content: requiredString(input.content, 'content'),
    rating: normalizeRating(input.rating),
  })

