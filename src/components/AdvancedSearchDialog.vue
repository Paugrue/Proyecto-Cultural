<template>
  <v-dialog v-model="open" max-width="920">
    <v-card class="pa-4">
      <v-card-title class="text-h6">Parámetros de búsqueda</v-card-title>

      <v-card-text>
        <v-card class="pa-4 mb-4" variant="tonal">
          <div class="mb-2 text-caption">Alcance</div>
          <v-radio-group v-model="form.scope" inline>
            <v-radio label="Registros" value="records" />
            <v-radio label="Colecciones" value="collections" />
            <v-radio label="Todo" value="all" />
          </v-radio-group>
        </v-card>

        <v-text-field v-model="form.query" label="Buscar" variant="outlined" density="comfortable" class="mb-4" clearable />

        <v-card class="pa-4 mb-4" variant="tonal">
          <div class="d-flex align-center mb-3">
            <span class="me-3 text-subtitle-2">Combinar</span>
            <v-btn-toggle v-model="form.combine" divided density="comfortable" mandatory class="me-4">
              <v-btn value="AND">Y</v-btn>
              <v-btn value="OR">O</v-btn>
            </v-btn-toggle>
            <span class="text-body-2 text-medium-emphasis">
              Selecciona campos de la ontología para afinar la búsqueda.
            </span>
          </div>

          <div class="d-flex flex-column ga-3">
            <div v-for="(rule, idx) in form.rules" :key="rule.id" class="d-flex flex-wrap align-center ga-2">
              <v-select v-model="rule.field" :items="fieldOptions" label="Campo" variant="outlined" density="comfortable" class="rule-field" />
              <v-select v-model="rule.operator" :items="operatorOptions" label="Operador" variant="outlined" density="comfortable" class="rule-operator" />
              <v-text-field v-model="rule.value" label="Valor" variant="outlined" density="comfortable" class="rule-value" />
              <v-btn variant="text" color="error" @click="removeRule(idx)">Eliminar</v-btn>
            </div>

            <div>
              <v-btn variant="outlined" color="black" @click="addRule">Nueva regla</v-btn>
            </div>
          </div>
        </v-card>

        <v-select v-model="form.collection" :items="collectionOptions" label="Colección" variant="outlined" density="comfortable" class="mb-4" clearable />

        <div class="d-flex flex-wrap ga-3 align-center">
          <v-select v-model="form.sortBy" :items="sortOptions" label="Ordenar" variant="outlined" density="comfortable" class="flex-1-1" />
          <v-btn-toggle v-model="form.sortDir" mandatory divided density="comfortable">
            <v-btn value="asc" title="Ascendente">↑</v-btn>
            <v-btn value="desc" title="Descendente">↓</v-btn>
          </v-btn-toggle>
          <v-text-field v-model.number="form.page" type="number" min="1" label="Página" variant="outlined" density="comfortable" style="max-width: 120px;" />
          <v-spacer />
          <v-btn color="black" variant="flat" @click="emitSearch">Buscar</v-btn>
        </div>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn variant="text" @click="open = false">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { reactive, computed } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  fields: { type: Array, default: () => [] },       // [{title,value}] o ['title',...]
  collections: { type: Array, default: () => [] },  // [{title,value}]
  defaults: {
    type: Object,
    default: () => ({
      scope: 'records',
      query: '',
      combine: 'AND',
      rules: [],
      collection: null,
      sortBy: 'default',
      sortDir: 'asc',
      page: 1
    })
  }
})
const emit = defineEmits(['update:modelValue', 'do-advanced-search'])

const open = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v)
})

const form = reactive({
  scope: props.defaults.scope,
  query: props.defaults.query,
  combine: props.defaults.combine,
  rules: props.defaults.rules.length
    ? props.defaults.rules.map((r, i) => ({ id: i + 1, ...r }))
    : [{ id: 1, field: null, operator: 'contains', value: '' }],
  collection: props.defaults.collection,
  sortBy: props.defaults.sortBy,
  sortDir: props.defaults.sortDir,
  page: props.defaults.page
})

const operatorOptions = [
  { title: 'contiene', value: 'contains' },
  { title: 'igual a', value: 'eq' },
  { title: 'empieza por', value: 'startsWith' },
  { title: 'termina en', value: 'endsWith' },
  { title: 'distinto de', value: 'neq' },
  { title: 'vacío', value: 'isEmpty' },
  { title: 'no vacío', value: 'notEmpty' }
]

const fieldOptions = computed(() =>
  props.fields.length
    ? props.fields.map(f => (typeof f === 'string' ? { title: f, value: f } : f))
    : [
        { title: 'Título', value: 'title' },
        { title: 'Autor', value: 'author' },
        { title: 'Fecha', value: 'date' },
        { title: 'Descripción', value: 'description' }
      ]
)

const collectionOptions = computed(() =>
  props.collections.length ? props.collections : [{ title: 'Todas', value: null }]
)

const sortOptions = [
  { title: 'Por defecto', value: 'default' },
  { title: 'Título', value: 'title' },
  { title: 'Fecha', value: 'date' }
]

function addRule() {
  const nextId = (form.rules.at(-1)?.id ?? 0) + 1
  form.rules.push({ id: nextId, field: null, operator: 'contains', value: '' })
}
function removeRule(idx) {
  form.rules.splice(idx, 1)
  if (form.rules.length === 0) addRule()
}

function emitSearch() {
  const payload = {
    scope: form.scope,
    query: form.query?.trim() || '',
    combine: form.combine,
    rules: form.rules
      .filter(r => r.field && (r.value?.toString().length || ['isEmpty','notEmpty'].includes(r.operator)))
      .map(({ id, ...r }) => r),
    collection: form.collection,
    sortBy: form.sortBy,
    sortDir: form.sortDir,
    page: Math.max(1, Number(form.page) || 1)
  }
  emit('do-advanced-search', payload)
  open.value = false
}
</script>

<style scoped>
.rule-field { min-width: 220px; }
.rule-operator { min-width: 180px; }
.rule-value { min-width: 240px; }
.v-card { border-radius: 16px; }
</style>