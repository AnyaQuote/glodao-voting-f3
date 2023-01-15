<template>
  <v-btn v-if="command" icon @click="command.execute()" :class="{ 'bluePrimary--text': command.active }" class="mr-2">
    <v-icon>mdi-format-underline</v-icon>
  </v-btn>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { HandlerBase } from '../commands'

@Component
export default class UnderlineButton extends Vue {
  @Prop({ required: true }) command!: HandlerBase
}
</script>

<style scoped></style>
