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
        <v-col cols="12" sm="4">
          <v-skeleton-loader type="image" />
        </v-col>
        <v-col cols="12" sm="8">
          <v-skeleton-loader type="image, image, image" />
        </v-col>
      </template>
      <template v-else>
        <v-col cols="12" sm="4">
          <mission-steppers />
        </v-col>
        <v-col cols="12" sm="8">
          <v-sheet class="rounded-lg" outlined elevation="3">
            <div class="py-6 text-center rounded-lg rounded-b-0 blue-2">
              <span class="text-h5 font-weight-bold text-uppercase">Create mission</span>
            </div>
            <v-divider />
            <v-form class="pa-7 d-flex flex-column">
              <!-- ------------------------------------ MISSION TYPE -------------------------------------------------- -->
              <iat-mission-info />
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
    'mission-steppers': () => import('../components/mission-steppers.vue'),
    'iat-mission-info': () => import('../components/in-app-trial/iat-mission-info.vue'),
  },
})
export default class NewInAppTrialPage extends Vue {
  @Provide() vm = new NewInAppTrialViewModel()

  goBack() {
    this.$router.push({
      name: RouteName.PROJECT_DETAIL,
    })
  }
}
</script>

<style scoped></style>
