<template>
  <v-sheet class="neutral100--bg rounded-lg" outlined>
    <v-chip
      class="font-weight-bold text-center ma-5 pa-6 text-uppercase neutral-0--text font-18"
      color="app-blue"
      label
      outlined
    >
      Project information
    </v-chip>

    <v-form v-model="handler.valid" :valid="handler.valid" class="form pa-6">
      <div class="font-18 font-weight-bold">Project name<span class="app-red--text">*</span></div>
      <app-text-field
        :rules="[$rules.required]"
        :value="$_get(handler.projectInfo, 'projectName')"
        @change="handler.changeProjectInfo('projectName', $event)"
        placeholder="Enter name of project"
      ></app-text-field>

      <div class="font-18 font-weight-bold">Short description<span class="app-red--text">*</span></div>
      <app-textarea
        :rules="[$rules.required]"
        :value="$_get(handler.projectInfo, 'shortDescription')"
        @input="handler.changeProjectInfo('shortDescription', $event)"
        placeholder="Enter project's short description"
      ></app-textarea>

      <div class="d-flex mt-6 mb-2 align-end">
        <span class="font-18 font-weight-bold">Project logo<span class="app-red--text">*</span></span>
        <v-spacer />
        <i class="text-subtitle-2 neutral-10--text font-weight-regular">
          *Recommend resolution 1:1 (48x48, 64x64, 80x80, 256x256)
        </i>
      </div>
      <app-file-upload
        isImageFile
        :rules="[$rules.maxSize(MAX_IMAGE_FILE_SIZE), $rules.isImage, $rules.required]"
        :value="$_get(handler.projectInfo, 'projectLogo', null)"
        @change="handler.changeProjectInfo('projectLogo', $event)"
      />

      <div class="d-flex mt-6 mb-2 align-end">
        <span class="font-18 font-weight-bold">Project cover<span class="app-red--text">*</span></span>
        <v-spacer />
        <i class="text-subtitle-2 neutral-10--text font-weight-regular"
          >*Recommend resolution 3:2 (2160×1440, 2560×1700)</i
        >
      </div>
      <app-file-upload
        isImageFile
        :rules="[$rules.maxSize(MAX_IMAGE_FILE_SIZE), $rules.isImage, $rules.required]"
        :value="$_get(handler.projectInfo, 'projectCover', null)"
        @change="handler.changeProjectInfo('projectCover', $event)"
      />

      <div class="font-18 font-weight-bold mt-6">Field of project</div>
      <app-autocomplete
        limit="5"
        :items="['NFT', 'Finance', 'Gaming']"
        :value="$_get(handler.projectInfo, 'fields')"
        @onChange="handler.changeProjectInfo('fields', $event)"
      />

      <!-- ===== SOCIAL LINKS FIELDS ===== -->
      <div class="d-flex flex-column flex-md-row align-md-center justify-space-between">
        <span class="font-18 font-weight-bold"> Website and social link<span class="app-red--text">*</span></span>
        <i class="text-subtitle-2 font-weight-regular">*Website link is required</i>
      </div>
      <app-socials-field
        :value="$_get(handler.projectInfo, 'socialLinks')"
        @change="handler.changeProjectInfo('socialLinks', $event)"
        class="mt-3"
      />

      <!-- ----------------------------------- REWARD INFORMATION ----------------------------------------- -->

      <!-- <div class="font-18 font-weight-bold mb-2">Token reward address<span class="app-red--text">*</span></div> -->
      <!-- <app-text-field
        :rules="[$rules.required, $rules.isAddress]"
        :value="$_get(handler.projectInfo, 'tokenAddress')"
        @change="handler.changeProjectInfo('tokenAddress', $event)"
        placeholder="Enter address"
      ></app-text-field> -->

      <!-- ----------------------------------- VOTING DURATION --------------------------------------------- -->
      <!-- <div class="mt-2">
        <span class="font-18 font-weight-bold blue-diversity--text">Voting duration</span>
        <i class="neutral-10--text ml-2">(Locale time)</i>
      </div>
      <div class="font-italic text-subtitle-1 neutral-10--text mb-2">
        *Voting duration is 3 days counting from the project creation date. The time is mark when you begin creating
        this project.
      </div>
      <div class="mb-1 font-18">
        <span class="font-weight-bold">Your project voting will start in: </span>
        <span>{{ $_get(handler.projectInfo, 'votingStart') | ddmmyyyy }}</span>
      </div>
      <div class="font-18">
        <span class="font-weight-bold">Your project voting will end in: </span>
        <span>{{ $_get(handler.projectInfo, 'votingEnd') | ddmmyyyy }}</span>
      </div> -->

      <!-- ----------------------------------- PROJECT REWARD ---------------------------------------------- -->
      <reward-distribution-info :handler="handler" />
      <!-- ------------------------------------------------------------------------------------------------- -->

      <!-- ------------------------------------ CAMPAIGN INFORMATION --------------------------------------- -->
      <div class="mt-7">
        <span class="font-18 font-weight-bold blue-diversity--text">Campaign Information</span>
        <i class="neutral-10--text ml-2">(Local time)</i>
      </div>

      <app-datetime-picker2
        class="font-18"
        :min="handler.currentTime.toISOString()"
        :rules="[$rules.required]"
        @change="handler.changeProjectInfo('projectDates', $event)"
        :value="[handler.projectInfo.startDate, handler.projectInfo.endDate]"
      />
      <div class="title font-weight-bold blue-diversity--text">Reward information</div>
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
          :value="$_get(handler.projectInfo, 'priorityRatio')"
          @input="handler.changeProjectInfo('priorityRatio', $event)"
        />
      </div>
      <div class="d-flex flex-column flex-sm-row mt-4">
        <div class="flex-grow">
          <span class="font-18 font-weight-bold">Priority amount</span>
          <v-sheet class="rounded px-3 d-flex align-center mt-2 py-14px" height="56" outlined>
            <span class="font-weight-600">{{ handler.priorityAmount }}</span>
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
            :rules="[$rules.required, $rules.integer, $rules.min(0)]"
            :value="$_get(handler.projectInfo, 'maxPriorityParticipants')"
            @change="handler.changeProjectInfo('maxPriorityParticipants', $event)"
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
          <span class="font-weight-600"> {{ handler.personalReward | formatNumber(2) }} {{ handler.tokenName }} </span>
        </v-sheet>
      </div>

      <!-- ------------------------------------- REWARD INFORMATION END ---------------------------------------------- -->
      <v-divider class="mt-10 my-5 dashed-border" />
      <!-- ------------------------------------- TOKEN BASE PRICE INFO START ------------------------------------------ -->
      <!-- ------------------------------------------------------------------------------------------------- -->
    </v-form>
  </v-sheet>
