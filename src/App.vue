<template>
  <v-app>
    <glodao-app-bar app />
    <v-main app class="neutral100--background">
      <router-view></router-view>
    </v-main>
    <glodao-footer app />
  </v-app>
</template>

<script>
import { Observer } from 'mobx-vue'
import { Component, Vue } from 'vue-property-decorator'
import { appProvider } from './app-providers'
import { walletStore } from './stores/wallet-store'

@Observer
@Component({
  components: {
    'glodao-app-bar': () => import('@/components/glodao-app-bar.vue'),
    'glodao-footer': () => import('@/components/glodao-footer.vue')
  }
})
export default class App extends Vue {
  mounted() {
    walletStore.start()
    appProvider.setVueRouter(this.$router)
  }
}
</script>

<style lang="scss">
@import './styles/variables.scss';

.debug {
  border: 1px solid red !important;
}
</style>
