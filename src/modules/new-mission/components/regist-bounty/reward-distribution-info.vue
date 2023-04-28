<template>
  <div>
    <div class="mt-2">
      <span class="font-18 font-weight-bold blue-diversity--text">Project reward</span>
      <!-- <i class="neutral-10--text ml-2">(optional)</i> -->
    </div>
    <!-- <div class="neutral-10--text text-subtitle-1">I want to distribute project reward with:</div> -->
    <!-- <distribution-type :value="handler.rewardType" @change="handler.switchType" /> -->
    <!-- --------------------------------------- PROJECT TOKEN FORM START --------------------------------------- -->

    <!-- <div v-if="handler.rewardType === tokenType"> -->
    <div class="font-18 font-weight-bold mb-2">Token contract address</div>
    <app-text-field
      :rules="[$rules.isAddress]"
      :value="$_get(handler.projectInfo, 'optionalTokenAddress')"
      @change="handler.changeProjectInfo('optionalTokenAddress', $event)"
      placeholder="Enter address"
    ></app-text-field>
    <div class="d-flex flex-column flex-sm-row">
      <div class="flex-grow">
        <div class="font-18 font-weight-bold mb-2">Reward amount<span class="app-red--text">*</span></div>
        <app-text-field
          type="number"
          :rules="[$rules.floatNumberOnly, $rules.required, $rules.gt(0)]"
          :value="$_get(handler.projectInfo, 'optionalRewardAmount')"
          @input="handler.changeProjectInfo('optionalRewardAmount', $event)"
          placeholder="Enter amount"
        ></app-text-field>
      </div>
      <div class="pl-sm-6" />
      <div class="flex-grow">
        <div class="font-18 font-weight-bold mb-2">Reward token symbol<span class="app-red--text">*</span></div>
        <app-text-field
          :rules="[$rules.required]"
          :loading="handler.tokenInfoLoading"
          :disabled="handler.generateWithTokenAddress"
          :value="$_get(handler.projectInfo, 'optionalTokenName')"
          @change="handler.changeProjectInfo('optionalTokenName', $event)"
          placeholder="Token symbol"
        />
      </div>
    </div>
    <div class="font-18 font-weight-bold mb-2">Token logo<span class="app-red--text">*</span></div>
    <app-file-upload
      isImageFile
      :rules="[$rules.maxSize(MAX_IMAGE_FILE_SIZE), $rules.isImage, $rules.required]"
      :value="$_get(handler.projectInfo, 'optionalTokenLogo', null)"
      @change="handler.changeProjectInfo('optionalTokenLogo', $event)"
    />
  </div>
  <!-- --------------------------------------- PROJECT TOKEN FORM END --------------------------------------- -->

  <!-- --------------------------------------- BUSD FORM START ---------------------------------------------- -->
  <!-- <div v-else>
      <div class="font-18 font-weight-bold mb-2">Token reward address<span class="app-red--text">*</span></div>
      <app-text-field
        :rules="[$rules.required, $rules.isAddress]"
        :value="$_get(handler.projectInfo, 'optionalTokenAddress')"
        @change="handler.changeProjectInfo('optionalTokenAddress', $event)"
        disabled
        placeholder="Enter address"
      ></app-text-field>
      <div class="d-flex">
        <div class="flex-grow">
          <div class="font-18 font-weight-bold mb-2">Reward amount<span class="app-red--text">*</span></div>
          <app-text-field
            type="number"
            :rules="[$rules.floatNumberOnly, $rules.required]"
            :value="$_get(handler.projectInfo, 'optionalRewardAmount')"
            @input="handler.changeProjectInfo('optionalRewardAmount', $event)"
            placeholder="Enter amount"
          ></app-text-field>
        </div>
        <div class="mx-3" />
        <div class="flex-grow">
          <div class="font-18 font-weight-bold mb-2">Reward token symbol<span class="app-red--text">*</span></div>
          <app-text-field :value="$_get(handler.projectInfo, 'optionalTokenName')" disabled placeholder="Token symbol" />
        </div>
      </div>
    </div> -->

  <!-- --------------------------------------- BUSD FORM START ---------------------------------------------- -->
  <!-- </div> -->
</template>

<script lang="ts">
import { MAX_IMAGE_FILE_SIZE } from '@/constants'
import { RewardDistributionType } from '@/models/VotingModel'
import { Observer } from 'mobx-vue'
import { Component, Vue, Inject, Ref, Prop } from 'vue-property-decorator'
import { GeneralInformationHandler } from '@/modules/new-mission/handlers/general-information/general-information-handler'

@Observer
@Component({
  components: {
    'app-file-upload': () => import('@/components/app-file-upload.vue'),
    'distribution-type': () => import('./distribution-type.vue'),
  },
})
export default class RewardDistributionInfo extends Vue {
  @Prop() handler!: GeneralInformationHandler
  MAX_IMAGE_FILE_SIZE = MAX_IMAGE_FILE_SIZE
  readonly tokenType = RewardDistributionType.TOKEN
}
</script>

<style lang="scss" scoped></style>
