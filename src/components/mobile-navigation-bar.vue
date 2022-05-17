<template>
  <v-app-bar app class="neutral100" fixed hide-on-scroll>
    <div class="d-flex align-center full-width">
      <v-app-bar-nav-icon
        @click="wallet.setNavigationDrawer(true)"
        style="z-index: 10; height: 46px; width: 46px"
      ></v-app-bar-nav-icon>
      <div class="full-width d-flex justify-center"></div>
    </div>
  </v-app-bar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Observer } from 'mobx-vue'

@Observer
@Component({
  components: {},
})
export default class MobileNavigationBar extends Vue {
  openLink(url) {
    window.open(url, '_blank')
  }
  backToHome() {
    this.$router.push('/')
  }
}
</script>

<style scoped>
.navigation-bar {
  background: #234973 !important;
}
.connect-wallet {
  border: 1px solid #ffffff;
  box-sizing: border-box;
}
</style>
