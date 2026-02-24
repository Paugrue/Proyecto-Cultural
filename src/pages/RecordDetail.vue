<template>
  <PageLayout>
    <v-btn to="/record" variant="text" prepend-icon="mdi-arrow-left" class="mb-4">
      Volver al listado
    </v-btn>

    <v-row v-if="loading">
      <v-col cols="12" class="text-center py-12">
        <v-progress-circular indeterminate color="primary" size="64" />
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col cols="12" md="6">
        <v-card flat class="rounded-xl overflow-hidden border">
          <v-img :src="record.imageDisplay" height="550" cover class="bg-grey-lighten-3" />
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <div class="pa-md-6">
          <h1 class="text-h3 font-weight-bold mb-2">{{ record.displayTitle }}</h1>
          
          <div v-if="record.cleanCollections" class="text-overline text-primary mb-6">
            {{ record.cleanCollections }}
          </div>

          <v-divider class="mb-6"></v-divider>

          <div class="mb-6">
            <p v-if="record.displayAuthor" class="text-subtitle-1 mb-1">
              <span class="text-grey-darken-1 font-weight-medium">Autor:</span> {{ record.displayAuthor }}
            </p>
            <p v-if="record.displayYear" class="text-subtitle-1">
              <span class="text-grey-darken-1 font-weight-medium">Año:</span> {{ record.displayYear }}
            </p>
          </div>

          <div class="text-body-1 text-grey-darken-2" style="line-height: 1.8;">
            {{ record.displayDescription }}
          </div>
        </div>
      </v-col>
    </v-row>

    <v-divider class="my-12"></v-divider>
    
    <div v-if="relatedRecords.length">
      <h2 class="text-h5 font-weight-bold mb-6">También te puede interesar</h2>
      <v-row>
        <v-col v-for="r in relatedRecords" :key="r.id" cols="12" sm="6" md="3">
          <v-card flat class="related-card" @click="navigateToRecord(r.id)">
            <v-img :src="r.imageDisplay" height="220" cover class="rounded-lg mb-3 bg-grey-lighten-2" />
            <v-card-title class="pa-0 text-body-2 font-weight-bold line-clamp-1">
              {{ r.displayTitle }}
            </v-card-title>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </PageLayout>
</template>

<script setup>
import { ref, onMounted, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import PageLayout from "@/components/PageLayout.vue"
import api from "@/services/api"

const route = useRoute()
const router = useRouter()
const API_BASE = "https://arcadium.cluster24.libnamic.eu"

const record = ref({})
const relatedRecords = ref([])
const loading = ref(true)

// FUNCIÓN CLAVE: Extrae el texto real 
function getCleanText(item, fieldName) {
  // 1. Buscamos en metadata_fields 
  const meta = item.metadata_fields || {};
  const field = meta[fieldName] || item[fieldName];

  if (!field) return '';

  // Si es un objeto tipo { "label": "...", "value": "..." }
  if (typeof field === 'object') {
    // Si es un array de objetos, pillamos el primero
    const target = Array.isArray(field) ? field[0] : field;
    return target.value || target['@value'] || '';
  }

  return field;
}

function normalizeRecord(r) {
  let img = r.preview || r.thumbnail || r.image || "/placeholder.png";
  if (img !== "/placeholder.png" && !img.startsWith("http")) {
    img = `${API_BASE}${img.startsWith("/") ? "" : "/"}${img}`;
  }

  // Extraer datos usando los nombres técnicos de la API 
  const title = getCleanText(r, 'dcterms:title') || r.title || 'Sin título';
  const author = getCleanText(r, 'dcterms:creator');
  const year = getCleanText(r, 'dcterms:date');
  const desc = getCleanText(r, 'dcterms:description') || r.description || 'Sin descripción detallada.';

  let rawCols = r.collections_titles || r.collections || "";
  let cleanCols = Array.isArray(rawCols) ? rawCols.join(" • ") : String(rawCols).split(',').join(" • ");

  return {
    ...r,
    imageDisplay: img,
    displayTitle: title,
    displayAuthor: author,
    displayYear: year,
    displayDescription: desc,
    cleanCollections: cleanCols
  }
}

const loadData = async () => {
  loading.value = true
  try {
    const { data: recData } = await api.getRecord(route.params.id)
    record.value = normalizeRecord(recData)

    if (recData.collections && recData.collections.length) {
      const { data: relatedData } = await api.getRecords({
        limit: 4,
        filters: JSON.stringify([
          { field: "collections", operator: "in", value: recData.collections },
          { field: "id", operator: "ne", value: [recData.id] }
        ])
      })
      const items = relatedData?.data || relatedData?.items || []
      relatedRecords.value = items.map(normalizeRecord)
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const navigateToRecord = (id) => { router.push('/record/' + id) }
onMounted(loadData)
watch(() => route.params.id, loadData)
</script>