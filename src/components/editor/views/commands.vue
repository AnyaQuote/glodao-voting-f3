<template>
  <component :is="command.type" :command="command" />
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { HandlerBase } from '../commands'

@Observer
@Component({
  components: {
    bold: () => import('./bold.vue'),
    italic: () => import('./italic.vue'),
    strike: () => import('./strike.vue'),
    underline: () => import('./underline.vue'),
    'heading-one': () => import('./heading-one.vue'),
    'heading-two': () => import('./heading-two.vue'),
    'heading-three': () => import('./heading-three.vue'),
    'embed-youtube': () => import('./embed-youtube.vue'),
    'embed-image': () => import('./embed-image.vue'),
  },
})
export default class CommandFactory extends Vue {
  @Prop({ required: true }) command!: HandlerBase
}
</script>

<style scoped></style>
