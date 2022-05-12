<template>
  <v-footer v-bind="$attrs" v-on="$listeners">
    <div>Footer</div>
  </v-footer>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"

@Component
export default class GlodaoFooter extends Vue {}
</script>

<style scoped></style>
