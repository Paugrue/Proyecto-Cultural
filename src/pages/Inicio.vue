<template>
  <PageLayout>
    <div class="inicio-contenedor">
      <h2 class="inicio-title">Este es el sitio de Granada</h2>

      <div class="inicio-btn-grid">
        <RouterLink to="/collection">
          <v-btn class="inicio-btn" color="black" variant="flat" block>
            Colecciones
          </v-btn>
        </RouterLink>

        <RouterLink to="/record">
          <v-btn class="inicio-btn" color="black" variant="flat" block>
            Registros
          </v-btn>
        </RouterLink>
      </div>

      <div class="inicio-divider"></div>
    </div>

    <!-- Destacados -->
    <v-row class="mt-8" v-if="collections.length">
      <v-col
        v-for="col in collections"
        :key="col.id"
        cols="12" sm="6" md="4" lg="3"
      >
        <v-card
          class="rounded-lg hoverable"
          style="cursor:pointer"
          @click="$router.push('/collection/' + col.id)"
        >
          <v-img :src="col.thumbnailFull" height="180" cover class="rounded-t-lg" />
          <v-card-title>{{ col.title }}</v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </PageLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PageLayout from '@/components/PageLayout.vue'
import api from '@/services/api'

const collections = ref([])
const API_BASE = 'https://arcadium.cluster24.libnamic.eu'

onMounted(async () => {
  try {
    const { data } = await api.getCollections({
      with_labels: 1,
      fields: 'id,title,thumbnail',
      limit: 8
    })
    const items = data.items || data.results || data || []
    collections.value = items.map(c => ({
      ...c,
      thumbnailFull: normalizeThumb(c.thumbnail)
    }))
  } catch (e) {
    console.error('Error cargando colecciones destacadas:', e)
  }
})

function normalizeThumb(th) {
  if (!th) return '/placeholder.png'
  if (/^https?:\/\//i.test(th)) return th
  return `${API_BASE}${th.startsWith('/') ? '' : '/'}${th}`
}
</script>

<style scoped>
.inicio-contenedor {
  margin-top: 60px;
  text-align: center;
}

.inicio-title {
  font-size: 36px;
  font-weight: 600;
  margin-bottom: 32px;
  color: #1d1d1f;
  letter-spacing: -0.5px;
}

.inicio-btn-grid {
  display: flex;
  justify-content: center;
  gap: 28px;
}

.inicio-btn {
  height: 56px !important;
  border-radius: 999px !important;
  padding: 0 38px !important;
  font-size: 17px !important;
  font-weight: 600 !important;
  letter-spacing: .3px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.10) !important;
  transition: transform .15s ease, box-shadow .15s ease !important;
}

.inicio-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important;
}

.inicio-divider {
  width: 100%;
  max-width: 480px;
  height: 1px;
  background: rgba(0,0,0,0.08);
  margin: 48px auto 0 auto;
}

.hoverable {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.hoverable:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.08);
}
</style>