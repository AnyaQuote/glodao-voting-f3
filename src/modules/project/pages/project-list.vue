<template>
  <div>
    <project-list-header />

    <div class="spacing mx-auto">
      <div v-if="vm.loading" class="px-3 py-3">
        <div class="d-flex mb-3">
          <v-skeleton-loader class="mr-3" type="chip" />
          <v-skeleton-loader type="chip" />
          <v-spacer />
          <v-skeleton-loader type="chip" />
        </div>
        <v-skeleton-loader type="image" />
      </div>

      <empty-list
        v-else-if="!vm.loading && !vm.votingPools.length"
        class="px-3 py-6 pa-sm-6 px-md-3"
        :class="!$vuetify.breakpoint.mdAndUp ? 'neutral-100' : 'mt-98'"
      ></empty-list>

      <div
        v-else
        class="neutral-100 pt-6 pb-4 py-sm-0 my-md-12"
        :class="$vuetify.breakpoint.smAndUp && 'rounded-lg overflow-hidden'"
      >
        <!--------------------------  HEADER -------------------------->
        <div
          class="d-flex flex-column flex-md-row justify-md-space-between align-md-center text-subtitle-2 text-md-h6"
          :class="$vuetify.breakpoint.mdAndUp && 'blue-2'"
        >
          <!-- tab item -->
          <div class="d-flex fill-height cursor-pointer">
            <div
              class="tab-item d-flex justify-center align-center"
              :class="activeClass('bounty')"
              @click="vm.changeFilterdType('bounty')"
            >
              Bounty project
            </div>
            <div
              class="tab-item d-flex justify-center align-center"
              :class="activeClass('launchpad')"
              @click="vm.changeFilterdType('launchpad')"
            >
              Lauchpad project
            </div>
          </div>

          <!-- checkbox -->
          <v-checkbox dense hide-details color="app-blue" class="ma-0 mr-md-6 px-3 py-6 px-md-0 py-md-0">
            <template v-slot:label>
              <span class="text-subtitle-2">Hide rejected project</span>
            </template>
          </v-checkbox>
        </div>

        <!--------------------------  BODY -------------------------->
        <div style="max-width: 960px" class="mx-auto px-4">
          <v-scale-transition leave-absolute v-if="!vm.filteredStatusProjects.length">
            <div class="d-flex flex-column align-center justify-center" style="height: 300px">
              <img width="80" height="80" src="@/assets/icons/project/empty-icon.svg" class="mb-4" />
              <div class="font-weight-bold text-h6">You have no {{ vm.filterType }} projects</div>
              <div class="text-subtitle-1 neutral10--text mb-4">Ready to apply for a new project?</div>
              <v-btn class="linear-blue--bg text-none" height="40" depressed @click="goToNewProject">
                <span class="white--text font-weight-bold">New {{ vm.filterType }} application</span>
              </v-btn>
            </div>
          </v-scale-transition>
          <v-scale-transition leave-absolute v-else>
            <div class="spacing-card py-md-12">
              <project-card v-for="(pool, index) in vm.filteredStatusProjects" :key="index" :pool="pool"></project-card>
            </div>
          </v-scale-transition>
        </div>
      </div>
    </div>

    <!-- <v-container>
      <v-row no-gutters dense> -->
    <!-- ----------------------- LOADING SKELETON --------------------------- -->
    <!-- <div v-if="vm.loading" class="row">
          <div class="col-12 d-flex">
            <v-skeleton-loader class="mr-3" type="chip" />
            <v-skeleton-loader type="chip" />
            <v-spacer />
            <v-skeleton-loader type="chip" />
          </div>
          <v-skeleton-loader class="col-12" type="image" />
        </div> -->
    <!-- ----------------------- EMPTY PROJECT --------------------------- -->
    <!-- <v-col cols="12" v-else-if="!vm.loading && !vm.votingPools.length">
          <div class="row mt-100">
            <div class="col-12 col-md-7">
              <div class="text-h3 mb-9 font-weight-bold">Create the first application</div>
              <div class="neutral10--text text-h6 mb-9">
                Your interested projects should create a profile using this website, create and submit an application.
                GloDAO investors will review and vote for your project on Voting. If your project has enough votes, it
                will be launched on Bounty Huter or Launchpad.
              </div>
              <div v-if="!walletStore.account">
                <ConnectWallet />
              </div>
              <v-btn
                v-else
                class="linear-blue--bg white--text text-none"
                height="fit-content"
                depressed
                @click="goToNewProject"
              >
                <span class="ma-4 font-18 font-weight-bold">New application</span>
              </v-btn>
            </div>
            <v-spacer />
            <div class="col-12 col-md-4 order-first order-md-1">
              <v-img height="324" width="324" src="@/assets/images/project/image-1.png" />
            </div>
          </div>
        </v-col> -->
    <!-- ------------------------ HAS PROJECTS ---------------------------- -->
    <!-- <v-col cols="12" v-else>
          <v-sheet class="rounded-lg neutral-100">
            <v-sheet class="d-flex justify-space-between align-center text-h6 rounded-t-lg blue-2">
              <v-sheet height="58" class="d-flex align-stretch rounded-tl-lg"> -->
    <!--- ==== TAB FILTER ==== -->
    <!-- <v-sheet
                  width="240"
                  class="d-flex align-center justify-center cursor-pointer rounded-tl-lg"
                  :class="activeClass('bounty')"
                  @click="vm.changeFilterdType('bounty')"
                  :light="true"
                >
                  <span class="font-weight-bold">Bounty project</span>
                </v-sheet>
                <v-sheet
                  width="240"
                  class="d-flex justify-center align-center cursor-pointer"
                  :class="activeClass('launchpad')"
                  @click="vm.changeFilterdType('launchpad')"
                >
                  <span class="font-weight-bold">Lauchpad project</span>
                </v-sheet>
              </v-sheet> -->
    <!-- ==== CHECKBOX HIDE REJECTED ==== -->
    <!-- <v-checkbox
                v-model="vm.filterRejected"
                dense
                hide-details
                label="Hide rejected project"
                class="pa-0 ma-0 mr-8 neutral-0--text"
                color="app-blue"
              ></v-checkbox>
            </v-sheet> -->
    <!-- ==== CONTENT DISPLAY ==== -->
    <!-- EMPTY DATA -->
    <!-- <v-scale-transition leave-absolute v-if="!vm.filteredStatusProjects.length">
              <v-sheet class="d-flex flex-column align-center justify-center" height="300">
                <img width="80" height="80" src="@/assets/icons/project/empty-icon.svg" class="mb-4" />
                <div class="font-weight-bold text-h6">You have no {{ vm.filterType }} projects</div>
                <div class="text-subtitle-1 neutral10--text mb-4">Ready to apply for a new project?</div>
                <v-btn class="linear-blue--bg text-none" height="40" depressed @click="goToNewProject">
                  <span class="white--text font-weight-bold">New {{ vm.filterType }} application</span>
                </v-btn>
              </v-sheet>
            </v-scale-transition> -->
    <!-- HAS DATA -->
    <!-- <v-scale-transition leave-absolute v-else>
              <div class="padding-form">
                <project-list-card
                  v-for="(pool, index) in vm.filteredStatusProjects"
                  :key="index"
                  :pool="pool"
                  class="mb-6"
                />
              </div>
            </v-scale-transition>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container> -->
  </div>
