<template>
  <v-app-bar app class="neutral100" fixed hide-on-scroll>
    <div class="d-flex align-center full-width">
      <v-app-bar-nav-icon @click="handleClick"></v-app-bar-nav-icon>
    </div>
  </v-app-bar>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Observer } from 'mobx-vue'

@Observer
@Component({
  components: {},
})
export default class MobileNavigationBar extends Vue {
  @Prop(Boolean) value!: boolean
  handleClick() {
    this.$emit('input', !this.value)
  }
}
</script>

<style scoped></style>
