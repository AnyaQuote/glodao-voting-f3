<template>
  <v-container>
    <v-row justify="center" class="mb-100">
      <!-- ---------------- BREADCRUMBS ---------------- -->
      <v-col cols="12">
        <div class="d-flex align-center justify-start mt-4" @click="goBack">
          <v-icon>mdi-arrow-left</v-icon>
          <span class="text-h6 bluePrimary--text cursor-pointer ml-7">Back to project</span>
        </div>
      </v-col>

      <!-- ---------------- SKELETON LOADER ---------------- -->
      <v-col v-if="vm.pageLoading" cols="10">
        <mission-skeleton-form />
      </v-col>

      <!-- ---------------- FORM CONTENT ---------------- -->
      <v-col v-else cols="8">
        <mission-info v-if="vm.step === 1" />
        <!-- <mission-lte-setting v-else-if="vm.step === 2" />  -->
        <!-- <v-sheet width="400" height="400" class="red"></v-sheet> -->
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Vue, Provide } from 'vue-property-decorator'
import { get } from 'lodash-es'
import { NewMixMissionVIewModel } from '@/modules/mission/viewmodels/new-mix-viewmodel'
@Observer
@Component({
  components: {
    'mission-info': () => import('../components/common/base-mission-info.vue'),
    'mission-skeleton-form': () => import('../components/common/mission-skeleton-form.vue'),
  },
})
export default class NewMixMissionForm extends Vue {
  @Provide() vm = new NewMixMissionVIewModel(get(this.$route, 'params.unicodeName', ''))

  goBack() {
    this.vm.goBack()
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
