<template>
  <v-sheet height="4" class="rounded-pill d-flex align-stretch grey lighten-2">
    <v-sheet :width="`${value}%`" class="rounded-pill blue transform"></v-sheet>
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
