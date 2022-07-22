<template>
  <div
    class="blue-diversity--text neutral-20 py-2 px-5 mt-1 rounded font-weight-bold"
    style="font-family: 'Courier New', Courier, monospace !important; word-break: break-word"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class CodeContainer extends Vue {}
</script>

<style scoped></style>
