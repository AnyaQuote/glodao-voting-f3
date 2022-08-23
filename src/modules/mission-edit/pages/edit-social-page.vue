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
import { EditSocialMissionViewModel } from '../viewmodels/edit-social-mission-viewmodel'
import { get } from 'lodash-es'
@Observer
@Component({
  components: {
    'mission-info': () => import('../components/social/mission-info.vue'),
    'mission-skeleton-form': () => import('../components/common/mission-skeleton-form.vue'),
    'mission-social-setting': () => import('../components/social/mission-social-setting.vue'),
  },
})
export default class EditSocialMissionForm extends Vue {
  @Provide() vm = new EditSocialMissionViewModel(
    get(this.$route, 'params.unicodeName'),
    get(this.$route, 'params.missionId')
  )

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
