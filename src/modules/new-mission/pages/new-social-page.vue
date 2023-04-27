<template>
  <v-row justify="center" class="mb-100">
    <!-- ---------------- BREADCRUMBS ---------------- -->

    <!-- ---------------- SKELETON LOADER ---------------- -->

    <!-- ---------------- FORM CONTENT ---------------- -->
    <v-col cols="12" md="8">
      <general-information v-if="vm.step === 0" :handler="vm.handlers[0]" />
      <social-setting v-else-if="vm.step === 1" :handler="vm.handlers[1]" />
      <confirm v-else-if="vm.step === 2" :handler="vm.handlers[2]" />
      <div class="d-flex mt-7">
        <div class="flex-grow">
          <v-btn depressed outlined height="40" color="neutral-10" block @click="back"> Cancel </v-btn>
        </div>
        <div class="px-4" />

        <div class="flex-grow">
          <v-btn
            class="text-none"
            :class="{ 'linear-blue--bg white--text': vm.isCurrentHandlerValid }"
            :loading="vm.btnLoading"
            :disabled="!vm.isCurrentHandlerValid"
            @click="next"
            height="40"
            depressed
            block
          >
            {{ vm.isLastStep ? 'Submit' : 'Next' }}
          </v-btn>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Vue, Provide } from 'vue-property-decorator'
import { NewSocialMissionViewModel } from '@/modules/new-mission/viewmodels/new-social-mission-viewmodel'
import { get } from 'lodash-es'
@Observer
@Component({
  components: {
    'general-information': () =>
      import('@/modules/new-mission/handlers/general-information/general-information-handler.vue'),
    'social-setting': () => import('@/modules/new-mission/handlers/social/social-handler/social.handler.vue'),
    confirm: () => import('@/modules/new-mission/handlers/confirm/confirm.vue'),
  },
})
export default class MissionForm extends Vue {
  @Provide() vm = new NewSocialMissionViewModel()
  valid = true

  next() {
    this.vm.nextStep()
  }

  back() {
    this.vm.backStep()
  }

  submit() {
    this.vm.submit()
  }
}
</script>

<style lang="scss" scoped>
.mb-100 {
  margin-bottom: 100px;
}
</style>
