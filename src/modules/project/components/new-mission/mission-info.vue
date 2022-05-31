<template>
  <div>
    <!-- MISSION INFORMATION -->
    <div class="d-flex flex-column">
      <div class="title font-weight-bold bluePrimary--text mt-4">Mission information</div>
      <div class="font-18 font-weight-bold mt-3 mb-1">Mission name</div>
      <app-text-field
        :rules="[$rules.required]"
        :value="$_get(vm.missionInfo, 'name')"
        @change="vm.changeMissionInfo('name', $event)"
        placeholder="Enter name of mission"
      />
      <span class="font-18 font-weight-bold mt-3 mb-1">Short description</span>
      <app-textarea
        :rules="[$rules.required]"
        :value="$_get(vm.missionInfo, 'shortDescription')"
        @change="vm.changeMissionInfo('shortDescription', $event)"
        placeholder="Enter short description to describe the mission"
      />
      <span class="font-18 font-weight-bold mt-3 mb-1">Mission cover</span>
      <app-file-upload
        imageOnly
        :rules="[$rules.required, $rules.maxSize(15000000), $rules.isImageFile]"
        @change="vm.changeLearnToEarnInfo('setting.imageCover', $event)"
        class="mt-2"
      />
    </div>

    <!-- REWARD INFORMATION -->
    <div class="d-flex flex-column mt-7">
      <div class="title font-weight-bold bluePrimary--text">Reward information</div>
      <div class="font-18 font-weight-bold mt-4">
        <!-- rewardAmount is hard coded start -->
        <span>Reward mission: {{ rewardPerMission }} {{ $_get(vm.pool, 'tokenName', 'HWD') }}</span>
        <!-- rewardAmount is hard coded end -->
      </div>
      <div class="mt-4 d-flex">
        <div class="flex-grow-1">
          <span class="font-18 font-weight-bold">Priority amount</span>
          <app-text-field
            class="mt-2"
            :rules="[$rules.required, $rules.floatNumberOnly]"
            :value="$_get(vm.missionInfo, 'priorityAmount')"
            @change="vm.changeMissionInfo('priorityAmount', $event)"
            placeholder="Enter amount"
          />
        </div>
        <div class="flex-grow-1 ml-4">
          <span class="font-18 font-weight-bold">Max participant in priority pool</span>
          <app-text-field
            class="mt-2"
            :rules="[$rules.required, $rules.integer]"
            :value="$_get(vm.missionInfo, 'maxParticipants')"
            @change="vm.changeMissionInfo('maxParticipants', $event)"
            placeholder="Enter participants"
          />
        </div>
      </div>
    </div>

    <v-divider class="mt-10 my-5" />

    <!-- MISSION TIME -->
    <div class="mt-7">
      <div class="title font-weight-bold bluePrimary--text">Mision time</div>
      <div class="d-flex mt-4">
        <div class="flex-grow-1 mr-4">
          <span class="font-18 font-weight-bold">Start date</span>
          <app-text-field
            class="mt-2"
            :rules="[$rules.required, $rules.yyyymmdd]"
            :value="$_get(vm.missionInfo, 'startDate.date')"
            @change="vm.changeMissionInfo('startDate.date', $event)"
            placeholder="DD/MM/YYYY"
          />
        </div>
        <div class="flex-grow-1">
          <span class="font-18 font-weight-bold">Start time</span>
          <app-text-field
            class="mt-2"
            :rules="[$rules.required, $rules.hhmm]"
            :value="$_get(vm.missionInfo, 'startDate.time')"
            @change="vm.changeMissionInfo('startDate.time', $event)"
            placeholder="hh:mm"
          />
        </div>
      </div>
      <div class="d-flex">
        <div class="flex-grow-1 mr-4 mt-4">
          <span class="font-18 font-weight-bold">End date</span>
          <app-text-field
            class="mt-2"
            :rules="[$rules.required, $rules.yyyymmdd]"
            :value="$_get(vm.missionInfo, 'endDate.date')"
            @change="vm.changeMissionInfo('endDate.date', $event)"
            placeholder="DD/MM/YYYY"
          />
        </div>
        <div class="flex-grow-1 mt-4">
          <span class="font-18 font-weight-bold">End time</span>
          <app-text-field
            class="mt-2"
            :rules="[$rules.required, $rules.hhmm]"
            :value="$_get(vm.missionInfo, 'endDate.time')"
            @change="vm.changeMissionInfo('endDate.time', $event)"
            placeholder="hh:mm"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Inject, Vue } from 'vue-property-decorator'
import { NewMissionViewModel } from '../../viewmodels/new-mission-viewmodel'
import { Observer } from 'mobx-vue'
import { FixedNumber } from '@ethersproject/bignumber'
import { Zero } from '@/constants'

@Observer
@Component({
  components: {
    'app-file-upload': () => import('@/components/app-file-upload.vue'),
  },
})
export default class MissionInfoForm extends Vue {
  @Inject() vm!: NewMissionViewModel

  get rewardPerMission() {
    try {
      return FixedNumber.from(this.vm.pool?.totalMission).divUnsafe(FixedNumber.from(this.vm.pool?.totalMission))
    } catch (error) {
      return Zero
    }
  }
}
</script>

<style scoped></style>
