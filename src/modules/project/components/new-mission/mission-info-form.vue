<template>
  <div class="section">
    <div class="title font-weight-bold bluePrimary--text">Mission information</div>
    <span class="label">Mission name</span>
    <app-text-field class="field" placeholder="Enter name of mission" />
    <span class="label">Short description</span>
    <app-text-field class="field" placeholder="Enter short description to describe the mission" />
    <span class="label">Mission cover</span>
    <image-upload-field class="field" />
  </div>
</template>

<script lang="ts">
import { Component, Inject, Vue } from 'vue-property-decorator'
import { NewMissionViewModel } from '../../viewmodels/new-mission-viewmodel'
import { Observer } from 'mobx-vue'

@Observer
@Component({
  components: {
    'image-upload-field': () => import('@/components/image-upload-field.vue'),
  },
})
export default class MissionInfoForm extends Vue {
  @Inject() vm!: NewMissionViewModel
}
</script>

<style scoped></style>
