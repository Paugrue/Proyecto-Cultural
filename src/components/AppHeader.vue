<template>
  <v-app-bar
    flat
    class="nav-minimal px-8"
    height="72"
  >
    <!-- Botón hamburguesa 100% visible -->
    <v-btn
      icon
      class="d-md-none menu-trigger"
      @click="drawer = !drawer"
    >
      <!-- SVG que NO puede ser hecho transparente por estilos externos -->
      <svg 
        width="28" 
        height="28" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="#111" 
        stroke-width="2.5" 
        stroke-linecap="round" 
        stroke-linejoin="round"
      >
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </v-btn>

    <v-spacer />

    <div class="nav-center d-none d-md-flex">
      <router-link to="/inicio" class="menu-link">Inicio</router-link>
      <router-link to="/record" class="menu-link">Registros</router-link>
      <router-link to="/collection" class="menu-link">Colecciones</router-link>
      <router-link to="/pages" class="menu-link">Páginas</router-link>
    </div>

    <v-spacer />
  </v-app-bar>

  <v-navigation-drawer
    v-model="drawer"
    temporary
    location="left"
  >
    <v-list>
      <v-list-item
        v-for="link in links"
        :key="link.name"
        @click="drawer = false"
      >
        <router-link :to="link.path" class="menu-link">
          {{ link.name }}
        </router-link>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      links: [
        { name: 'Inicio', path: '/inicio' },
        { name: 'Registros', path: '/record' },
        { name: 'Colecciones', path: '/collection' },
        { name: 'Páginas', path: '/pages' }
      ]
    };
  }
}
</script>

<style scoped>
.nav-minimal {
  background-color: rgba(255, 255, 255, 0.85) !important;
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

/* Asegura visibilidad del botón */
.menu-trigger {
  opacity: 1 !important;
  z-index: 1000 !important;
}

.nav-center {
  display: flex;
  align-items: center;
  gap: 36px;
}

.menu-link {
  font-weight: 500;
  font-size: 15px;
  color: #555;
  text-decoration: none;
  position: relative;
  transition: all 0.2s ease;
}

.menu-link:hover {
  color: #111;
}

.menu-link::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -6px;
  width: 0%;
  height: 1px;
  background-color: #111;
  transition: width 0.25s ease;
}

.menu-link:hover::after {
  width: 100%;
}
</style>