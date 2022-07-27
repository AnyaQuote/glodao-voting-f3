<template>
  <div>
    <banner />
    <v-container>
      <v-row no-gutters>
        <!-- --------------------------------------------------------------------------------------------------- -->
        <v-col cols="12" class="my-8" :class="!$vuetify.breakpoint.mobile && 'my-15'">
          <div :style="`max-width: ${$vuetify.breakpoint.mobile ? '360' : '906'}px`" class="mx-auto">
            <div class="font-18 font-weight-bold text-center mb-9" :class="!$vuetify.breakpoint.mobile && 'text-h5'">
              What type of project do you want to launch on GLODAO?
            </div>
            <v-row no-gutters>
              <v-col
                :cols="$vuetify.breakpoint.mobile ? '12' : '6'"
                :class="$vuetify.breakpoint.mobile ? 'mb-4' : 'pl-3'"
              >
                <div class="pa-6 neutral-100 rounded-lg" @click="openLaunchpadForm">
                  <v-img
                    :max-height="$vuetify.breakpoint.mobile ? '26' : '48'"
                    :max-width="$vuetify.breakpoint.mobile ? '26' : '48'"
                    :src="require('@/assets/icons/new-project-rocket-icon.svg')"
                  />
                  <div class="font-18 my-3 font-weight-bold" :class="!$vuetify.breakpoint.mobile && 'text-h5 my-5'">
                    Launchpad Hunter
                  </div>
                  <div class="font-weight-regular" :class="$vuetify.breakpoint.mobile && 'text-subtitle-2'">
                    Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat
                    duis enim velit mollit.
                  </div>
                </div></v-col
              >
              <v-col
                :cols="$vuetify.breakpoint.mobile ? '12' : '6'"
                :class="$vuetify.breakpoint.mobile ? 'mb-4' : 'pr-3'"
              >
                <div class="pa-6 neutral-100 rounded-lg" @click="openBountyForm">
                  <v-img
                    :max-height="$vuetify.breakpoint.mobile ? '26' : '48'"
                    :max-width="$vuetify.breakpoint.mobile ? '26' : '48'"
                    src="@/assets/icons/bulleyes.svg"
                  />
                  <div class="font-18 my-3 font-weight-bold" :class="!$vuetify.breakpoint.mobile && 'text-h5 my-5'">
                    Bounty Hunter
                  </div>
                  <div class="font-weight-regular" :class="$vuetify.breakpoint.mobile && 'text-subtitle-2'">
                    Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat
                    duis enim velit mollit.
                  </div>
                </div>
              </v-col>
            </v-row>
          </div>
        </v-col>
        <!-- --------------------------------------------------------------------------------------------------- -->
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { AppProvider } from '@/app-providers'
import { snackController } from '@/components/snack-bar/snack-bar-controller'
import { RoutePaths } from '@/router'
import { walletStore } from '@/stores/wallet-store'
import { Component, Vue, Inject, Provide } from 'vue-property-decorator'
import { NewProjectViewModel } from '../viewmodels/new-project-viewmodel'

@Component({
  components: {
    banner: () => import('../components/common/banner.vue'),
  },
})
export default class ProjectRegist extends Vue {
  @Inject() providers!: AppProvider
  @Provide() vm = new NewProjectViewModel()

  walletStore = walletStore

  openBountyForm() {
    try {
      this.providers.router.push(RoutePaths.new_bounty_application)
    } catch (error) {
      snackController.error(error as string)
    }
  }

  openLaunchpadForm() {
    this.providers.router.push(RoutePaths.new_launchpad_application)
  }
}
</script>

<style lang="scss" scoped>
.mb-120 {
  margin-bottom: em(120);
}
.pt-72 {
  padding-top: em(72);
}
</style>
