<template>
  <div>
    <!-- ------------------------------------ MISSION INFORMATION ------------------------------------------- -->
    <div class="d-flex flex-column">
      <div class="title font-weight-bold bluePrimary--text mt-4">Mission information</div>
      <div class="font-18 font-weight-bold mt-3 mb-1">Mission name<span class="app-red--text">*</span></div>
      <app-text-field
        :rules="[$rules.required]"
        :value="$_get(vm.missionInfo, 'name')"
        @change="vm.changeMissionInfo('name', $event)"
        placeholder="Enter name of mission"
      />
      <span class="font-18 font-weight-bold mt-3 mb-1">Short description<span class="app-red--text">*</span></span>
      <app-textarea
        :rules="[$rules.required]"
        :value="$_get(vm.missionInfo, 'shortDescription')"
        @change="vm.changeMissionInfo('shortDescription', $event)"
        placeholder="Enter short description to describe the mission"
      />

      <div class="d-flex mt-6 align-end">
        <span class="font-18 font-weight-bold">Mission cover<span class="app-red--text">*</span></span>
        <v-spacer />
        <i class="text-subtitle-2 neutral-10--text font-weight-regular">
          *Recommend resolution 3:2 (2160×1440, 2560×1700)
        </i>
      </div>
      <app-file-upload
        isImageFile
        :rules="[$rules.required, $rules.maxSize(1000000), $rules.isImage]"
        @change="vm.changeLearnToEarnInfo('setting.imageCover', $event)"
        class="mt-2"
      />
    </div>

    <!-- ------------------------------------- REWARD INFORMATION -------------------------------------------- -->
    <div class="d-flex flex-column mt-7">
      <div class="title font-weight-bold blue-diversity--text">Reward information</div>
      <div class="font-18 font-weight-bold mt-4">
        <span>Reward mission: {{ vm.rewardPerMission }} {{ $_get(vm.pool, 'tokenName') }}</span>
      </div>
      <div class="mt-4 row ma-0">
        <div class="col-12 col-md-6 pa-0 pr-md-4 pr-0">
          <span class="font-18 font-weight-bold">Priority amount</span>
          <app-text-field
            readonly
            class="mt-2"
            :value="`${vm.priorityAmount} ${$_get(vm.pool, 'tokenName')}`"
            placeholder="Enter amount"
          />
        </div>
        <div class="col-12 col-md-6 pa-0">
          <span class="font-18 font-weight-bold"
            >Max participant in priority pool<span class="app-red--text">*</span></span
          >
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

    <!-- -------------------------------------- MISSION TIME ------------------------------------------------- -->
    <div class="mt-7">
      <div>
        <span class="title font-weight-bold blue-diversity--text">Mision time</span>
        <i class="neutral-10--text ml-2">(Locale time)</i>
      </div>
      <app-datetime-picker
        class="mt-4"
        dateLabel="Start date"
        timeLabel="Start time"
        :rules="[$rules.required]"
        :minDate="$_get(vm.pool, 'startDate')"
        :maxDate="$_get(vm.missionInfo, 'endDate', $_get(vm.pool, 'endDate'))"
        :value="$_get(vm.missionInfo, 'startDate')"
        @change="vm.changeMissionInfo('startDate', $event)"
      />
      <app-datetime-picker
        dateLabel="End date"
        timeLabel="End time"
        :rules="[$rules.required]"
        :disabled="!$_get(vm.missionInfo, 'startDate')"
        :minDate="$_get(vm.missionInfo, 'startDate')"
        :maxDate="$_get(vm.pool, 'endDate')"
        :value="$_get(vm.missionInfo, 'endDate')"
        @change="vm.changeMissionInfo('endDate', $event)"
      />
    </div>
  </div>
  <!-- ------------------------------------------------------------------------------------------------------- -->
</template>

<script lang="ts">
import { Component, Inject, Vue } from 'vue-property-decorator'
import { NewMissionViewModel } from '../../viewmodels/new-mission-viewmodel'
import { Observer } from 'mobx-vue'

@Observer
@Component({
  components: {
    'app-file-upload': () => import('@/components/app-file-upload.vue'),
    'app-datetime-picker': () => import('@/components/app-datetime-picker.vue'),
  },
})
export default class MissionInfoForm extends Vue {
  @Inject() vm!: NewMissionViewModel
}
</script>

<style scoped></style>