</template>

<script lang="ts">
import { MAX_IMAGE_FILE_SIZE } from '@/constants'
import { Component, Inject, Prop, Ref, Vue } from 'vue-property-decorator'
import { GeneralInformationHandler } from '@/modules/new-mission/handlers/general-information/general-information-handler'
import { Observer } from 'mobx-vue'

@Observer
@Component({
  components: {
    'image-upload-field': () => import('@/components/image-upload-field.vue'),
    'app-socials-field': () => import('@/components/app-socials-field.vue'),
    'app-file-upload': () => import('@/components/app-file-upload.vue'),
    'app-autocomplete': () => import('../common/app-autocomplete.vue'),
    'app-datetime-picker2': () => import('@/components/app-datetime-picker2.vue'),
    'reward-distribution-info': () => import('./reward-distribution-info.vue'),
    'app-token-converter': () => import('@/components/app-token-price-converter.vue'),
  },
})
export default class ProjectInfo extends Vue {
  @Prop() handler!: GeneralInformationHandler
  @Ref('confirm-dialog') dialog
  MAX_IMAGE_FILE_SIZE = MAX_IMAGE_FILE_SIZE
}
</script>

<style lang="scss" scoped>
.form {
  .thin-border {
    border: thin solid var(--v-neutral20-base);
  }
  .w-130 {
    width: em(130);
  }
  .active {
    background-color: var(--v-blue-base);
    color: white !important;
  }
}
</style>
