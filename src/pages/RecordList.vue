<template>
  <PageLayout>
    <v-row v-if="loading">
      <v-col v-for="i in 8" :key="i" cols="12" sm="6" md="4" lg="3">
        <v-skeleton-loader type="image, article" />
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col v-for="record in records" :key="record.id" cols="12" sm="6" md="4" lg="3">
        <v-card 
          flat 
          class="record-card" 
          @click="$router.push(`/${currentScope === 'collections' ? 'collection' : 'record'}/${record.id}`)"
        >
          <v-img 
            :src="record.imageDisplay" 
            height="250" 
            cover 
            class="rounded-lg bg-grey-lighten-2 mb-3"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="grey-lighten-1" />
              </v-row>
            </template>
          </v-img>

          <v-card-item class="pa-0">
            <v-card-title class="text-body-1 font-weight-bold line-clamp-2" style="line-height: 1.2;">
              {{ record.displayTitle }}
            </v-card-title>
            
            <v-card-subtitle v-if="record.cleanTags" class="text-caption text-primary mt-1">
              {{ record.cleanTags }}
            </v-card-subtitle>
          </v-card-item>
        </v-card>
      </v-col>

      <v-col v-if="records.length === 0" cols="12" class="text-center py-12">
        <v-icon size="64" color="grey-lighten-1">mdi-database-search-outline</v-icon>
        <p class="text-grey-darken-1 mt-4">No se han encontrado resultados para tu búsqueda.</p>
        <v-btn variant="text" color="primary" @click="$router.push(route.path)">Limpiar filtros</v-btn>
      </v-col>
    </v-row>
  </PageLayout>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'
import PageLayout from '@/components/PageLayout.vue'

const route = useRoute()
const records = ref([])
const loading = ref(false)
const API_BASE = 'https://arcadium.cluster24.libnamic.eu'

const currentScope = computed(() => route.query.scope || 'records')

// Limpieza de textos complejos que vienen de la API
function getCleanText(field) {
  if (!field) return '';
  if (typeof field === 'object') {
    const firstKey = Object.keys(field)[0];
    const content = field[firstKey] || field;
    return content.value || content['@value'] || content[0]?.value || (typeof content === 'string' ? content : '');
  }
  if (typeof field === 'string' && field.startsWith('{')) return '';
  return field;
}

// Procesamiento de cada registro para la UI
function processRecord(item) {
  let img = item.preview || item.thumbnail || item.image || '/placeholder.png';
  if (img !== '/placeholder.png' && !img.startsWith('http')) {
    img = `${API_BASE}${img.startsWith('/') ? '' : '/'}${img}`;
  }

  const titleField = item.metadata_fields?.['dcterms:title'] || item.title || item.name;
  const displayTitle = getCleanText(titleField);
  
  let tags = item.joined_metadata || "";
  let cleanTags = "";
  if (Array.isArray(tags)) {
    cleanTags = tags.map(t => getCleanText(t)).filter(t => t).join(" • ");
  } else {
    const text = getCleanText(tags);
    cleanTags = text ? text.split(',').join(" • ") : "";
  }

  return { 
    ...item, 
    imageDisplay: img, 
    displayTitle: displayTitle || 'Sin título',
    cleanTags: cleanTags 
  }
}

// Lógica de carga de datos sincronizada con la URL
async function fetchData() {
  loading.value = true
  try {
    let activeFilters = [];
    if (route.query.rules) {
      try {
        activeFilters = JSON.parse(route.query.rules);
      } catch (e) {
        console.warn("Filtros mal formados en la URL", e);
      }
    }

    // Construcción de parámetros para la API
    const params = {
      with_labels: 1,
      fields: 'id,title,name,thumbnail,preview,description,joined_metadata,metadata_fields',
      limit: 40,
      page: route.query.page || 1,
      search: route.query.q || '', 
      combine: route.query.combine || 'AND',
    }

    // Solo añadimos filtros si realmente hay reglas válidas
    if (activeFilters.length > 0) {
      params.filters = activeFilters;
    }

    if (route.query.sortBy) params.sort = route.query.sortBy
    if (route.query.sortDir) params.direction = route.query.sortDir

    // Decisión de endpoint
    let response;
    if (currentScope.value === 'collections') {
      response = await api.getCollections(params)
    } else {
      response = await api.getRecords(params)
    }

    // Extraer datos según estructura de respuesta
    const items = response.data?.data || response.data?.items || response.data || []
    records.value = Array.isArray(items) ? items.map(processRecord) : []
    
  } catch (err) {
    console.error("Error cargando lista:", err)
    records.value = []
  } finally {
    loading.value = false
  }
}

// Watch profundo para reaccionar a cualquier cambio en la URL
watch(() => route.query, () => {
  fetchData()
}, { immediate: true, deep: true })
</script>

<style scoped>
.record-card { 
  cursor: pointer; 
  background: transparent !important; 
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.record-card:hover { 
  opacity: 0.9;
  transform: translateY(-4px);
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>