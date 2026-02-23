<template>
  <PageLayout>
    <div class="page-header">
      <h1 class="page-title">Páginas</h1>
      <p class="page-subtitle">
        Explora las diferentes secciones y contenidos de nuestro archivo cultural.
      </p>
    </div>

    <div class="page-content">
      <slot />
    </div>
  </PageLayout>
</template>

<script setup>
import PageLayout from "@/components/PageLayout.vue"
</script>

<style scoped>
.page-header {
  max-width: 720px;
  margin: 0 auto 48px auto;
  text-align: center;
}

.page-title {
  font-size: 44px;
  font-weight: 600;
  letter-spacing: -0.5px;
  color: #111;
  margin-bottom: 16px;
}

.page-subtitle {
  font-size: 18px;
  color: #6e6e73;
  line-height: 1.7;
}

/* Contenido general */
.page-content {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 24px;
}
</style>
