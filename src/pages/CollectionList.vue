<!-- src/pages/CollectionList.vue -->
<template>
  <PageLayout>
    <v-row>
      <v-col cols="12" v-if="loading">
        <v-skeleton-loader type="image, text" class="mb-4" v-for="i in 6" :key="i" />
      </v-col>

      <v-col cols="12" v-else-if="!collections.length">
        <v-alert type="info" variant="tonal" class="d-flex align-center ga-3">
          <span>No hay colecciones para los filtros aplicados.</span>
          <v-spacer />
          <RouterLink :to="{ path: '/collection', query: { limit: 50 } }">
            <v-btn variant="text">Limpiar filtros</v-btn>
          </RouterLink>
        </v-alert>
      </v-col>

      <v-col v-else v-for="collection in collections" :key="collection.id" cols="12" sm="6" md="4" lg="3">
        <v-card class="rounded-lg hoverable" style="cursor:pointer" @click="$router.push('/collection/' + collection.id)">
          <v-img
            :src="collection.thumbnailFull"
            height="180"
            cover
            class="rounded-t-lg"
          />
          <v-card-title>{{ collection.title }}</v-card-title>
        </v-card>
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
const API_BASE = 'https://arcadium.cluster24.libnamic.eu'
const collections = ref([])
const loading = ref(false)
const total = ref(0)

function normalize(u) {
  if (!u) return '/placeholder.png'
  if (/^https?:\/\//i.test(u)) return u
  return `${API_BASE}${u.startsWith('/') ? '' : '/'}${u}`
}

watch(() => ({ ...route.query }), fetchData, { immediate: true })

async function fetchData() {
  loading.value = true
  try {
    const q = route.query
    const page = Math.max(1, Number(q.page) || 1)
    const limit = Math.max(1, Number(q.limit) || 50)
    const offset = (page - 1) * limit

    // Construir filtros si vienen por query (opcional)
    const params = { fields: 'id,title,thumbnail', limit, offset }
    if (q.rules || q.q) {
      const filters = []
      if (q.q && String(q.q).trim()) {
        filters.push({ field: 'title', operator: 'contains', value: String(q.q).trim() })
      }
      if (q.rules) {
        try {
          const rules = JSON.parse(q.rules)
          for (const r of rules) {
            if (!r?.field) continue
            const f = { field: r.field, operator: r.operator, value: r.value }
            if (['isEmpty','notEmpty'].includes(r.operator)) f.value = null
            filters.push(f)
          }
        } catch { /* ignore */ }
      }
      params.filters = JSON.stringify(filters)
      if (q.combine) params.filters_logic = q.combine
      if (q.sortBy && q.sortBy !== 'default') params.order_by = q.sortBy
      if (q.sortDir) params.order_dir = q.sortDir
    }

    const { data } = await api.getCollections(params)
    const payload = data ?? {}
    const items = Array.isArray(payload) ? payload : (payload.items || payload.results || payload.data || [])
    collections.value = items.map(c => ({ ...c, thumbnailFull: normalize(c.thumbnail) }))
    total.value = payload.count ?? items.length
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.hoverable { transition: transform .2s ease, box-shadow .2s ease; }
.hoverable:hover { transform: translateY(-4px); box-shadow: 0 12px 36px rgba(0,0,0,.08); }

.inicio-contenedor,
.inicio-btn-grid,
.inicio-btn {
  border-bottom: none !important;
  box-shadow: none !important;
}
</style>