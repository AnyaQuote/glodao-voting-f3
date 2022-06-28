<template>
  <div>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on" icon class="rounded-circle px-2 neutral100--bg" elevation="1">
          <v-img contain src="@/assets/icons/voting-home--arrow-out.svg" />
        </v-btn>
      </template>
      Comming soon
    </v-tooltip>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class VotingShareButton extends Vue {}
</script>

<style scoped></style>
