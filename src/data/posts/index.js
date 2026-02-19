import burningCrown from './burning-crown.js'

const allPosts = [burningCrown]

export const posts = Object.freeze(
  [...allPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
)

export const postsById = Object.freeze(
  Object.fromEntries(posts.map((post) => [post.id, post])),
)

export const getPostById = (id) => postsById[id] ?? null

