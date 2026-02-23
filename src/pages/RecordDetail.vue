<template>
  <PageLayout>
    <v-btn to="/record" variant="text" prepend-icon="mdi-arrow-left">Volver</v-btn>

    <h1 class="text-h4 mb-4">{{ record.title }}</h1>

    <v-card class="pa-4">
      <pre>{{ record }}</pre>
    </v-card>
  </PageLayout>
</template>

<script>
import api from '@/services/api'

export default {
  props: ["id"],
  data() {
    return { record: {} }
  },

  async mounted() {
    const { data } = await api.getRecordWithMetadata(this.id)
    this.record = data
  }
}
</script>
