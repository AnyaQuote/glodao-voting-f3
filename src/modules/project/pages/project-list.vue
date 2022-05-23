<template>
  <div>
    <project-list-header />

    <v-container>
      <v-row no-gutters dense>
        <!-- ----------------------- LOADING SKELETON --------------------------- -->
        <div v-if="vm.loading" class="row">
          <div class="col-12 d-flex">
            <v-skeleton-loader class="mr-3" type="chip" />
            <v-skeleton-loader type="chip" />
            <v-spacer />
            <v-skeleton-loader type="chip" />
          </div>
          <v-skeleton-loader class="col-12" type="image" />
        </div>
        <!-- ----------------------- EMPTY PROJECT --------------------------- -->
        <v-col cols="12" v-else-if="!vm.loading && !vm.projects.length">
          <div class="row mt-100">
            <div class="col-12 col-md-7">
              <div class="text-h3 mb-9 font-weight-bold">Create the first application</div>
              <div class="neutral10--text text-h6 mb-9">
                Your interested projects should create a profile using this website, create and submit an application.
                GloDAO investors will review and vote for your project on Voting. If your project has enough votes, it
                will be launched on Bounty Huter or Launchpad.
              </div>
              <v-btn
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
        </v-col>
        <!-- ------------------------ HAS PROJECTS ---------------------------- -->
        <v-col cols="12" v-else class="rounded-lg neutral100--bg" outlined>
          <v-sheet class="d-flex justify-space-between align-center text-h6 rounded-t-lg blue lighten-1">
            <v-sheet height="58" class="d-flex align-stretch">
              <!--- ==== TAB FILTER ==== -->
              <v-sheet
                width="240"
                class="d-flex align-center justify-center rounded-tl-lg cursor-pointer"
                :class="activeClass('bounty')"
                @click="vm.changeFilterdType('bounty')"
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
            </v-sheet>
            <!-- ==== CHECKBOX HIDE REJECTED ==== -->
            <v-checkbox
              v-model="vm.filterRejected"
              dense
              hide-details
              label="Hide rejected project"
              class="pa-0 ma-0 mr-8"
              color="app-blue"
            ></v-checkbox>
          </v-sheet>
          <!-- ==== CONTENT DISPLAY ==== -->
          <!-- EMPTY DATA -->
          <v-scale-transition leave-absolute v-if="!vm.filteredStatusProjects.length">
            <v-sheet class="d-flex flex-column align-center justify-center" height="300">
              <img width="80" height="80" src="@/assets/icons/project/empty-icon.svg" class="mb-4" />
              <div class="font-weight-bold text-h6">You have no {{ vm.filterType }} projects</div>
              <div class="text-subtitle-1 neutral10--text mb-4">Ready to apply for a new project?</div>
              <v-btn class="linear-blue--bg text-none" height="40" depressed @click="goToNewProject">
                <span class="white--text font-weight-bold">New {{ vm.filterType }} application</span>
              </v-btn>
            </v-sheet>
          </v-scale-transition>
          <!-- HAS DATA -->
          <v-scale-transition leave-absolute v-else>
            <div class="padding-form">
              <project-list-card
                v-for="(pool, index) in vm.filteredStatusProjects"
                :key="index"
                :pool="pool"
                class="mb-6"
              />
            </div>
          </v-scale-transition>
        </v-col>
        <!-- ------------------------------------------------------------------ -->
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { RoutePaths } from '@/router'
import { Component, Vue, Provide } from 'vue-property-decorator'
import { ProjectListViewModel } from '../viewmodels/project-list-viewmodel'

@Component({
  components: {
    'project-list-header': () => import('../components/project-list-components/project-list-banner.vue'),
    'project-list-card': () => import('../components/project-list-components/project-list-card.vue'),
  },
})
export default class ProjectListPage extends Vue {
  @Provide() vm = new ProjectListViewModel()

  goToNewProject() {
    this.$router.push(RoutePaths.new_application)
  }

  get activeClass() {
    return (activeValue: string) => (this.vm.filterType === activeValue ? 'app-blue white--text' : 'app-blue lighten-1')
  }
}
</script>

<style lang="scss" scoped>
.mt-100 {
  margin-top: 100px;
}
.padding-form {
  padding: 48px 93.5px;
}
</style>
