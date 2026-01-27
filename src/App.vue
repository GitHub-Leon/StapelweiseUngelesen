<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <NavBar />
  
  <div class="main-content">
    <RouterView />
  </div>
  
  <Footer />
</template>

<style>
/* Global imports if any specific non-css file needed */
</style>

<style scoped>
.main-content {
  flex: 1;
  width: 100%;
}
</style>
