<template>
  <v-form v-model="valid">
    <!-- ------------------------------------ MISSION TYPE -------------------------------------------------- -->
    <div class="title font-weight-bold bluePrimary--text">Reward information</div>
    <v-sheet class="py-2 px-4 mt-4 d-flex flex-column flex-sm-row text-subtitle-1" outlined rounded="lg">
      <div class="flex-grow font-weight-bold">
        <div class="neutral-10--text mb-1">Project reward</div>
        <div>{{ vm.projectReward | formatNumber(2) }} {{ vm.tokenName }}</div>
      </div>
      <div class="mx-0 mx-sm-4 my-2 my-sm-0"></div>
      <div class="flex-grow font-weight-bold">
        <div class="neutral-10--text mb-1">Remaining mission</div>
        <div>{{ vm.remainingMission }}</div>
      </div>
    </v-sheet>

    <div class="d-flex flex-column flex-sm-row mt-4">
      <div class="flex-grow">
        <div class="font-weight-bold mb-2">Mission reward<span class="app-red--text">*</span></div>
        <app-text-field
          type="number"
          :value="vm.missionReward"
          @change="vm.updateIatInfo('missionReward', $event)"
          :rules="[$rules.required, $rules.floatNumberOnly, $rules.min(0.001), $rules.max(vm.projectReward)]"
          placeholder="Enter mision reward"
        />
      </div>
      <div class="d-none d-sm-block mx-4"></div>
      <div class="flex-grow">
        <div class="font-weight-bold mb-2">Max participants<span class="app-red--text">*</span></div>
        <app-text-field
          type="number"
          :value="vm.maxParticipants"
          @change="vm.updateIatInfo('maxParticipants', $event)"
          :rules="[$rules.required, $rules.integer, $rules.min(1), $rules.max(100)]"
          placeholder="Enter max participants"
        />
      </div>
    </div>

    <v-sheet class="py-2 px-4 d-flex flex-column flex-sm-row text-subtitle-1 blue-2" rounded="lg">
      <div class="font-weight-bold flex-grow">
        <div class="neutral-10--text mb-2">Personal reward</div>
        <div>{{ vm.personalReward | formatNumber(2) }} {{ vm.tokenName }}</div>
      </div>
      <div class="mx-0 mx-sm-4 my-2 my-sm-0"></div>
      <div class="font-weight-bold flex-grow">
        <div class="neutral-10--text mb-2">Remainning project reward</div>
        <div>{{ vm.remainingProjectReward | formatNumber(2) }} {{ vm.tokenName }}</div>
      </div>
    </v-sheet>
    <!-- ---------------------------------------------------------------------------------------------------- -->
    <v-divider class="dashed-border mt-7" />
    <!-- ---------------------------------------------------------------------------------------------------- -->

    <div class="title font-weight-bold bluePrimary--text mt-7">Mission time</div>
    <app-datetime-picker
      class="mt-4"
      dateLabel="Start date"
      timeLabel="Start time"
      :rules="[$rules.required]"
      :minDate="vm.projectStartDate"
      :maxDate="vm.missionEndDate || vm.projectEndDate"
      :value="vm.missionStartDate"
      @change="vm.updateIatInfo('startDate', $event)"
    />
    <app-datetime-picker
      dateLabel="End date"
      timeLabel="End time"
      :rules="[$rules.required]"
      :disabled="!vm.missionStartDate"
      :minDate="vm.missionStartDate"
      :maxDate="vm.projectEndDate"
      :value="vm.missionEndDate"
      @change="vm.updateIatInfo('endDate', $event)"
    />
    <v-divider class="dashed-border" />
    <div class="d-flex mt-7">
      <v-btn class="flex-grow" depressed outlined height="40" color="neutral-10" @click="goBack">Cancel</v-btn>
      <div class="mx-4" />
      <v-btn
        class="flex-grow text-none"
        :class="{ 'linear-blue--bg white--text': valid }"
        :disabled="!valid"
        height="40"
        depressed
        @click="nextStep"
        >Next</v-btn
      >
    </div>
    <!-- ---------------------------------------------------------------------------------------------------- -->
  </v-form>
</template>

<script lang="ts">
import { RouteName } from '@/router'
import { Observer } from 'mobx-vue'
import { Component, Inject, Vue } from 'vue-property-decorator'
import { NewInAppTrialViewModel } from '../../viewmodels/new-iat-viewmodels'

@Observer
@Component({
  components: {
    'app-datetime-picker': () => import('@/components/app-datetime-picker.vue'),
  },
})
export default class InAppTrialMissionInfo extends Vue {
  @Inject() vm!: NewInAppTrialViewModel

  valid = false

  nextStep() {
    this.vm.changeStep()
  }

  goBack() {
    this.$router.push({
      name: RouteName.PROJECT_DETAIL,
    })
  }
}
</script>

<style scoped></style>
