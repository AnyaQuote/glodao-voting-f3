<template>
  <v-container>
    <v-row justify="center" class="mb-100">
      <!-- ---------------- BREADCRUMBS ---------------- -->

      <!-- ---------------- SKELETON LOADER ---------------- -->
      <v-col v-if="vm.pageLoading" cols="10">
        <mission-skeleton-form />
      </v-col>

      <!-- ---------------- FORM CONTENT ---------------- -->
      <v-col v-else cols="12" md="8">
        <mission-info v-if="vm.step === 1" />
        <mission-social-setting v-else-if="vm.step === 2" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Vue, Provide } from 'vue-property-decorator'
import { NewSocialMissionViewModel } from '../viewmodels/new-social-mission-viewmodel'
import { get } from 'lodash-es'
@Observer
@Component({
  components: {
    'mission-info': () => import('../social-mission-form/social/mission-info.vue'),
    'mission-skeleton-form': () => import('../social-mission-form/social/mission-skeleton-form.vue'),
    'mission-social-setting': () => import('../social-mission-form/social/mission-social-setting.vue'),
  },
})
export default class MissionForm extends Vue {
  @Provide() vm = new NewSocialMissionViewModel()

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
