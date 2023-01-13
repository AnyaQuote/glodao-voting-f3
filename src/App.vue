<template>
  <v-app>
    <twitter-login-dialog />
    <attach-wallet-dialog />
    <navigation-drawer v-model="drawer" />
    <navigation-bar v-if="$vuetify.breakpoint.mdAndUp" />
    <mobile-navigation-bar v-if="$vuetify.breakpoint.smAndDown" v-model="drawer" />
    <v-main class="neutral15">
      <router-view></router-view>
    </v-main>
    <v-divider></v-divider>
    <app-footer />
    <snack-bar />
    <alert />
    <global-loading />
    <confirm-dialog />
  </v-app>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Provide, Vue } from 'vue-property-decorator'
import { AppProvider } from './app-providers'

@Observer
@Component({
  components: {
    'twitter-login-dialog': () => import('@/components/twitter-login/twitter-login-dialog.vue'),
    'attach-wallet-dialog': () => import('@/components/attach-wallet/attach-wallet-dialog.vue'),
    'confirm-dialog': () => import('@/components/confirm-dialog/confirm-dialog.vue'),
  },
})
export default class App extends Vue {
  @Provide() providers = new AppProvider(this.$router)
  wallet = this.providers.wallet
  drawer = false

  mounted() {
    this.providers.wallet.start()
  }

  changeTheme() {
    this.providers.toggleLightMode(this.$vuetify)
  }

  toggleDrawer(state: boolean) {
    this.drawer = state
  }
}
</script>
<style lang="scss">
// a {
//   text-decoration: none;
// }
.container {
  padding: 0 16px !important;
  max-width: 1123px !important;
}
.position-relative {
  position: relative !important;
}

.header-title {
  line-height: 130%;
  font-size: 20px;

  @include breakpoint(tablet) {
    font-size: 28px;
  }
}

.header-subtitle {
  line-height: 130%;
  font-size: 16px;

  @include breakpoint(tablet) {
    font-size: 24px;
  }
}

.font-weight-400 {
  font-weight: 400 !important;
}
.font-weight-600 {
  font-weight: 600 !important;
}
.font-18 {
  font-size: 18px !important;
  line-height: 24px !important;
}
.font-28 {
  font-size: 28px !important;
  line-height: 36.4px !important;
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

.v-sheet {
  background-color: var(--v-neutral-100-base) !important;
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

.v-pagination .v-icon.v-icon {
  font-size: em(16);
}
.v-pagination__item {
  font-size: em(20) !important;
  background: var(--v-neutral-100-base) !important;
  &.v-pagination__item--active {
    color: var(--v-neutral20-base) !important;
    &.primary {
      background-color: var(--v-blue-diversity-base) !important;
    }
  }
}
.v-pagination__navigation {
  background: var(--v-neutral-100-base) !important;
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
.absolute-space {
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
}
.p-relative {
  position: relative !important;
}
.cursor-pointer {
  cursor: pointer !important;
}

.overflow-hidden {
  overflow: hidden !important;
}

.two-line {
  word-break: break-word;
  text-overflow: hidden;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.bullet {
  display: list-item;
  list-style-type: disc;
  list-style-position: inside;
}

.black-opaque--bg {
  background-color: rgba(#101010, 0.5) !important;
}

.dashed-border {
  border-style: dashed !important;
}

.flex-grow {
  flex: 1 1 0px !important;
}

.wspace-preline {
  white-space: pre-line;
}

/* ----------------------------------------------------------------------------------------------- */
.debug {
  border: 1px solid red !important;
}

.app-slide-group {
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
    }
    .v-slide-group__next {
      display: block;
      top: 50%;
      right: -20px;
      z-index: 1;
      position: absolute;
      margin-top: em(-60);
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

.input-min-height .v-input__control {
  min-height: 18px !important;
}

.v-picker {
  .v-picker__body {
    background: var(--v-neutral100-base) !important;
    .v-picker__title__btn {
      color: var(--v-neutral-0-base) !important;
    }
  }
  .v-time-picker-clock {
    background: var(--v-neutral100-base) !important;
  }
}
.v-autocomplete__content div div {
  background: var(--v-neutral-20-base) !important;
  .v-list-item__action .v-simple-checkbox {
    background: transparent !important;
  }
}

.v-slide-group__prev {
  display: none !important;
}
</style>
