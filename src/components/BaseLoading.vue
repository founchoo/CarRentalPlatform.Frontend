<!--加载指示器组件-->

<template>
  <div v-if="isLoading" class="overlay">
    <MDBSpinner class="loader" color="light"/>
  </div>
</template>

<script setup lang="ts">
import { MDBSpinner } from 'mdb-vue-ui-kit'
</script>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    isLoading: {
      type: Boolean,
      required: true
    }
  }
})
</script>

<style scoped>
.overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 99999;
  cursor: not-allowed;
}
.loader {
  position: absolute;
  top: 50%;
  left: 50%;
}
</style>