<template>
  <div
    class="hero"
    :style="{ backgroundImage: `url(${heroImage})` }"
  >
    <div class="hero-overlay">
      <h1>Mi Sitio Cultural</h1>
      <p>Bienvenido al nuevo diseño minimalista.</p>
    </div>
  </div>
</template>

<script setup>
// Importa la imagen directamente
import heroImage from '@/assets/sitioGranada.jpg'
</script>

<style scoped>
.hero {
  height: 220px; /* altura base */
  background-size: cover;
  background-position: center;
  border-radius: 18px;
  overflow: hidden;
  position: relative;
  transition: height 0.3s ease;
}

/* Overlay */
.hero-overlay {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 24px;
  background: linear-gradient(to top, rgba(0,0,0,0.55), transparent);
  color: white;
  transition: padding 0.3s ease;
}

.hero-overlay h1 {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 8px;
}

.hero-overlay p {
  font-size: 16px;
  margin: 0;
}

/* --- Responsive --- */
@media (max-width: 960px) {
  .hero {
    height: 180px;
  }
  .hero-overlay {
    padding: 16px;
  }
  .hero-overlay h1 {
    font-size: 28px;
  }
  .hero-overlay p {
    font-size: 14px;
  }
}

@media (max-width: 640px) {
  .hero {
    height: 140px;
    border-radius: 12px;
  }
  .hero-overlay {
    padding: 12px;
  }
  .hero-overlay h1 {
    font-size: 22px;
  }
  .hero-overlay p {
    font-size: 12px;
  }
}
</style>
