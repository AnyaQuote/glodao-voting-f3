<template>
  <v-btn v-if="command" icon @click="command.execute()" :class="{ 'bluePrimary--text': command.active }">
    <v-icon>mdi-format-header-1</v-icon>
  </v-btn>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { HandlerBase } from '../commands'

@Component
export default class HeadingOneButton extends Vue {
  @Prop({ required: true }) command!: HandlerBase
}
</script>

<style scoped></style>
