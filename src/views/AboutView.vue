<script setup>
</script>

<template>
  <div class="about-container">
    <div class="profile-section">
      <div class="about-content">
        <h1>Über mich</h1>
        <p class="intro">
          Willkommen bei Stapelweise Ungelesen!
        </p>
        <p>
          Ich war schon immer von Bücherstapeln umgeben. Einige gelesen, viele warten geduldig. Dieser Blog ist meine Art, diese Reise zu dokumentieren, meine Gedanken zu den Seiten zu teilen, die mich bewegen, und dich vielleicht dazu zu ermutigen, etwas Neues in die Hand zu nehmen.
        </p>
        <p>
          Hier findest du Rezensionen, literarische Streifzüge und einen Katalog meines Leselebens.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-container {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-xl) var(--spacing-md);
}

.profile-section {
  display: flex;
  gap: var(--spacing-xl);
  align-items: flex-start;
  flex-wrap: wrap;
}

.about-content {
  flex: 1;
  min-width: 300px;
  /* Centering text if no image is present can look nice */
  text-align: center; 
}

h1 {
  font-size: 2.5rem;
  margin-bottom: var(--spacing-md);
}

p {
  font-size: 1.1rem;
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-secondary);
}

.intro {
  font-size: 1.25rem;
  color: var(--color-text-primary);
  font-weight: 500;
}
</style>
