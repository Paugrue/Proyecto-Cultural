<template>
  <v-app-bar
    flat
    class="nav-minimal px-8"
    height="72"
  >
    <v-spacer />

    <div class="nav-center">
      <router-link to="/inicio" class="menu-link">Inicio</router-link>
      <router-link to="/record" class="menu-link">Registros</router-link>
      <router-link to="/collection" class="menu-link">Colecciones</router-link>
      <router-link to="/pages" class="menu-link">Páginas</router-link>
    </div>

    <v-spacer />
  </v-app-bar>
</template>

<style scoped>
.nav-minimal {
  background-color: rgba(255, 255, 255, 0.85) !important;
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

/* contenedor central */
.nav-center {
  display: flex;
  align-items: center;
  gap: 36px;
}

/* enlaces */
.menu-link {
  font-weight: 500;
  font-size: 15px;
  color: #555;
  text-decoration: none;
  letter-spacing: 0.2px;
  position: relative;
  transition: all 0.2s ease;
}

/* hover elegante */
.menu-link:hover {
  color: #111;
}

/* subrayado minimal animado */
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
