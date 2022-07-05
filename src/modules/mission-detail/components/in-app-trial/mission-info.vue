<template>
  <div>
    <div class="d-flex align-center flex-wrap">
      <!-- ============================== PROJECT LOGO AND NAME END ============================== -->
      <v-avatar size="76">
        <v-img :src="vm.projectLogo" />
      </v-avatar>
      <div class="d-flex flex-column justify-space-between ml-2 ml-sm-4 flex-grow-1">
        <span class="text-h5 font-weight-bold">{{ vm.missionName }}</span>
        <span class="font-weight-bold neutral-10--text">
          {{ vm.missionStartDate | datetime }} - {{ vm.missionEndDate | datetime }}
        </span>
      </div>
      <v-sheet color="blue-2" class="mt-2 mt-sm-0 blue-diversity--text font-weight-600 pa-2" rounded>
        App Trial Mission
      </v-sheet>
    </div>
    <!-- ============================== PROJECT LOGO AND NAME END =============================== -->

    <!-- ============================== MISSION APP LOGO AND MISSION REWARD INFO END ============ -->
    <div class="mt-6 d-flex flex-column flex-sm-row">
      <div class="flex-grow">
        <v-sheet height="250" class="black rounded-lg overflow-hidden">
          <v-img height="100%" :aspect-ratio="1.5" :src="vm.missionAppLogo" />
        </v-sheet>
      </div>
      <div class="my-1 my-sm-0 ml-0 mx-sm-2" />
      <div class="flex-grow">
        <v-sheet class="px-4 py-8 d-flex flex-column fill-height" rounded="lg" outlined>
          <span class="text-center text-h5 font-weight-600"
            >{{ vm.missionReward | formatNumber(2) }} {{ vm.missionTokenName }}</span
          >
          <span class="text-center">Total reward</span>
          <!-- <div class="mt-6 d-flex justify-space-between">
            <span>Priority (30%):</span>
            <span class="font-weight-600">0</span>
          </div>
          <div class="d-flex justify-space-between">
            <span>Community (70%):</span>
            <span class="font-weight-600">0</span>
          </div>
          <div class="d-flex justify-space-between">
            <span>Max priority participants:</span>
            <span class="font-weight-600">0</span>
          </div> -->
        </v-sheet>
      </div>
    </div>
    <!-- ============================== MISSION APP LOGO AND MISSION REWARD INFO END ============ -->
  </div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Inject, Vue } from 'vue-property-decorator'
import { InAppTrialDetailViewModel } from '../../viewmodels/iat-detail-viewmodel'

@Observer
@Component
export default class InAppTrialMissionInfo extends Vue {
  @Inject() vm!: InAppTrialDetailViewModel
}
</script>

<style scoped></style>
