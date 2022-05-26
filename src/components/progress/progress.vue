<template>
  <v-sheet height="4" class="rounded-pill d-flex align-stretch lighten-2" style="background: #c4c4c4 !important">
    <v-sheet :width="`${value}%`" class="rounded-pill blue-diversity transform"></v-sheet>
  </v-sheet>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class extends Vue {
  @Prop({ default: 0 }) value!: number
}
</script>

<style scoped></style>
