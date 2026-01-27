<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <header class="navbar">
    <div class="navbar-container">
      <div class="logo">
        <RouterLink to="/">Stapelweise Ungelesen</RouterLink>
      </div>
      <nav class="nav-links">
        <RouterLink to="/" class="nav-link">Startseite</RouterLink>
        <RouterLink to="/about" class="nav-link">Über mich</RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  /* Semi-transparent dark background (glassmorphism) */
  background-color: rgba(11, 15, 25, 0.85); /* Matches new dark theme */
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
  padding: var(--spacing-sm) 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 60px; /* Force consistent height */
}

@media (max-width: 768px) {
  .navbar-container {
      flex-direction: column;
      gap: 1rem;
      padding: 0.5rem var(--spacing-md); /* Reduced padding */
      min-height: auto;
  }
}

.logo a {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-accent); /* Gold logo */
  text-shadow: 0 0 10px rgba(212, 175, 55, 0.2);
}

.nav-links {
  display: flex;
  gap: var(--spacing-md);
}

.nav-link {
  font-family: var(--font-heading); /* Mystic font */
  font-size: 0.9rem;
  letter-spacing: 0.05em;
  font-weight: 700;
  color: var(--color-text-secondary);
  position: relative;
  text-transform: uppercase;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--color-text-primary);
}

.nav-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 1px;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--color-accent);
  transition: width 0.3s ease;
  box-shadow: 0 0 5px var(--color-accent);
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
  width: 100%;
}
</style>
