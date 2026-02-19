# Blog posts

Each post lives in its own file in this folder.

## Add a new post

1. Create a new file (example: `my-next-book.js`).
2. Import `createPost` from `./createPost.js`.
3. Export `default createPost({ ... })`.
4. Add your file import to `index.js`.
5. Add the post object to the `allPosts` array in `index.js`.

Minimal template:

```js
import { createPost } from './createPost.js'

export default createPost({
  id: 'my-next-book',
  type: 'rezension',
  title: 'My Next Book',
  author: 'Author Name',
  date: '2026-02-19',
  coverImage: '/images/posts/my-next-book/cover.webp',
  extraImages: [],
  summary: 'Short timeline summary.',
  content: `
    <p>Full post content as HTML.</p>
  `,
  rating: 4,
})
```

