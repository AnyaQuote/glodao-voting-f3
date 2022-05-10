<template>
  <v-app>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import { Observer } from "mobx-vue"
import { Component, Vue } from "vue-property-decorator"
import { appProvider } from "./app-providers"
import { walletStore } from "./stores/wallet-store"

@Observer
@Component({
  components: {}
})
export default class App extends Vue {
  mounted() {
    walletStore.start()
    appProvider.setVueRouter(this.$router)
  }
}
</script>
