<template>
  <PageLayout>
    <v-btn to="/collection" variant="text" prepend-icon="mdi-arrow-left" class="mb-4">
      Volver a colecciones
    </v-btn>

    <div class="mb-10">
      <h1 class="text-h3 font-weight-bold mb-4">{{ collection.title }}</h1>
      <p class="text-body-1 text-grey-darken-2" style="max-width: 800px; line-height: 1.7;">
        {{ collection.description || 'Sin descripción disponible para esta colección.' }}
      </p>
    </div>

    <v-divider class="mb-8"></v-divider>

    <h2 class="text-h5 font-weight-bold mb-6">Objetos en esta colección</h2>
    
    <v-row v-if="loadingRecords">
      <v-col v-for="i in 4" :key="i" cols="12" sm="6" md="3">
        <v-skeleton-loader type="card" />
      </v-col>
    </v-row>

    <v-row v-else-if="childRecords.length">
      <v-col
        v-for="record in childRecords"
        :key="record.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card
          flat
          class="record-card"
          @click="$router.push('/record/' + record.id)"
        >
          <v-img
            :src="record.imageDisplay"
            :alt="record.title"
            height="220"
            cover
            class="rounded-lg bg-grey-lighten-2 mb-3"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="grey-lighten-1" />
              </v-row>
            </template>
          </v-img>
          
          <v-card-title class="pa-0 text-body-1 font-weight-bold line-clamp-2" style="line-height: 1.3;">
            {{ record.title }}
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <v-alert v-else type="info" variant="tonal" class="mt-4">
      No hay objetos registrados en esta colección todavía.
    </v-alert>

    <div v-if="collectionMedia.length" class="mt-12">
      <h2 class="text-h5 font-weight-bold mb-6">Documentos y Media</h2>
      <v-row>
        <v-col
          v-for="media in collectionMedia"
          :key="media.id"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card flat class="rounded-lg overflow-hidden border">
            <v-img :src="media.imageDisplay" height="200" cover />
            <v-card-actions v-if="media.attachment">
              <v-btn 
                block 
                variant="light" 
                color="primary"
                :href="API_BASE + media.attachment.url" 
                target="_blank"
                prepend-icon="mdi-download"
              >
                Descargar Archivo
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </PageLayout>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import PageLayout from "@/components/PageLayout.vue"
import api from "@/services/api"

const route = useRoute()
const collectionId = route.params.id
const API_BASE = "https://arcadium.cluster24.libnamic.eu"

const collection = ref({ title: 'Cargando...', description: '' })
const childRecords = ref([])
const collectionMedia = ref([])
const loadingRecords = ref(true)

/**
 * Normalización
 */
function normalizeItem(r) {
  // Prioridad a preview 
  let img = r.preview || r.thumbnail || r.image || '/placeholder.png';
  if (img !== '/placeholder.png' && !img.startsWith('http')) {
    img = `${API_BASE}${img.startsWith('/') ? '' : '/'}${img}`;
  }

  return {
    ...r,
    id: r.id,
    title: r.title || 'Sin título',
    imageDisplay: img
  }
}

onMounted(async () => {
  try {
    // Datos de la colección principal
    const { data: collData } = await api.getCollection(collectionId, {
      with_labels: 1,
      fields: "id,title,description,children,thumbnail,preview"
    })
    collection.value = collData || { title: 'Sin título', description: '' }

    // Carga de Registros Hijos desde la API
    const { data: recordsData } = await api.getRecords({
      with_labels: 1,
      fields: "id,title,thumbnail,preview,metadata_fields",
      filters: JSON.stringify([{ field: "collections", operator: "in", value: [collectionId] }]),
      limit: 50
    })
    
    const apiRecords = recordsData?.data || recordsData?.items || []
    childRecords.value = apiRecords.map(normalizeItem)
    loadingRecords.value = false

    // Carga de Media 
    if (collection.value.children && collection.value.children.length) {
      const mediaPromises = collection.value.children.map(c =>
        api.getCollection(c.id, { with_labels: 1, fields: "id,thumbnail,preview,attachment" })
      )
      const mediaResults = await Promise.all(mediaPromises)
      collectionMedia.value = mediaResults.map(r => normalizeItem(r.data))
    }
  } catch (e) {
    console.error("Error cargando la colección:", e)
    loadingRecords.value = false
  }
})
</script>

<style scoped>
.record-card {
  cursor: pointer;
  background: transparent !important;
}

.record-card:hover .v-img {
  transform: translateY(-5px);
  transition: transform 0.3s ease;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.v-img {
  transition: transform 0.3s ease;
}
</style>