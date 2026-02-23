import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import '@/assets/styles.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'minimalTheme',
    themes: {
      minimalTheme: {
        dark: false,
        colors: {
          background: '#fbfbfd',
          surface: '#ffffff',
          primary: '#111111',
          secondary: '#6e6e73',
          accent: '#0071e3',
          error: '#d32f2f',
          info: '#1976D2',
          success: '#388e3c',
          warning: '#fbc02d',
        },
      },
    },
  },
  defaults: {
    global: {
      ripple: false, // más minimalista
    },
    VBtn: {
      rounded: 'pill',
      elevation: 0,
      style: { textTransform: 'none' },
    },
    VCard: {
      elevation: 2,
      rounded: 'lg',
      style: { transition: 'all 0.25s ease' },
    },
  },
})

createApp(App)
  .use(router)
  .use(vuetify)
  .mount('#app')
