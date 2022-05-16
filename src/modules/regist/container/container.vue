<template>
  <v-container>
    <router-view></router-view>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class RegistContainer extends Vue {}
</script>

<style scoped></style>
