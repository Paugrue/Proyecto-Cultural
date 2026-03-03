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
        @keydown.enter.prevent="onBasicSearch"
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
      :collections="collectionsForDialog"
      :defaults="defaults"
      @do-advanced-search="onAdvanced"
    />
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import AdvancedSearchDialog from './AdvancedSearchDialog.vue'

const props = defineProps({
  fields: { type: Array, default: () => [] },
  defaults: Object,
  collections: { type: Array, default: () => [] } // lista de colecciones {id, title}
})

const emit = defineEmits(['do-basic-search', 'do-advanced-search'])

const route = useRoute()
const search = ref('')
const advancedOpen = ref(false)

// sincroniza input con query param
watch(
  () => route.query.q,
  val => {
    search.value = val || ''
  },
  { immediate: true }
)

// envía búsqueda básica
function onBasicSearch() {
  emit('do-basic-search', search.value)
}

// envía búsqueda avanzada
function onAdvanced(payload) {
  emit('do-advanced-search', payload)
  advancedOpen.value = false
}

// --- CORRECCIÓN IMPORTANTE ---
// convertimos las colecciones para que el dialogo reciba {id, title} siempre
const collectionsForDialog = computed(() =>
  props.collections.map(c => ({
    id: c.id,
    title: c.title || c.name || 'Sin título'
  }))
)
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
  max-width: 880px;
}

.search-input :deep(.v-field) {
  border-radius: 999px !important;
  background: white;
  height: 52px;
}

.search-btn {
  border-radius: 999px !important;
  height: 52px !important;
  background: #111 !important;
  color: white !important;
}

.advanced-btn {
  color: #666 !important;
  height: 52px !important;
}
</style>