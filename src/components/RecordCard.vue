<template>
  <v-card class="record-card" @click="$router.push('/record/' + normalized.id)" >
    <v-img :src="normalized.thumbnail" height="200" cover class="record-image" />
    <v-card-text class="record-content">
      <div class="record-title">
        {{ normalized.title }}
      </div>
      <div v-if="normalized.collections" class="record-meta">
        {{ normalized.collections }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
const API_BASE = 'https://arcadium.cluster24.libnamic.eu'

export default {
  props: { record: Object },

  computed: {
    normalized() {
      const r = this.record || {}

      // Título
      const title = r.title || r.metadata_fields?.["dcterms:title"]?.[0]?.["@value"] || "Sin título"

      // Thumbnail
      let thumbnail = r.thumbnail
      if (!thumbnail) thumbnail = '/placeholder.png'
      else if (!/^https?:\/\//.test(thumbnail))
        thumbnail = `${API_BASE}${thumbnail.startsWith('/') ? '' : '/'}${thumbnail}`

      // Colecciones / Repositorios
      const collections = []

      // 1. collections_titles normales
      if (Array.isArray(r.collections_titles)) {
        collections.push(...r.collections_titles)
      }

      // 2. Repositorios tipo glam.record en dcterms:subject
      const subjects = r.metadata_fields?.["dcterms:subject"] || []
      subjects.forEach((s) => {
        if (s.model === "glam.record" && s.label) collections.push(s.label)
      })

      return {
        id: r.id,
        title,
        thumbnail,
        collections: collections.length ? collections.join(', ') : null
      }
    }
  }
}
</script>

<style scoped>
.record-card {
  border-radius: 16px !important;
  overflow: hidden;
  background: #ffffff !important;
  border: 1px solid rgba(0,0,0,0.05);
  box-shadow: 0 4px 14px rgba(0,0,0,0.04);
  cursor: pointer;
  transition: all 0.25s ease;
  width: 100%; /* ocupa todo el ancho disponible */
}

.record-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 28px rgba(0,0,0,0.06);
}

.record-image {
  filter: saturate(102%) contrast(101%);
  transition: transform 0.4s ease;
}

.record-card:hover .record-image {
  transform: scale(1.03);
}

.record-content {
  padding: 16px !important; /* menos padding en móvil */
}

.record-title {
  font-size: 17px;
  font-weight: 500;
  color: #111;
  margin-bottom: 6px;
  line-height: 1.4;
}

.record-meta {
  font-size: 14px;
  color: #8e8e93;
  letter-spacing: 0.2px;
}

/* Ajustes responsive */
@media (max-width: 768px) {
  .record-card {
    border-radius: 12px;
  }
  .record-content {
    padding: 12px !important;
  }
  .record-title {
    font-size: 15px;
  }
  .record-meta {
    font-size: 13px;
  }
  .record-image {
    height: 160px !important;
  }
}
</style>