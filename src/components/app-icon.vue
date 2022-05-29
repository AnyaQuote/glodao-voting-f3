<template>
  <div>
    <v-avatar v-if="iconFromLink" v-bind="$attrs" v-on="$listeners">
      <v-img :src="source" />
    </v-avatar>
    <v-icon v-else v-bind="$attrs" v-on="$listeners" v-html="source"></v-icon>
  </div>
</template>

<script lang="ts">
import { URL } from 'url'
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class extends Vue {
  @Prop(String) src!: string

  iconFromLink = true

  get source() {
    if (this.src.includes('mdi') || this.src.includes('fa')) {
      // is material design icon or fontawsome icon
      this.iconFromLink = false
      return this.src
    } else {
      return ''
    }
  }
}
</script>

<style lang="scss" scoped></style>
