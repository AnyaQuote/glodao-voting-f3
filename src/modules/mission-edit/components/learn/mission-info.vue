<template>
  <v-sheet class="rounded-lg" outlined>
    <div class="py-6 text-center rounded-lg rounded-b-0 blue-2">
      <span class="text-h5 font-weight-bold text-uppercase">Create mission</span>
    </div>
    <v-divider />
    <v-form v-model="valid" class="pa-7">
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
          :rules="[$rules.required, $rules.maxSize(MAX_IMAGE_FILE_SIZE), $rules.isImage]"
          :value="$_get(vm.missionInfo, 'missionCover', null)"
          @change="vm.changeMissionInfo('missionCover', $event)"
          class="mt-2"
        />
      </div>

      <v-divider class="mt-10 my-5 dashed-border" />

      <!-- ------------------------------------- REWARD INFORMATION -------------------------------------------- -->
      <div class="title font-weight-bold blue-diversity--text mt-7">Reward information</div>
      <div class="font-18 font-weight-bold mt-4">
        <span>Reward mission: {{ vm.rewardPerMission | formatNumber(2) }} {{ vm.tokenName }}</span>
      </div>
      <div class="mt-4 row no-gutters">
        <div class="col-12">
          <span class="font-18 font-weight-bold">Max participants<span class="app-red--text">*</span></span>
          <app-text-field
            class="mt-2"
            type="number"
            :rules="[$rules.required, $rules.integer, $rules.min(1)]"
            :value="$_get(vm.missionInfo, 'maxParticipants')"
            @input="vm.changeMissionInfo('maxParticipants', $event)"
            placeholder="Enter participants"
          />
        </div>
      </div>
      <v-divider class="my-5 dashed-border" />

      <!-- ------------------------------------- TOKEN BASE PRICE INFO START ------------------------------------------ -->
      <app-token-converter
        :value="vm.tokenBasePrice"
        :tokenName="vm.tokenBName"
        :tokenAddress="vm.tokenBAddress"
        @change="vm.changeMissionInfo('tokenBasePrice', $event)"
      />
      <!-- ------------------------------------- TOKEN BASE PRICE INFO END -------------------------------------------- -->
      <v-divider class="my-5 dashed-border" />

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
          :minDate="vm.projectStartDate"
          :maxDate="vm.missionStartMaxDate"
          :rules="[$rules.required]"
          :value="vm.missionStartDate"
          @change="vm.changeMissionInfo('startDate', $event)"
        />
        <app-datetime-picker
          dateLabel="End date"
          timeLabel="End time"
          :rules="[$rules.required]"
          :minDate="vm.missionStartDate"
          :maxDate="vm.projectEndDate"
          :disabled="!vm.missionStartDate"
          :value="vm.missionEndDate"
          @change="vm.changeMissionInfo('endDate', $event)"
        />
      </div>

      <v-divider class="dashed-border" />

      <!-- -------------------------------------- BUTTONS --------------------------------------------------------- -->
      <div class="d-flex mt-7">
        <div class="flex-grow">
          <v-btn depressed outlined height="40" color="neutral-10" block @click="back"> Cancel </v-btn>
        </div>
        <div class="px-4" />
        <div class="flex-grow">
          <v-btn
            class="text-none"
            :class="valid && 'linear-blue--bg white--text'"
            :loading="vm.btnLoading"
            :disabled="!valid"
            @click="next"
            height="40"
            depressed
            block
          >
            Next
          </v-btn>
        </div>
      </div>
    </v-form>

    <!-- ------------------------------------------------------------------------------------------------------- -->
  </v-sheet>
</template>

<script lang="ts">
import { Component, Inject, Vue } from 'vue-property-decorator'
import { EditLearnMissionViewModel } from '../../viewmodels/edit-learn-mission-viewmodel'
import { Observer } from 'mobx-vue'
import { MAX_IMAGE_FILE_SIZE } from '@/constants'

@Observer
@Component({
  components: {
    'app-token-converter': () => import('@/components/app-token-price-converter.vue'),
    'app-file-upload': () => import('@/components/app-file-upload.vue'),
    'app-datetime-picker': () => import('@/components/app-datetime-picker.vue'),
  },
})
export default class MissionInfoForm extends Vue {
  @Inject() vm!: EditLearnMissionViewModel
  valid = true
  MAX_IMAGE_FILE_SIZE = MAX_IMAGE_FILE_SIZE
  next() {
    this.valid && this.vm.changeStep(2)
  }
  back() {
    this.$router.go(-1)
  }
  get isActive() {
    return (type: string) => (this.vm.missionInfo.type === type ? 'active-type' : '')
  }
}
</script>

<style lang="scss" scoped>
.active-type {
  color: var(--v-blue-diversity-base) !important;
  border-color: var(--v-blue-diversity-base) !important;
  background-color: var(--v-blue-2-base) !important;
}
.dashed-border {
  border-style: dashed;
}
</style>
