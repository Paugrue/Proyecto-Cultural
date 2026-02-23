<template>
  <v-card
    class="record-card"
    @click="$router.push('/record/' + record.id)"
  >
    <v-img
      :src="record.thumbnail"
      height="200"
      cover
      class="record-image"
    />

    <v-card-text class="record-content">
      <div class="record-title">
        {{ record.title }}
      </div>

      <div class="record-meta">
        {{ record.collections_titles?.join(', ') }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    record: Object
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
}

.record-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 28px rgba(0,0,0,0.06);
}

/* Imagen más limpia */
.record-image {
  filter: saturate(102%) contrast(101%);
  transition: transform 0.4s ease;
}

.record-card:hover .record-image {
  transform: scale(1.03);
}

/* Contenido */
.record-content {
  padding: 24px !important;
}

/* Título más editorial */
.record-title {
  font-size: 17px;
  font-weight: 500;
  color: #111;
  margin-bottom: 6px;
  line-height: 1.4;
}

/* Meta más neutro */
.record-meta {
  font-size: 14px;
  color: #8e8e93;
  letter-spacing: 0.2px;
}
</style>
