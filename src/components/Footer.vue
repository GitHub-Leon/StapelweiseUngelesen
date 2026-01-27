<script setup>
</script>

<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="social-links">
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="social-link">
          Instagram
        </a>
        <span class="divider">•</span>
        <a href="https://reddit.com" target="_blank" rel="noopener noreferrer" class="social-link">
          Reddit
        </a>
      </div>
      <p class="copyright">
        © {{ new Date().getFullYear() }} Stapelweise Ungelesen. Alle Rechte vorbehalten.
      </p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: auto; /* Pushes to bottom if flex container */
  background-color: var(--color-surface);
  border-top: 1px solid var(--color-border);
  padding: var(--spacing-lg) 0;
  text-align: center;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
}

.social-links {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
}

.social-link {
  font-weight: 600;
  color: var(--color-text-primary);
  /* Typically you'd use icons here, but text for now as per minimal requirement or use SVGs */
}

.social-link:hover {
  color: var(--color-accent);
}

.divider {
  color: var(--color-text-secondary);
}

.copyright {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}
</style>
