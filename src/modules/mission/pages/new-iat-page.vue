<template>
  <v-container class="mt-5">
    <v-row justify="center" class="mb-100">
      <!-- ---------------- BREADCRUMBS ---------------- -->
      <v-col cols="12">
        <div class="d-flex align-center justify-start mt-4" @click="goBack">
          <v-icon>mdi-arrow-left</v-icon>
          <span class="text-h6 bluePrimary--text cursor-pointer ml-7">Back to project</span>
        </div>
      </v-col>
      <template v-if="vm.loading">
        <v-col cols="12" sm="3">
          <v-skeleton-loader type="image" />
        </v-col>
        <v-col cols="12" sm="9">
          <v-skeleton-loader type="image, image, image" />
        </v-col>
      </template>
      <template v-else>
        <v-col cols="12" sm="3">
          <mission-steppers :currentStep="vm.step" :data="stepData" @onStepChange="onStepChange" />
        </v-col>
        <v-col cols="12" sm="9">
          <v-sheet class="rounded-lg mb-16" outlined elevation="3">
            <div class="py-6 text-center rounded-lg rounded-b-0 blue-2">
              <span class="text-h5 font-weight-bold text-uppercase">Create mission</span>
            </div>
            <v-divider />
            <v-form class="pa-7">
              <!-- ------------------------------------ MISSION FORMS ------------------------------------------------- -->
              <v-slide-y-transition group hide-on-leave>
                <iat-mission-info key="1" v-if="vm.step === 1" />
                <iat-app-info key="2" v-else-if="vm.step === 2" />
                <iat-task-setting key="3" v-else-if="vm.step === 3" />
              </v-slide-y-transition>
              <!-- ---------------------------------------------------------------------------------------------------- -->
            </v-form>
          </v-sheet>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator'
import { Observer } from 'mobx-vue'
import { NewInAppTrialViewModel } from '../viewmodels/new-iat-viewmodels'
import { RouteName } from '@/router'
@Observer
@Component({
  components: {
    'mission-steppers': () => import('../components/common/mission-steppers.vue'),
    'iat-mission-info': () => import('../components/in-app-trial/iat-mission-info.vue'),
    'iat-app-info': () => import('../components/in-app-trial/iat-app-info.vue'),
    'iat-task-setting': () => import('../components/in-app-trial/iat-task-setting.vue'),
  },
})
export default class NewInAppTrialPage extends Vue {
  @Provide() vm = new NewInAppTrialViewModel()

  readonly stepData = ['Mission info', 'App info', 'Task setting']

  onStepChange(step: number) {
    this.vm.changeStep(step)
  }

  goBack() {
    this.$router.push({
      name: RouteName.PROJECT_DETAIL,
    })
  }
}
</script>

<style scoped></style>
