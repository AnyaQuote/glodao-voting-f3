<template>
  <div class="section">
    <div class="title font-weight-bold bluePrimary--text">Mission setting</div>
    <switch-field class="label-field" title="Telegram task" subtitle="Join telegram group" />
    <switch-field class="label-field" title="Twitter task" subtitle="Follow project twitter" />
    <switch-field class="label-field" title="Twitter task" subtitle="Quote a tweet">
      <app-text-field placeholder="Enter your hastag" append-icon="fa-solid fa-hashtag" />
    </switch-field>
    <switch-field class="label-field" title="Twitter task" subtitle="Like and reply a post">
      <app-text-field placeholder="Enter your tweet link" append-icon="mdi-link" />
    </switch-field>
    <switch-field class="label-field" title="Learn to earn" subtitle="Learn document and answer question" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator'
import { NewMissionViewModel } from '../../viewmodels/new-mission-viewmodel'
import { Observer } from 'mobx-vue'

@Observer
@Component({
  components: {
    'switch-field': () => import('./switch-field.vue'),
  },
})
export default class MissionSettingForm extends Vue {
  @Inject() vm!: NewMissionViewModel
}
</script>

<style scoped></style>
