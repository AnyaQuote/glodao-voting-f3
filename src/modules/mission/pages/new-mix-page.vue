<template>
  <v-container>
    <v-row justify="center" class="mb-100">
      <!-- ---------------- BREADCRUMBS ---------------- -->
      <v-col cols="12">
        <div class="d-flex align-center justify-start mt-4" @click="goBackScreen">
          <v-icon>mdi-arrow-left</v-icon>
          <span class="text-h6 bluePrimary--text cursor-pointer ml-7">Back to project</span>
        </div>
      </v-col>

      <!-- ---------------- SKELETON LOADER ---------------- -->
      <v-col v-if="vm.pageLoading" cols="10">
        <mission-skeleton-form />
      </v-col>

      <!-- ---------------- FORM CONTENT ---------------- -->
      <v-col v-else cols="10">
        <v-sheet class="rounded-lg" outlined>
          <div class="py-6 text-center rounded-lg rounded-b-0 blue-2">
            <span class="text-h5 font-weight-bold text-uppercase">Create mission</span>
          </div>
          <v-divider />
          <component
            v-for="(handler, index) in vm.handlers"
            :is="handler.name"
            :key="handler.name + index"
            :handler="handler"
          />
          <v-divider class="dashed-border" />

          <!-- ----------------------------------------- BUTTONS START ---------------------------------------------------- -->
          <div class="d-flex pa-7">
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
                Next
              </v-btn>
            </div>
          </div>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Vue, Provide } from 'vue-property-decorator'
import { get } from 'lodash-es'
import { NewMixMissionVIewModel } from '@/modules/mission/viewmodels/new-mix-viewmodel'
import { HandlerName } from '../handlers/base.handler'
@Observer
@Component({
  components: {
    'mission-info': () => import('../components/common/base-mission-info.vue'),
    'mission-skeleton-form': () => import('../components/common/mission-skeleton-form.vue'),
    [HandlerName.missionInfo]: () => import('../handlers/mission-info/mission-info.handler.vue'),
  },
})
export default class NewMixMissionForm extends Vue {
  @Provide() vm = new NewMixMissionVIewModel(get(this.$route, 'params.unicodeName', ''))

  back() {
    this.vm.backStep()
  }
  next() {
    this.vm.nextStep()
  }
  goBackScreen() {
    this.$router.go(-1)
  }
}
</script>

<style lang="scss" scoped>
.mb-100 {
  margin-bottom: 100px;
}
</style>
