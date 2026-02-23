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
import { ref } from 'vue'
import AdvancedSearchDialog from '@/components/AdvancedSearchDialog.vue'

const props = defineProps({
  fields: { type: Array, default: () => [] },
  collections: { type: Array, default: () => [] },
  defaults: {
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

const emit = defineEmits(['do-basic-search', 'do-advanced-search'])

const search = ref('')
const advancedOpen = ref(false)

function onBasicSearch() {
  emit('do-basic-search', search.value?.trim() || '')
}
function onAdvanced(payload) {
  emit('do-advanced-search', payload)
}
</script>

<style scoped>
.search-section {
  display: flex;
  justify-content: center;
  margin: 32px 0;
  padding: 0 16px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: 880px; /* ⬅️ tamaño normal, cómodo */
}

/* Input tamaño NORMAL */
.search-input :deep(.v-field) {
  border-radius: 999px !important;
  background: white;
  border: 1px solid rgba(0,0,0,0.06);
  height: 52px;               /* ⬅️ tamaño normal */
  font-size: 16px;
}

.search-input :deep(input) {
  height: 52px !important;
  line-height: 52px !important;
  font-size: 16px !important;
}

.search-input :deep(.v-field__prepend-inner .v-icon) {
  font-size: 22px !important;
}

/* Botón principal tamaño normal */
.search-btn {
  border-radius: 999px !important;
  padding: 0 24px !important;
  height: 52px !important; /* ⬅️ mismo alto que input */
  background: #111 !important;
  color: white !important;
  font-weight: 600;
  font-size: 15px;
  text-transform: none;
}

/* Botón "Avanzada" tamaño normal */
.advanced-btn {
  color: #666 !important;
  font-weight: 600;
  text-transform: none;
  height: 52px !important;
  padding: 0 12px !important;
  font-size: 15px;
}

.advanced-btn:hover { color: #111 !important; }
</style>