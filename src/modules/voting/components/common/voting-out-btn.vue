<template>
  <v-btn v-bind="$attrs" v-on="$listeners" icon class="rounded-circle white px-2">
    <v-img contain src="@/assets/icons/voting-home--arrow-out.svg" />
  </v-btn>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class VotingOutBtn extends Vue {}
</script>

<style scoped></style>
