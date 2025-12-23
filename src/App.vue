<script setup lang="ts">
import AppHeader from './layouts/header/index.vue'
import AppSidebar from './layouts/sidebar/index.vue'
import CandidateView from './views/candidate/CandidateView.vue'
</script>

<template>
  <div class="container">
    <AppHeader />
    <div class="app__body">
      <AppSidebar />
      <div class="main">
        <CandidateView />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* App Container */
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: #f5f5f5;
}
/* App Body */

.app__body {
  display: flex;
  flex: 1;
  overflow: hidden;
}
</style>
