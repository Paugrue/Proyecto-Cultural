<!-- src/pages/RecordList.vue -->
<template>
  <PageLayout>
    <v-row>
      <v-col cols="12" v-if="loading">
        <v-skeleton-loader type="image, text" class="mb-4" />
        <v-skeleton-loader type="image, text" class="mb-4" />
        <v-skeleton-loader type="image, text" class="mb-4" />
      </v-col>

      <v-col cols="12" v-else-if="!records.length">
        <v-alert type="info" variant="tonal" class="d-flex align-center ga-3">
          <span>No hay registros para los filtros aplicados.</span>
          <v-spacer />
          <RouterLink :to="{ path: '/record', query: { limit: 50 } }">
            <v-btn variant="text">Limpiar filtros</v-btn>
          </RouterLink>
        </v-alert>
      </v-col>

      <v-col
        v-else
        v-for="rec in records"
        :key="rec.id"
        cols="12" sm="6" md="4" lg="3"
      >
        <v-card class="rounded-lg hoverable" style="cursor:pointer" @click="$router.push('/record/' + rec.id)">
          <v-img :src="normalizeThumb(rec.thumbnail)" height="200" cover class="rounded-t-lg" />
          <v-card-title>{{ rec.title }}</v-card-title>
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

const records = ref([])
const total = ref(0)
const loading = ref(false)

function normalizeThumb(th) {
  if (!th) return '/placeholder.png'
  if (/^https?:\/\//i.test(th)) return th
  return `${API_BASE}${th.startsWith('/') ? '' : '/'}${th}`
}

function mapOperator(op) {
  const map = {
    contains: 'contains',
    eq: 'eq',
    neq: 'neq',
    startsWith: 'startsWith',
    endsWith: 'endsWith',
    isEmpty: 'isEmpty',
    notEmpty: 'notEmpty',
    in: 'in'
  }
  return map[op] || op || 'contains'
}

function buildFiltersFromQuery(q) {
  const filters = []

  // Colección concreta (?collection=6) -> como tu cURL
  if (q.collection !== undefined && q.collection !== null && q.collection !== '') {
    const id = Number(q.collection)
    if (!Number.isNaN(id)) filters.push({ field: 'collections', operator: 'in', value: [id] })
  }

  // Texto libre -> fulltext (ajusta el campo si tu backend usa otro)
  if (q.q && String(q.q).trim()) {
    filters.push({ field: 'joined_metadata', operator: 'contains', value: String(q.q).trim() })
  }

  // Reglas avanzadas
  if (q.rules) {
    try {
      const rules = JSON.parse(q.rules)
      for (const r of rules) {
        if (!r?.field) continue
        const op = mapOperator(r.operator)
        const filter = { field: r.field, operator: op }
        if (['isEmpty', 'notEmpty'].includes(op)) filter.value = null
        else filter.value = r.value
        filters.push(filter)
      }
    } catch (e) {
      console.warn('No se pudo parsear rules:', e)
    }
  }

  return filters
}

watch(
  () => ({ ...route.query }),
  () => fetchData(),
  { immediate: true }
)

async function fetchData() {
  loading.value = true
  try {
    const q = route.query
    const page = Math.max(1, Number(q.page) || 1)
    const limit = Math.max(1, Number(q.limit) || 50)
    const offset = (page - 1) * limit

    const filters = buildFiltersFromQuery(q)
    const hasFilters = filters.length > 0

    const params = {
      fields: 'id,title,joined_metadata,thumbnail',
      limit,
      offset
    }

    if (hasFilters) {
      params.filters = JSON.stringify(filters)
      if (q.combine) params.filters_logic = q.combine
      if (q.sortBy && q.sortBy !== 'default') params.order_by = q.sortBy
      if (q.sortDir) params.order_dir = q.sortDir
    }

    const { data } = await api.searchRecords(params)
    const items = Array.isArray(data)
      ? data
      : data.items || data.results || data.data || []

    records.value = items
    total.value = data.count ?? items.length
  } catch (err) {
    console.error('Error cargando registros:', err)
    records.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.hoverable { transition: transform 0.2s ease, box-shadow 0.2s ease; }
.hoverable:hover { transform: translateY(-4px); box-shadow: 0 12px 36px rgba(0,0,0,0.08); }

.inicio-contenedor,
.inicio-btn-grid,
.inicio-btn {
  border-bottom: none !important;
  box-shadow: none !important;
}
</style>