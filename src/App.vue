<template>
  <v-app>
    <navigation-drawer />
    <navigation-bar v-if="$vuetify.breakpoint.mdAndUp" />
    <mobile-navigation-bar v-if="$vuetify.breakpoint.smAndDown" />
    <v-main class="neutral15">
      <router-view></router-view>
    </v-main>
    <v-divider></v-divider>
    <app-footer />
    <snack-bar />
    <alert />
    <global-loading />
  </v-app>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Provide, Vue, Watch } from 'vue-property-decorator'
import { AppProvider, appProvider } from './app-providers'
// import { walletStore } from './stores/wallet-store'
import { localdata } from '@/helpers/local-data'
import { get } from 'lodash'

@Observer
@Component({
  components: {
    'twitter-login-dialog': () => import('@/components/twitter-login-dialog.vue'),
  },
})
export default class App extends Vue {
  @Provide() providers: AppProvider = appProvider
  // wallet = this.providers.wallet

  @Watch('$route.query', { immediate: true }) onRefChanged(val: string) {
    if (val) {
      const ref = get(val, 'ref', '')
      if (ref && !localdata.referralCode) localdata.referralCode = ref
    }
  }

  mounted() {
    this.providers.router = this.$router
    // walletStore.start()
  }

  drawer = false

  changeTheme() {
    this.providers.toggleLightMode(this.$vuetify)
  }
}
</script>
<style lang="scss">
.container {
  padding: 0 16px !important;
  max-width: 1130px;
}
.theme--dark {
  .date-picker-dialog-custom {
    .v-date-picker-header {
      background-color: var(--v-neutral100-base);
    }
    .v-date-picker-table {
      background-color: var(--v-neutral100-base);
    }
  }
}
.theme--light {
  .filter-neutral10 {
    filter: invert(40%) sepia(9%) saturate(256%) hue-rotate(178deg) brightness(93%) contrast(93%);
  }
}
.theme--dark {
  .filter-neutral10 {
    filter: invert(87%) sepia(10%) saturate(123%) hue-rotate(179deg) brightness(86%) contrast(85%);
  }
}
.theme--light {
  .filter-bluePrimary {
    filter: invert(35%) sepia(67%) saturate(4915%) hue-rotate(199deg) brightness(98%) contrast(98%);
  }
}
.theme--dark {
  .filter-bluePrimary {
    filter: invert(61%) sepia(60%) saturate(1070%) hue-rotate(141deg) brightness(105%) contrast(105%);
  }
}
.theme--dark {
  .task-detail-twitter-share-data-table {
    &.v-data-table {
      thead {
        background: var(--v-neutral20-base);
      }
    }
  }
}
.neutral100--bg {
  background-color: var(--v-neutral100-base) !important;
}
.v-sheet--outlined {
  border: thin solid var(--v-neutral20-base);
}

.theme--dark {
  .v-sheet--outlined {
    border: thin solid var(--v-neutral20-base) !important;
  }
}
.linear-blue--bg {
  background-image: linear-gradient(to right, #0276f0, #0096ff, #00b3ff, #00cdff, #00e5ff);
}
.linear-blue-light--bg {
  background: linear-gradient(90deg, rgba(2, 118, 240, 0.2) 0%, rgba(0, 229, 255, 0.2) 113.65%);
}
.fill-width {
  width: 100% !important;
}
.fill-height {
  height: 100% !important;
}
.container {
  max-width: 1090px !important;
}
.v-pagination .v-icon.v-icon {
  font-size: em(16);
}
.v-pagination__item {
  font-size: em(20) !important;
}

// .v-application {
//   a {
//     text-decoration: none;
//     color: inherit;
//   }
// }
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: em(10);
  background-color: transparent !important;
}
::-webkit-scrollbar {
  width: em(6);
  height: em(6);
  background-color: transparent !important;
}
::-webkit-scrollbar-thumb {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: em(10);
  background-color: var(--v-subtitle-base);
}
.transparent--bg {
  background: transparent !important;
}
.bluePrimary--border {
  border: thin solid var(--v-bluePrimary-base) !important;
}
.redSenamatic--border {
  border: thin solid var(--v-redSenamatic-base) !important;
}
.p-absolute {
  position: absolute !important;
}
.p-relative {
  position: relative !important;
}
.cursor-pointer {
  cursor: pointer;
}

/* ----------------------------------------------------------------------------------------------- */
.debug {
  border: 1px solid red !important;
}

.app-slide-group {
  .active {
    border-radius: em(8);
    padding: em(28) em(8);
    border: em(1) solid var(--v-bluePrimary-base);
    background-color: var(--v-neutral100-base) !important;
  }
  .v-slide-group {
    position: relative;
    z-index: 0;
    .v-slide-group__prev {
      display: block;
      position: absolute;
      top: 50%;
      left: -20px;
      z-index: 1 !important;
      margin-top: em(-60);
      :not(.v-slide-group__prev--disabled) {
        @extend .active;
      }
    }
    .v-slide-group__next {
      display: block;
      top: 50%;
      right: -20px;
      z-index: 1;
      position: absolute;
      margin-top: em(-60);
      :not(.v-slide-group__next--disabled) {
        @extend .active;
      }
    }
  }
}

.v-input {
  .v-input__control {
    .v-input__slot {
      background: transparent !important;
    }
  }
}

.v-sheet {
  background: transparent !important;
}
</style>
