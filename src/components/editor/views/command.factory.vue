<template>
  <component :is="command.component" :command="command" />
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Command } from '../commands/command.abstract.base'

@Observer
@Component({
  components: {
    bold: () => import('./bold.comand.vue'),
  },
})
export default class CommandFactory extends Vue {
  @Prop({ required: true }) command!: Command
}
</script>

<style scoped></style>
