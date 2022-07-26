<template>
  <div class="row no-gutters">
    <div class="col-12 col-sm-6 mb-2 mb-sm-0">
      <div class="black rounded-lg overflow-hidden">
        <v-img max-height="250" aspect-ratio="1" contain :src="$_get(vm.quiz, 'metadata.coverImage')" />
      </div>
    </div>
    <div class="col-12 col-sm-6 pa-5 pt-0">
      <div class="text-h5 font-weight-600">{{ $_get(vm.quiz, 'name') }}</div>
      <div class="neutral-10--text mt-4 text-subtitle-2">
        {{ $_get(vm.quiz, 'description') }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Inject, Vue } from 'vue-property-decorator'
import { LearnMissionDetailViewModel } from '../../viewmodels/learn-detail-viewmodel'

@Observer
@Component
export default class MissionLteOverview extends Vue {
  @Inject() vm!: LearnMissionDetailViewModel
}
</script>

<style scoped></style>
