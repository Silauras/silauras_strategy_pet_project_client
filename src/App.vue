<script setup lang="ts">
import { ref } from "vue";
import GridCanvas from "@/components/GridCanvas.vue";

const zoom = ref(1);

const resources = ref({
  flies: 120,
  shells: 45,
  eggs: 3,
  lilies: 8
});
</script>

<template>
  <div style="position: relative;">
    <GridCanvas @update:zoom="zoom = $event" />
  </div>
  <div
      style="position: absolute; top: 10px; left: 10px; background: rgba(0,0,0,0.6);
         color: white; padding: 6px 10px; border-radius: 4px; font-size: 14px;
         display: flex; flex-direction: column; gap: 6px; min-width: 160px;">
    <div>{{ $t('zoom') }}: {{ zoom.toFixed(2) }}</div>
    <div>🐝 {{ $t('resources.flies') }}: {{ resources.flies }}</div>
    <div>🐚 {{ $t('resources.shells') }}: {{ resources.shells }}</div>
    <div>🥚 {{ $t('resources.eggs') }}: {{ resources.eggs }}</div>
    <div>🌿 {{ $t('resources.lilies') }}: {{ resources.lilies }}</div>
  </div>

</template>

<style scoped>
</style>
