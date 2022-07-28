<template>
  <v-sheet class="neutral100--bg rounded-lg pb-7" outlined
    ><div class="py-6 text-center rounded-lg rounded-b-0 blue-2">
      <span class="text-h5 font-weight-bold text-uppercase">Create mission</span>
    </div>
    <v-divider />
    <div class="px-4 mt-7">
      <v-skeleton-loader class="mb-7" type="image" height="80" />
      <v-skeleton-loader class="mb-7" type="image" height="120" />
      <v-skeleton-loader class="mb-7" type="image" height="80" />
      <v-skeleton-loader class="mb-7" type="image" height="80" />
      <v-skeleton-loader type="image" height="80" />
    </div>
  </v-sheet>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class extends Vue {}
</script>

<style scoped></style>
