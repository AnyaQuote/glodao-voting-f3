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
        <mission-lte-setting v-else-if="vm.step === 2" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Vue, Provide } from 'vue-property-decorator'
import { EditLearnMissionViewModel } from '../viewmodels/edit-learn-mission-viewmodel'
import { get } from 'lodash-es'
@Observer
@Component({
  components: {
    'mission-info': () => import('../components/learn/mission-info.vue'),
    'mission-skeleton-form': () => import('../components/common/mission-skeleton-form.vue'),
    'mission-lte-setting': () => import('../components/learn/mission-lte-setting.vue'),
  },
})
export default class MissionForm extends Vue {
  @Provide() vm = new EditLearnMissionViewModel(get(this.$route, 'params.unicodeName'))

  goBack() {
    this.$router.go(-1)
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
