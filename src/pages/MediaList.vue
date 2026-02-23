<!-- src/pages/MediaList.vue -->
<template>
  <PageLayout>
    <v-row>
      <v-col cols="12" v-if="loading">
        <v-skeleton-loader v-for="i in 8" :key="i" type="image, text" class="mb-4" />
      </v-col>

      <v-col cols="12" v-else-if="!media.length">
        <v-alert type="info" variant="tonal">
          No hay elementos multimedia para los filtros aplicados.
        </v-alert>
      </v-col>

      <v-col v-else v-for="m in media" :key="m.id" cols="12" sm="6" md="4" lg="3">
        <v-card class="rounded-lg hoverable" :title="m.title || 'Sin título'">
          <v-img
            :src="m.thumbnailFull"
            :alt="`Miniatura de ${m.title || 'sin título'}`"
            height="180"
            cover
            class="rounded-t-lg"
          />
          <v-card-title class="text-truncate">
            {{ m.title || 'Sin título' }}
          </v-card-title>
          <v-card-text class="text-body-2">
            <span class="line-clamp-3">{{ m.description || '' }}</span>
          </v-card-text>
          <v-card-actions class="d-flex ga-2">
            <v-btn
              v-if="m.attachmentFull"
              :href="m.attachmentFull"
              target="_blank"
              rel="noopener"
              variant="flat"
              color="black"
            >
              Abrir archivo
            </v-btn>
            <v-btn
              v-if="m.attachmentFull"
              :href="m.attachmentFull"
              target="_blank"
              rel="noopener"
              variant="text"
              download
            >
              Descargar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <div class="d-flex justify-center my-6" v-if="total > limit">
      <v-pagination
        v-model="page"
        :length="Math.ceil(total / limit)"
        @update:modelValue="onPage"
      />
    </div>
  </PageLayout>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageLayout from '@/components/PageLayout.vue'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()
const API_BASE = 'https://arcadium.cluster24.libnamic.eu'

const loading = ref(false)
const media = ref([])
const total = ref(0)
const limit = 24
const page = ref(Number(route.query.page || 1))

function normalizeUrl(u) {
  if (!u) return null
  if (/^https?:\/\//i.test(u)) return u
  return `${API_BASE}${u.startsWith('/') ? '' : '/'}${u}`
}

watch(() => ({ ...route.query }), fetchData, { immediate: true })

async function fetchData() {
  loading.value = true
  try {
    const currentPage = Math.max(1, Number(route.query.page) || 1)
    page.value = currentPage
    const offset = (currentPage - 1) * limit

    const params = { limit, offset }
    const { data } = await api.getMediaDefault(params)

    const items = Array.isArray(data) ? data : (data.items || data.results || data.data || [])
    media.value = items.map(m => ({
      ...m,
      thumbnailFull: normalizeUrl(m.thumbnail) || '/placeholder.png',
      attachmentFull: normalizeUrl(m.attachment),
    }))
    total.value = data.count ?? items.length
  } finally {
    loading.value = false
  }
}

function onPage(val) {
  router.push({ path: route.path, query: { ...route.query, page: val } })
}
</script>

<style scoped>
.hoverable { transition: transform .2s ease, box-shadow .2s ease; }
.hoverable:hover { transform: translateY(-4px); box-shadow: 0 12px 36px rgba(0,0,0,.08); }

.line-clamp-3 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
</style>