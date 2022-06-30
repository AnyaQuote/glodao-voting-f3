<template>
  <div>
    <!-- ------------------------------------ MISSION TYPE -------------------------------------------------- -->
    <div class="title font-weight-bold bluePrimary--text">Reward information</div>
    <v-sheet class="py-2 px-4 d-flex text-subtitle-1" outlined rounded="lg">
      <div class="flex-grow-1 font-weight-bold">
        <div class="neutral-10--text mb-2">Project reward</div>
        <div>100.000.00 $HWD</div>
      </div>
      <div class="mx-6"></div>
      <div class="flex-grow-1 font-weight-bold">
        <div class="neutral-10--text mb-2">Remaining mission</div>
        <div>2/5</div>
      </div>
    </v-sheet>

    <div class="d-flex mt-4">
      <div class="flex-grow-1">
        <span class="font-weight-bold">Mission reward</span>
        <app-text-field placeholder="Enter mision reward" />
      </div>
      <div class="mx-6"></div>
      <div class="flex-grow-1">
        <span class="font-weight-bold">Max participants</span>
        <app-text-field placeholder="Enter mision reward" />
      </div>
    </div>

    <v-sheet class="py-2 px-4 d-flex text-subtitle-1 blue-2" rounded="lg">
      <div class="font-weight-bold app-flex-grow">
        <div class="neutral-10--text mb-2">Personal eward</div>
        <div>100 $HWD</div>
      </div>
      <div class="mx-6"></div>
      <div class="font-weight-bold app-flex-grow">
        <div class="neutral-10--text mb-2">Remaining project reward</div>
        <div>2/5</div>
      </div>
    </v-sheet>
    <!-- ---------------------------------------------------------------------------------------------------- -->
    <v-divider class="dashed-border mt-7" />
    <!-- ---------------------------------------------------------------------------------------------------- -->

    <div class="title font-weight-bold bluePrimary--text mt-7">Mission time</div>
    <app-datetime-picker class="mt-4" dateLabel="Start date" timeLabel="Start time" />
    <app-datetime-picker class="mt-4" dateLabel="End date" timeLabel="End time" />
    <v-divider class="dashed-border" />
    <div class="d-flex mt-7">
      <v-btn class="flex-grow-1" depressed outlined height="40" color="neutral-10">Cancel</v-btn>
      <div class="mx-6" />
      <v-btn class="flex-grow-1 text-none linear-blue--bg white--text" height="40" depressed>Next</v-btn>
    </div>
    <!-- ---------------------------------------------------------------------------------------------------- -->
  </div>
</template>

<script lang="ts">
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
}
</script>

<style scoped></style>
