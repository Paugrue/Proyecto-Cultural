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
      <v-btn class="search-btn" @click="onBasicSearch">Buscar</v-btn>
      <v-btn variant="text" class="advanced-btn" @click="advancedOpen = true">Avanzada</v-btn>
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
import { useRoute } from 'vue-router'
import AdvancedSearchDialog from './AdvancedSearchDialog.vue'

const props = defineProps({
  fields: Array,
  collections: Array,
  defaults: Object
})

const emit = defineEmits(['do-basic-search', 'do-advanced-search'])
const route = useRoute()
const search = ref('')
const advancedOpen = ref(false)

watch(() => route.query.q, (val) => { search.value = val || '' }, { immediate: true })

function onBasicSearch() {
  emit('do-basic-search', search.value)
}

function onAdvanced(payload) {
  emit('do-advanced-search', payload)
  advancedOpen.value = false
}
</script>

<style scoped>
.search-section { display: flex; justify-content: center; margin: 32px 0; padding: 0 16px; }
.search-box { display: flex; align-items: center; gap: 12px; width: 100%; max-width: 880px; }
.search-input :deep(.v-field) { border-radius: 999px !important; background: white; height: 52px; }
.search-btn { border-radius: 999px !important; height: 52px !important; background: #111 !important; color: white !important; }
.advanced-btn { color: #666 !important; height: 52px !important; }
</style>