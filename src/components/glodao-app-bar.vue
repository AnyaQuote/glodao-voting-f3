<template>
  <v-app-bar v-bind="$attrs" v-on="$listeners">
    <div>App bar</div>
  </v-app-bar>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import { Observer } from "mobx-vue"

@Observer
@Component
export default class GLDAppBar extends Vue {}
</script>

<style scoped></style>
