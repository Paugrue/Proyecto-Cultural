<template>
  <PageLayout>
    <!-- Botón volver -->
    <v-btn to="/collection" variant="text" prepend-icon="mdi-arrow-left">
      Volver
    </v-btn>

    <!-- Info de la colección -->
    <h1 class="text-h4 mb-4">{{ collection.title }}</h1>
    <p class="mb-6">{{ collection.description }}</p>

    <!-- Grid de registros hijos -->
    <v-row>
      <v-col
        v-for="record in childRecords"
        :key="record.id"
        cols="12" sm="6" md="4" lg="3"
      >
        <v-card
          class="rounded-lg hoverable"
          style="cursor:pointer"
          @click="$router.push('/record/' + record.id)"
        >
          <v-img
            :src="record.thumbnailFull"
            height="180"
            cover
          />
          <v-card-title>{{ record.title }}</v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <!-- Media de la colección (opcional) -->
    <div v-if="collectionMedia.length" class="mt-8">
      <h2 class="text-h5 mb-4">Media asociada</h2>
      <v-row>
        <v-col
          v-for="media in collectionMedia"
          :key="media.id"
          cols="12" sm="6" md="4"
        >
          <v-img :src="media.thumbnailFull" height="200" cover />
          <div v-if="media.attachment">
            <a :href="API_BASE + media.attachment.url" target="_blank">
              Descargar
            </a>
          </div>
        </v-col>
      </v-row>
    </div>
  </PageLayout>
</template>

<script setup>
import { ref, onMounted } from "vue"
import PageLayout from "@/components/PageLayout.vue"
import api from "@/services/api"
import { useRoute } from "vue-router"

const route = useRoute()
const collectionId = route.params.id
const API_BASE = "https://arcadium.cluster24.libnamic.eu"

const collection = ref({})
const childRecords = ref([])
const collectionMedia = ref([])

onMounted(async () => {
  // 1️⃣ Traer datos de la colección
  const { data: collData } = await api.getCollection(collectionId, {
    with_labels: 1,
    fields: "id,title,description,canonical_joined_metadata,children"
  })
  collection.value = collData

  // 2️⃣ Traer registros hijos de esta colección
  const { data: recordsData } = await api.getRecords({
    with_labels: 1,
    fields: "id,title,thumbnail",
    filters: JSON.stringify([
      { field: "collections", operator: "in", value: [collectionId] }
    ]),
    limit: 50
  })

  const items = recordsData.items || []
  childRecords.value = items.map(r => ({
    ...r,
    thumbnailFull: r.thumbnail ? API_BASE + r.thumbnail : "/placeholder.png"
  }))

  // 3️⃣ Opcional: traer media de la colección si existe
  if (collection.value.children && collection.value.children.length) {
    const mediaPromises = collection.value.children.map(c =>
      api.getCollection(c.id, { with_labels: 1, fields: "id,thumbnail,attachment" })
    )
    const mediaResults = await Promise.all(mediaPromises)
    collectionMedia.value = mediaResults.map(r => {
      const m = r.data
      return {
        ...m,
        thumbnailFull: m.thumbnail ? API_BASE + m.thumbnail : "/placeholder.png"
      }
    })
  }
})
</script>

<style scoped>
.hoverable {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.hoverable:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.08);
}
</style>
