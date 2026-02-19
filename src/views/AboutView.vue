<script setup></script>

<template>
  <section class="about-container" aria-labelledby="about-title">
    <article class="about-content">
      <h1 id="about-title">Willkommen bei Stapelweise Ungelesen!</h1>

      <p>
        Ich liebe Bücher - schon immer. Aber: Zwischen Alltag und dem endlosen Scrollen auf Social
        Media ist es manchmal verdammt schwer, am Ball zu bleiben.
      </p>

      <p>
        Dieser Blog ist mein persönliches Projekt, um mehr zu lesen. Er ist meine Motivation, wieder
        tiefer in Geschichten einzutauchen - egal, ob es ein Klassiker oder Romantasy ist.
      </p>

      <h2>Was dich hier erwartet</h2>

      <ul class="expectations">
        <li>
          <strong>Ehrliche Gedanken:</strong> Ich schreibe über das, was mich bewegt - ohne Filter,
          einfach aus Spaß.
        </li>
        <li>
          <strong>Visuelle Welten:</strong> Da ich es liebe, mit KI-Tools zu experimentieren,
          erstelle ich zu meinen gelesenen Büchern eigene Bilder. So werden die Welten aus meinem
          Kopf direkt für dich sichtbar.
        </li>
      </ul>

      <p class="outro">Schön, dass du da bist. Lass uns gemeinsam den Stapel kleiner machen!</p>
    </article>
  </section>
</template>

<style scoped>
.about-container {
  width: min(72rem, 100%);
  margin-inline: auto;
  padding: clamp(2rem, 4vw, 4rem) clamp(1rem, 3vw, 2rem);
}

.about-content {
  max-width: 66ch;
  margin-inline: auto;
  text-align: left;
}

h1 {
  font-size: clamp(1.65rem, 3vw, 2.5rem);
  line-height: 1.15;
  letter-spacing: -0.015em;
  margin: 0 0 1.25rem;
  text-wrap: balance;
}

h2 {
  font-size: clamp(1.35rem, 2.4vw, 1.85rem);
  line-height: 1.25;
  margin: clamp(2rem, 4vw, 2.8rem) 0 1rem;
  text-wrap: balance;
}

p,
li {
  font-size: clamp(1.02rem, 1.2vw, 1.15rem);
  line-height: 1.72;
  color: var(--color-text-primary);
}

p {
  margin: 0 0 1rem;
}

.expectations {
  margin: 0;
  padding-left: 1.35rem;
}

.expectations li {
  margin-bottom: 0.9rem;
}

.outro {
  margin-top: 1.5rem;
  font-weight: 600;
}

@media (max-width: 768px) {
  .about-content {
    max-width: 62ch;
  }
}
</style>
