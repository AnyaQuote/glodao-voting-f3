<template>
  <div>
    <v-img class="blue mb-12" height="216" src="@/assets/images/project-banner-background.png">
      <v-sheet class="transparent--bg px-4 text-h3 fill-height d-flex align-end mx-auto" max-width="1090">
        <span class="mb-12 font-weight-bold white--text">Your project</span>
      </v-sheet>
    </v-img>
    <v-container>
      <router-view class="mb-15"></router-view>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Container extends Vue {}
</script>

<style lang="scss" scoped>
@import '@/styles/breakpoint-custom.scss';
.custom-left-margin {
  margin-left: 20px;
  @include breakpoint(desktop) {
    transform: translate(40%);
  }
}
</style>
