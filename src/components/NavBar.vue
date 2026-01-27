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
  background-color: var(--color-background);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
  padding: var(--spacing-sm) 0;
  box-shadow: 0 2px 4px var(--color-shadow);
}

.navbar-container {
  max-width: 1200px; /* Or a variable if defined */
  margin: 0 auto;
  padding: 0 var(--spacing-md);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo a {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.nav-links {
  display: flex;
  gap: var(--spacing-md);
}

.nav-link {
  font-family: var(--font-body);
  font-weight: 500;
  color: var(--color-text-secondary);
  position: relative;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--color-accent);
}

.nav-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -4px;
  left: 0;
  background-color: var(--color-accent);
  transition: width 0.3s ease;
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
  width: 100%;
}
</style>
