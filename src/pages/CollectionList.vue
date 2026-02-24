<template>
  <PageLayout>
    <v-row>
      <v-col cols="12" v-if="loading">
        <v-row>
          <v-col v-for="i in 8" :key="i" cols="12" sm="6" md="4" lg="3">
            <v-skeleton-loader type="image, article" class="mb-4" />
          </v-col>
        </v-row>
      </v-col>

      <v-col
        v-else
        v-for="col in collections"
        :key="col.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card
          flat
          class="collection-card"
          @click="$router.push('/collection/' + col.id)"
        >
          <v-hover v-slot="{ isHovering, props }">
            <v-img
              v-bind="props"
              :src="col.imageDisplay"
              height="280"
              cover
              class="rounded-lg position-relative"
            >
              <v-fade-transition>
                <div
                  v-if="isHovering"
                  class="d-flex transition-fast-in-fast-out bg-black-darken-2 v-card--reveal text-h2"
                  style="height: 100%; background: rgba(0,0,0,0.2);"
                ></div>
              </v-fade-transition>
              
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular indeterminate color="grey-lighten-1" />
                </v-row>
              </template>
            </v-img>
          </v-hover>

          <v-card-item class="px-0 pt-4">
            <v-card-title class="text-h6 font-weight-bold pb-1" style="line-height: 1.2;">
              {{ col.title }}
            </v-card-title>
            
            <v-card-subtitle 
              v-if="col.cleanTags && col.cleanTags.length" 
              class="text-caption text-uppercase font-weight-medium text-primary"
            >
              {{ col.cleanTags.join(' • ') }}
            </v-card-subtitle>
          </v-card-item>

          <v-card-text class="px-0 pt-0 text-body-2 text-grey-darken-1">
            <p class="line-clamp-2">
              {{ col.description || 'Explora esta colección cultural.' }}
            </p>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col v-if="!loading && collections.length === 0" cols="12" class="text-center py-12">
        <v-icon size="64" color="grey-lighten-1">mdi-database-search-outline</v-icon>
        <p class="text-grey-darken-1 mt-4">No se han encontrado colecciones.</p>
      </v-col>
    </v-row>
  </PageLayout>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import PageLayout from '@/components/PageLayout.vue'
import api from '@/services/api'

const route = useRoute()
const collections = ref([])
const loading = ref(false)
const API_BASE = 'https://arcadium.cluster24.libnamic.eu'

function processCollection(item) {
  let tags = [];
  const rawMetadata = item.joined_metadata || item.metadata || "";
  if (Array.isArray(rawMetadata)) {
    tags = rawMetadata;
  } else if (typeof rawMetadata === 'string' && rawMetadata.length > 0) {
    tags = rawMetadata.split(',').map(s => s.trim()).filter(s => s !== "");
  }

  let img = item.preview || item.thumbnail || item.image || '/placeholder.png';
  if (img !== '/placeholder.png' && !img.startsWith('http')) {
    img = `${API_BASE}${img.startsWith('/') ? '' : '/'}${img}`;
  }

  return {
    ...item,
    id: item.id || Math.random(),
    imageDisplay: img,
    cleanTags: tags
  }
}

async function fetchData() {
  loading.value = true
  try {
    // Extraer y parsear los filtros de la URL 
    let activeFilters = [];
    if (route.query.rules) {
      try {
        activeFilters = JSON.parse(route.query.rules);
      } catch (e) {
        console.warn("Error parseando reglas en colecciones:", e);
        activeFilters = [];
      }
    }

    // Construcción del objeto de parámetros para la API
    const params = {
      with_labels: 1,
      fields: 'id,title,thumbnail,preview,description,joined_metadata',
      limit: 100,
      page: route.query.page || 1,
      // Sincronización: q (URL) -> search (API)
      search: route.query.q || '',
      combine: route.query.combine || 'AND',
      // Array de objetos 
      filters: activeFilters.length ? activeFilters : undefined
    }

    // Ordenación
    if (route.query.sortBy) params.sort = route.query.sortBy
    if (route.query.sortDir) params.direction = route.query.sortDir

    const response = await api.getCollections(params);
    const apiData = response.data?.data || response.data?.items || (Array.isArray(response.data) ? response.data : []);
    collections.value = apiData.map(item => processCollection(item));
  } catch (error) {
    console.error("Error en fetchData collections:", error);
    collections.value = [];
  } finally {
    loading.value = false
  }
}

watch(() => route.query, () => fetchData(), { immediate: true, deep: true })
</script>

<style scoped>
.collection-card {
  background: transparent !important;
  transition: all 0.3s ease;
  cursor: pointer;
}

.collection-card:hover .v-img {
  transform: scale(1.02);
}

.v-img {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>