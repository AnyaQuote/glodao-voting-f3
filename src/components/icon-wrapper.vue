<template>
  <v-avatar v-if="iconFromLink" v-bind="$attrs" v-on="$listeners">
    <v-img :src="source" />
  </v-avatar>
  <v-icon v-else v-bind="$attrs" v-on="$listeners" v-html="source"></v-icon>
</template>

<script lang="ts">
import { URL } from 'url'
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'

@Component
export default class extends Vue {
  @Prop(String) src!: string

  iconFromLink = true
  // source = ''

  // @Watch('src', { immediate: true })
  // onSrcChange(value) {
  //   console.log(value)
  //   this.source = value
  // }

  get source() {
    if (this.src.includes('mdi') || this.src.includes('fa')) {
      // is material design icon or fontawsome icon
      this.iconFromLink = false
      return this.src
    } else {
      this.iconFromLink = true
      try {
        // is absolute path (URL, https, http)
        new URL(this.src)
        return this.src
      } catch (_) {
        // is relative path
        console.log('this.src:::', this.src)
        return this.src
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
