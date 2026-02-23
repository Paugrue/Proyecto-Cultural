<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Hero from '@/components/Hero.vue'
import SearchBar from '@/components/SearchBar.vue'

/* Props opcionales para inyectar opciones al SearchBar desde páginas concretas */
const props = defineProps({
  fields: { type: Array, default: () => [] },
  collections: { type: Array, default: () => [] },
  advancedDefaults: {
    type: Object,
    default: () => ({
      scope: 'records',
      query: '',
      combine: 'AND',
      rules: [],
      collection: null,
      sortBy: 'default',
      sortDir: 'asc',
      page: 1,
    }),
  },
})

const router = useRouter()

const fields = computed(() =>
  props.fields.length
    ? props.fields
    : [
        { title: 'Título', value: 'title' },
        { title: 'Autor', value: 'author' },
        { title: 'Fecha', value: 'date' },
        { title: 'Descripción', value: 'description' },
      ]
)
const collections = computed(() => props.collections)

function onBasicSearch(q) {
  router.push({ path: '/record', query: { q } })
}
function onAdvancedSearch(payload) {
  const goTo = payload.scope === 'collections' ? '/collection' : '/record'
  const query = {
    q: payload.query || undefined,
    scope: payload.scope,
    combine: payload.combine,
    rules: payload.rules?.length ? JSON.stringify(payload.rules) : undefined,
    collection: payload.collection ?? undefined,
    sortBy: payload.sortBy,
    sortDir: payload.sortDir,
    page: payload.page,
    limit: 50,
  }
  router.push({ path: goTo, query })
}
</script>

<template>
  <div>
    <!-- HERO global -->
    <Hero />

    <!-- BUSCADOR global, con contenedor full-bleed para que respire -->
    <section class="page-search-wrap">
      <div class="page-search-inner">
        <SearchBar
          :fields="fields"
          :collections="collections"
          :defaults="advancedDefaults"
          @do-basic-search="onBasicSearch"
          @do-advanced-search="onAdvancedSearch"
        />
      </div>
    </section>

    <!-- Contenido de cada página -->
    <main class="page-container">
      <slot />
    </main>
  </div>
</template>

<style scoped>
/* Contenedor principal de contenido (no afecta SearchBar) */
.page-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px;
}

/* Zona del buscador en full-bleed (ocupa todo el ancho visual) */
.page-search-wrap {
  width: 100%;
  padding: 0;                 /* sin restricciones laterales */
  margin-top: 8px;
  margin-bottom: 8px;
}

/* El inner centra y limita suavemente para que no estire en pantallas enormes */
.page-search-inner {
  max-width: 1400px;         /* ⬅️ margen máximo cómodo */
  margin: 0 auto;
}
</style>