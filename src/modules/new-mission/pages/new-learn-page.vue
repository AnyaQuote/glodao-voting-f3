<template>
  <v-row justify="center" class="mb-100">
    <!-- ---------------- BREADCRUMBS ---------------- -->

    <!-- ---------------- SKELETON LOADER ---------------- -->
    <v-col v-if="vm.pageLoading" cols="10">
      <mission-skeleton-form />
    </v-col>

    <!-- ---------------- FORM CONTENT ---------------- -->
    <v-col v-else cols="12">
      <mission-lte-setting />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Vue, Provide } from 'vue-property-decorator'
import { NewLearnMissionViewModel } from '../viewmodels/new-learn-mission-viewmodel'
import { get } from 'lodash-es'
@Observer
@Component({
  components: {
    'mission-skeleton-form': () => import('../components/common/mission-skeleton-form.vue'),
    'mission-lte-setting': () => import('../learn-mission-form/learn/mission-lte-setting.vue'),
  },
})
export default class MissionForm extends Vue {
  @Provide() vm = new NewLearnMissionViewModel()

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
