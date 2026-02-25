<template>
  <div>
    <Hero />

    <section class="page-search-wrap">
      <div class="page-search-inner">
        <SearchBar
          :fields="fieldsList"
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
import { useRouter, useRoute } from 'vue-router'
import Hero from '@/components/Hero.vue'
import SearchBar from '@/components/SearchBar.vue'

const props = defineProps({
  fields: { type: Array, default: () => [] },
  collections: { type: Array, default: () => [] },
})

const router = useRouter()
const route = useRoute()

const fieldsList = computed(() =>
  props.fields.length ? props.fields : [
    { title: 'Título', value: 'title' },
    { title: 'Autor', value: 'author' },
    { title: 'Fecha', value: 'date' },
    { title: 'Descripción', value: 'description' },
  ]
)

// Sincroniza la URL con el estado de la búsqueda
const advancedDefaults = computed(() => {
  let rules = []
  try {
    if (route.query.rules) {
      rules = JSON.parse(route.query.rules)
    }
  } catch (e) {
    rules = []
  }

  return {
    scope: route.query.scope || 'records',
    query: route.query.q || '',
    combine: route.query.combine || 'AND',
    rules: rules,
    collection: route.query.collection || null,
    sortBy: route.query.sortBy || 'default',
    sortDir: route.query.sortDir || 'asc',
  }
})

const collections = computed(() => props.collections)

function onBasicSearch(q) {
  const queryTerm = q?.trim() || undefined
  router.push({ path: '/record', query: { q: queryTerm, page: 1 } })
}

function onAdvancedSearch(payload) {
  const goTo = payload.scope === 'collections' ? '/collection' : '/record'
  const query = {
    q: payload.query?.trim() || undefined,
    scope: payload.scope,
    combine: payload.combine,
    rules: payload.rules?.length ? JSON.stringify(payload.rules) : undefined,
    collection: payload.collection || undefined,
    sortBy: payload.sortBy,
    sortDir: payload.sortDir,
    page: 1,
  }
  // Limpiar nulos para URL limpia
  Object.keys(query).forEach(k => query[k] === undefined && delete query[k])
  router.push({ path: goTo, query })
}
</script>

<style scoped>
.page-container { max-width: 1100px; margin: 0 auto; padding: 24px; }
.page-search-wrap { width: 100%; margin: 8px 0; }
.page-search-inner { max-width: 1400px; margin: 0 auto; }
</style>