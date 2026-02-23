<template>
  <v-app class="app-wrapper">
    <AppHeader />

    <v-main class="main-content">
      <router-view class="page-view" />
    </v-main>

    <AppFooter />
  </v-app>
</template>

<script setup>
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
</script>

<style scoped>
.app-wrapper {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", sans-serif;
  background-color: #f5f5f7;
  color: #111;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Espaciado vertical consistente */
.main-content {
  flex: 1;
  padding-top: 48px;
  padding-bottom: 64px;
}

/* Fade-in para cambio de páginas */
.page-view {
  opacity: 0;
  animation: fadeInPage 0.4s forwards;
}

@keyframes fadeInPage {
  to { opacity: 1; }
}
</style>
