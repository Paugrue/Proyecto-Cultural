<template>
  <div>
    <Hero />

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

    <main class="page-container">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Hero from '@/components/Hero.vue'
import SearchBar from '@/components/SearchBar.vue'

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
  // Limpiar espacios y redirigir
  const queryTerm = q?.trim() || undefined
  router.push({ path: '/record', query: { q: queryTerm } })
}

function onAdvancedSearch(payload) {
  // Determinamos la ruta: si es collections va a /collection, si es records o all va a /record
  const goTo = payload.scope === 'collections' ? '/collection' : '/record'
  
  const query = {
    // Sincronizamos 'query' del diálogo con 'q' de la URL
    q: payload.query?.trim() || undefined,
    scope: payload.scope,
    combine: payload.combine,
    // Las reglas se envían como String JSON para la URL
    rules: payload.rules?.length ? JSON.stringify(payload.rules) : undefined,
    collection: payload.collection ?? undefined,
    sortBy: payload.sortBy,
    sortDir: payload.sortDir,
    // Resetear siempre a la página principal al hacer una búsqueda nueva
    page: 1,
    limit: 50,
  }

  // Navegación con los parámetros
  router.push({ path: goTo, query })
}
</script>

<style scoped>
.page-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px;
}

.page-search-wrap {
  width: 100%;
  padding: 0;
  margin-top: 8px;
  margin-bottom: 8px;
}

.page-search-inner {
  max-width: 1400px;
  margin: 0 auto;
}
</style>