</template>

<script lang="ts">
import ConnectWallet from '@/components/connect-wallet.vue'
import { RoutePaths } from '@/router'
import { walletStore } from '@/stores/wallet-store'
import { Observer } from 'mobx-vue'
import { Component, Vue, Provide } from 'vue-property-decorator'
import { ProjectListViewModel } from '../viewmodels/project-list-viewmodel'

@Observer
@Component({
  components: {
    'project-list-header': () => import('../components/project-list-components/project-list-banner.vue'),
    'project-list-card': () => import('../components/project-list-components/project-list-card.vue'),
    'empty-list': () => import('../components/project-list-components/empty-project.vue'),
    'project-card': () => import('../components/project-list-components/project-card.vue'),
    ConnectWallet,
  },
})
export default class ProjectListPage extends Vue {
  @Provide() vm = new ProjectListViewModel()

  walletStore = walletStore
  chainId = process.env.VUE_APP_CHAIN_ID

  goToNewProject() {
    this.$router.push(RoutePaths.new_application)
  }

  get activeClass() {
    return (activeValue: string) =>
      this.vm.filterType === activeValue ? 'blue-diversity neutral-100--text' : 'blue-2 neutral-10--text'
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/breakpoint-custom.scss';

.spacing {
  max-width: 360px;
  @include breakpoint(tablet) {
    max-width: inherit;
  }
  @include breakpoint(desktop) {
    max-width: 1122px;
  }
}

.tab-item {
  height: 37px;
  width: 50%;

  @include breakpoint(desktop) {
    height: 50px;
    width: 241px;
  }
}

.spacing-card {
  display: grid;
  gap: 24px;

  @include breakpoint(tablet) {
    //
  }
}

.mt-98 {
  margin-top: 98px;
}
</style>
