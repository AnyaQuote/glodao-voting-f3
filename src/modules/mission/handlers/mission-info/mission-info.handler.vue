<template>
  <v-sheet>
    <v-form v-model="handler.valid" class="pa-7">
      <!-- ------------------------------------ MISSION INFORMATION START ------------------------------------------- -->
      <div class="d-flex flex-column">
        <div class="title font-weight-bold bluePrimary--text mt-4">Mission information</div>
        <div class="font-18 font-weight-bold mt-3 mb-1">Mission name<span class="app-red--text">*</span></div>
        <app-text-field
          :rules="[$rules.required]"
          :value="$_get(handler.missionInfo, 'name')"
          @change="handler.changeMissionInfo('name', $event)"
          placeholder="Enter name of mission"
        />
        <span class="font-18 font-weight-bold mt-3 mb-1">Short description<span class="app-red--text">*</span></span>
        <app-textarea
          :rules="[$rules.required]"
          :value="$_get(handler.missionInfo, 'shortDescription')"
          @change="handler.changeMissionInfo('shortDescription', $event)"
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
          :value="$_get(handler.missionInfo, 'missionCover', null)"
          @change="handler.changeMissionInfo('missionCover', $event)"
          class="mt-2"
        />
      </div>
      <!-- ------------------------------------ MISSION INFORMATION END ---------------------------------------------- -->

      <v-divider class="mt-10 my-5 dashed-border" />

      <!-- ------------------------------------- REWARD INFORMATION START -------------------------------------------- -->
      <div class="d-flex flex-column">
        <div class="title font-weight-bold blue-diversity--text">Reward information</div>
        <div class="font-18 font-weight-bold mt-6">
          <span>Reward mission: {{ handler.rewardPerMission | formatNumber(2) }} {{ handler.tokenName }}</span>
        </div>
        <div class="mt-6 d-flex">
          <div class="flex-grow">
            <div class="font-18 font-weight-bold">Priority ratio (%)<span class="red--text">*</span></div>
            <div class="text-caption">*Adjust priority amount with ratio</div>
          </div>
          <div class="px-3" />
          <app-text-field
            class="flex-grow"
            placeholder="(ex: 30)"
            :rules="[$rules.required, $rules.integer, $rules.max(100)]"
            :value="handler.missionInfo.priorityRatio"
            @input="handler.changeMissionInfo('priorityRatio', $event)"
          />
        </div>
        <div class="d-flex flex-column flex-sm-row mt-4">
          <div class="flex-grow">
            <span class="font-18 font-weight-bold">Priority amount</span>
            <v-sheet class="rounded px-3 d-flex align-center mt-2 py-14px" height="56" outlined>
              <span class="font-weight-600"
                >{{ handler.priorityAmount | formatNumber(2) }} {{ handler.tokenName }}</span
              >
            </v-sheet>
          </div>
          <div class="mx-sm-3 my-3 my-sm-0" />
          <!-- ---------------- MAX PRIORITY PARTICIPANTS FIELD START ----------------- -->
          <div class="flex-grow">
            <span class="font-18 font-weight-bold text-truncate">
              Max participant in priority pool<span class="app-red--text">*</span>
            </span>
            <app-text-field
              class="mt-2"
              type="number"
              :disabled="handler.missionInfo.priorityRatio === '0'"
              :rules="[$rules.required, $rules.integer, $rules.min(0)]"
              :value="$_get(handler.missionInfo, 'maxPriorityParticipants')"
              @change="handler.changeMissionInfo('maxPriorityParticipants', $event)"
              placeholder="Enter participants"
            />
          </div>
        </div>

        <!-- ---------------- MAX PRIORITY PARTICIPANTS FIELD END ------------------ -->

        <div class="d-flex flex-column flex-sm-row">
          <v-sheet min-height="56" class="flex-grow rounded px-3 d-flex justify-space-between align-center" outlined>
            <span>Community amount:</span>
            <span class="font-weight-600">{{ handler.communityAmount | formatNumber(2) }} {{ handler.tokenName }}</span>
          </v-sheet>
          <div class="mx-sm-3 my-3 my-sm-0" />
          <v-sheet class="flex-grow rounded px-3 d-flex justify-space-between align-center" min-height="56" outlined>
            <span>Personal priority reward:</span>
            <span class="font-weight-600">
              {{ handler.personalReward | formatNumber(2) }} {{ handler.tokenName }}
            </span>
          </v-sheet>
        </div>
      </div>
      <!-- ------------------------------------- REWARD INFORMATION END ---------------------------------------------- -->
      <v-divider class="mt-10 my-5 dashed-border" />
      <!-- ------------------------------------- TOKEN BASE PRICE INFO START ------------------------------------------ -->
      <app-token-converter
        :value="handler.tokenBasePrice"
        :tokenName="handler.tokenBName"
        :tokenAddress="handler.tokenBAddress"
        @change="handler.changeMissionInfo('tokenBasePrice', $event)"
      />
      <!-- ------------------------------------- TOKEN BASE PRICE INFO END -------------------------------------------- -->
      <v-divider class="my-5 dashed-border" />

      <!-- -------------------------------------- MISSION TIME START ------------------------------------------------- -->
      <div class="mt-7">
        <div>
          <span class="title font-weight-bold blue-diversity--text">Mission time</span>
          <i class="neutral-10--text ml-2">(Local time)</i>
        </div>
        <app-datetime-picker2
          class="font-18 mt-4"
          :rules="[$rules.required]"
          :min="handler.pool.startDate"
          :max="handler.pool.endDate"
          :value="[handler.missionInfo.startDate, handler.missionInfo.endDate]"
          @change="handler.changeMissionInfo('missionDates', $event)"
        />
      </div>
      <!-- -------------------------------------- MISSION TIME END --------------------------------------------------- -->
    </v-form>
  </v-sheet>
</template>

<script lang="ts">
import { Component, Inject, Prop, Vue } from 'vue-property-decorator'
import { Observer } from 'mobx-vue'
import { MAX_IMAGE_FILE_SIZE } from '@/constants'
import { MissionInfoHandler } from './mission-info.handler'

@Observer
@Component({
  components: {
    'app-token-converter': () => import('@/components/app-token-price-converter.vue'),
    'app-file-upload': () => import('@/components/app-file-upload.vue'),
    'app-datetime-picker2': () => import('@/components/app-datetime-picker2.vue'),
  },
})
export default class MissionInfoForm extends Vue {
  @Prop() handler!: MissionInfoHandler
  MAX_IMAGE_FILE_SIZE = MAX_IMAGE_FILE_SIZE
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
