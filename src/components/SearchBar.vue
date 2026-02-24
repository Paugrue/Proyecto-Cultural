<template>
  <div class="search-section">
    <div class="search-box">
      <v-text-field
        v-model="search"
        placeholder="Buscar registros..."
        variant="outlined"
        density="comfortable"
        hide-details
        prepend-inner-icon="mdi-magnify"
        class="search-input"
        @keyup.enter="onBasicSearch"
      />

      <v-btn class="search-btn" @click="onBasicSearch">
        Buscar
      </v-btn>

      <v-btn variant="text" class="advanced-btn" @click="advancedOpen = true">
        Avanzada
      </v-btn>
    </div>

    <AdvancedSearchDialog
      v-model="advancedOpen"
      :fields="fields"
      :collections="collections"
      :defaults="defaults"
      @do-advanced-search="onAdvanced"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdvancedSearchDialog from '@/components/AdvancedSearchDialog.vue'

const props = defineProps({
  fields: { type: Array, default: () => [] },
  collections: { type: Array, default: () => [] },
  defaults: { type: Object, default: () => ({ page: 1 }) },
})

const search = ref('')
const advancedOpen = ref(false)
const route = useRoute()
const router = useRouter()

// Sincroniza el input con la URL 
watch(() => route.query.q, (newVal) => {
  search.value = newVal || ''
}, { immediate: true })

function onBasicSearch() {
  const q = search.value?.trim() || ''
  router.push({
    path: '/record', // Forzamos a ir a la lista de registros si estamos en otra parte
    query: { ...route.query, q, page: 1 }
  })
}

function onAdvanced(payload) {
  const { rules, combine, collection, sortBy, sortDir, page } = payload
  const query = {
    ...route.query,
    rules: JSON.stringify(rules || []),
    combine: combine || 'AND',
    collection: collection || undefined,
    sortBy: sortBy || undefined,
    sortDir: sortDir || undefined,
    page: page || 1
  }
  Object.keys(query).forEach(k => query[k] === undefined && delete query[k])
  router.push({ path: '/record', query })
}
</script>

<style scoped>
/*  estilos */
.search-section { display: flex; justify-content: center; margin: 32px 0; padding: 0 16px; }
.search-box { display: flex; align-items: center; gap: 12px; width: 100%; max-width: 880px; }
.search-input :deep(.v-field) { border-radius: 999px !important; background: white; border: 1px solid rgba(0,0,0,0.06); height: 52px; }
.search-btn { border-radius: 999px !important; padding: 0 24px !important; height: 52px !important; background: #111 !important; color: white !important; text-transform: none; }
.advanced-btn { color: #666 !important; text-transform: none; height: 52px !important; }
</style>