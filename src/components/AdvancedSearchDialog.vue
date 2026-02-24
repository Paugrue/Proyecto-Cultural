<template>
  <v-dialog v-model="open" max-width="920" persistent>
    <v-card class="pa-6" elevation="10" rounded="xl">
      <v-card-title class="text-h5 d-flex align-center pb-4">
        <v-icon icon="mdi-magnify-plus" class="me-3" color="primary" />
        Búsqueda Avanzada
      </v-card-title>

      <v-card-text class="pa-0">
        <div class="mb-6">
          <div class="text-subtitle-2 mb-2 text-grey-darken-2 font-weight-bold">Alcance</div>
          <v-btn-toggle v-model="form.scope" color="primary" variant="outlined" mandatory divided class="w-100">
            <v-btn value="records" class="flex-grow-1">Registros</v-btn>
            <v-btn value="collections" class="flex-grow-1">Colecciones</v-btn>
            <v-btn value="all" class="flex-grow-1">Todo</v-btn>
          </v-btn-toggle>
        </div>

        <v-text-field 
          v-model="form.query" 
          label="Término general" 
          variant="outlined" 
          prepend-inner-icon="mdi-text-search"
          class="mb-6" 
          clearable 
          @keyup.enter="emitSearch"
        />

        <v-card variant="flat" border class="pa-4 mb-6" color="grey-lighten-5">
          <div class="d-flex align-center mb-4">
            <span class="text-subtitle-1 font-weight-bold me-4">Filtros específicos</span>
            <v-btn-toggle v-model="form.combine" divided density="compact" mandatory color="secondary">
              <v-btn value="AND">Y</v-btn>
              <v-btn value="OR">O</v-btn>
            </v-btn-toggle>
          </div>
          <div class="d-flex flex-column ga-4">
            <div v-for="(rule, idx) in form.rules" :key="rule.id" class="d-flex flex-wrap align-center ga-2 pb-2">
              <v-select v-model="rule.field" :items="fieldOptions" label="Campo" variant="outlined" density="compact" class="flex-grow-1" hide-details />
              <v-select v-model="rule.operator" :items="operatorOptions" label="Operador" variant="outlined" density="compact" style="max-width: 150px" hide-details />
              <v-text-field v-if="!['isEmpty', 'notEmpty'].includes(rule.operator)" v-model="rule.value" label="Valor" variant="outlined" density="compact" class="flex-grow-1" hide-details @keyup.enter="emitSearch" />
              <v-btn icon="mdi-delete" variant="text" color="error" @click="removeRule(idx)" :disabled="form.rules.length <= 1" />
            </div>
            <v-btn variant="text" color="primary" class="align-self-start" @click="addRule">+ Añadir filtro</v-btn>
          </div>
        </v-card>
      </v-card-text>

      <v-card-actions class="px-0 pt-4">
        <v-btn variant="text" @click="open = false">Cancelar</v-btn>
        <v-spacer />
        <v-btn color="primary" variant="flat" size="large" @click="emitSearch" class="px-10">Buscar ahora</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { reactive, computed, watch } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  fields: Array,
  defaults: Object
})

const emit = defineEmits(['update:modelValue', 'do-advanced-search'])

const open = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})

const form = reactive({
  scope: 'records',
  query: '',
  combine: 'AND',
  rules: [],
  sortBy: 'default',
  sortDir: 'asc'
})

const resetForm = () => {
  form.scope = props.defaults?.scope || 'records'
  form.query = props.defaults?.query || ''
  form.combine = props.defaults?.combine || 'AND'
  if (props.defaults?.rules?.length) {
    form.rules = JSON.parse(JSON.stringify(props.defaults.rules)).map((r, i) => ({ id: Date.now() + i, ...r }))
  } else {
    form.rules = [{ id: Date.now(), field: null, operator: 'contains', value: '' }]
  }
}

watch(() => props.modelValue, (val) => val && resetForm(), { immediate: true })

const fieldOptions = computed(() => props.fields?.map(f => typeof f === 'string' ? { title: f, value: f } : f) || [])
const operatorOptions = [{ title: 'Contiene', value: 'contains' }, { title: 'Igual', value: 'eq' }, { title: 'Vacío', value: 'isEmpty' }]

function addRule() { form.rules.push({ id: Date.now(), field: null, operator: 'contains', value: '' }) }
function removeRule(idx) { form.rules.splice(idx, 1); if (!form.rules.length) addRule(); }

function emitSearch() {
  const payload = {
    ...form,
    // Filtrar reglas incompletas
    rules: form.rules.filter(r => r.field && (['isEmpty', 'notEmpty'].includes(r.operator) || r.value))
  }
  emit('do-advanced-search', payload)
  open.value = false
}
</script>