<template>
  <div></div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Vue } from 'vue-property-decorator'

@Observer
@Component
export default class extends Vue {}
</script>

<style scoped></style>
