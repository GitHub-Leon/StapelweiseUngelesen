<script setup>
</script>

<template>
  <div class="about-container">
    <div class="profile-section">
      <div class="about-content">
        <h1>Willkommen bei Stapelweise Ungelesen!</h1>
        <p class="intro">
          Ich liebe Bücher - schon immer. Aber: Zwischen Alltag und dem endlosen Scrollen auf Social Media ist es manchmal verdammt schwer, am Ball zu bleiben.
        </p>
        <p>
          Dieser Blog ist mein persönliches Projekt, um mehr zu lesen. Er ist meine Motivation, wieder tiefer in Geschichten einzutauchen egal, ob es ein Klassiker oder Romantasy ist.
        </p>
        <p class="section-title">
          Was dich hier erwartet:
        </p>
        <p>
          <strong>Ehrliche Gedanken:</strong> Ich schreibe über das, was mich bewegt ohne Filter, einfach aus Spaß.
        </p>
        <p>
          <strong>Visuelle Welten:</strong> Da ich es liebe, mit KI-Tools zu experimentieren, erstelle ich zu meinen gelesenen Büchern eigene Bilder. So werden die Welten aus meinem Kopf direkt für dich sichtbar.
        </p>
        <p>
          Schön, dass du da bist. Lass uns gemeinsam den Stapel kleiner machen!
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

.section-title {
  font-size: 1.2rem;
  color: var(--color-text-primary);
  font-weight: 600;
  margin-top: var(--spacing-md);
}
</style>
