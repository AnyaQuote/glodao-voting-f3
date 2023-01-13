<template>
  <v-btn icon @click="command.execute()" :class="{ 'primary--text': command.active }">
    <v-icon>mdi-format-bold</v-icon>
  </v-btn>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Command } from '../commands/command.abstract.base'

@Component
export default class BoldCommand extends Vue {
  @Prop({ required: true }) command!: Command
}
</script>

<style scoped></style>
