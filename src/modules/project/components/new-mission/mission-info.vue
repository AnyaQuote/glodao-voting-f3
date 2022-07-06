<template>
  <v-sheet class="rounded-lg" outlined>
    <div class="py-6 text-center rounded-lg rounded-b-0 blue-2">
      <span class="text-h5 font-weight-bold text-uppercase">Create mission</span>
    </div>
    <v-divider />
    <v-form v-model="valid" class="pa-7">
      <!-- ------------------------------------ MISSION TYPE -------------------------------------------------- -->

      <v-radio-group mandatory :value="vm.missionInfo.type" @change="vm.changeMissionInfo('type', $event)">
        <div class="row no-gutters">
          <div class="col-6 pr-4">
            <v-sheet class="rounded pa-5" outlined :class="isActive('social')">
              <v-radio color="blue-diversity" value="social">
                <template #label>
                  <span class="font-18 font-weight-bold" :class="isActive('social')">Social mission</span>
                </template>
              </v-radio>
              <div class="text-subtitle-2 font-weight-regular">
                Setting social tasks such as Twitter, Telegram, Discord
              </div>
            </v-sheet>
          </div>
          <div class="col-6">
            <v-sheet class="rounded pa-5 fill-height" outlined :class="isActive('lte')">
              <v-radio color="blue-diversity" value="lte">
                <template #label>
                  <span class="font-18 font-weight-bold" :class="isActive('lte')">Learn to earn mission</span>
                </template>
              </v-radio>
              <div class="text-subtitle-2 font-weight-regular">Setting the project document and the quiz</div>
            </v-sheet>
          </div>
        </div>
      </v-radio-group>

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
          :value="$_get(vm.missionInfo, 'missionCover', null)"
          @change="vm.changeMissionInfo('missionCover', $event)"
          class="mt-2"
        />
      </div>

      <v-divider class="mt-10 my-5 dashed-border" />

      <!-- ------------------------------------- REWARD INFORMATION -------------------------------------------- -->
      <mission-reward-info />
      <v-divider class="mt-10 my-5 dashed-border" />

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
          :maxDate="$_get(vm.missionInfo, 'endDate') || $_get(vm.pool, 'endDate')"
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
import { NewMissionViewModel } from '../../viewmodels/new-mission-viewmodel'
import { Observer } from 'mobx-vue'

@Observer
@Component({
  components: {
    'mission-reward-info': () => import('./mission-reward-info.vue'),
    'app-file-upload': () => import('@/components/app-file-upload.vue'),
    'app-datetime-picker': () => import('@/components/app-datetime-picker.vue'),
  },
})
export default class MissionInfoForm extends Vue {
  @Inject() vm!: NewMissionViewModel
  valid = true
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
