<template>
  <div class="mt-7">
    <div class="title font-weight-bold bluePrimary--text">Mission setting</div>
    <!-- Setting one -->
    <switch-field
      class="mt-4"
      title="Telegram task"
      :value="settingOneValue"
      @change="vm.updateMissionSetting('twitter', $event)"
      subtitle="Join telegram group"
    ></switch-field>

    <!-- Setting two -->
    <switch-field
      class="mt-4"
      title="Twitter task"
      :value="settingTwoValue"
      @change="vm.updateMissionSetting('twitter', $event)"
      subtitle="Follow project twitter"
    />

    <!-- Setting three -->
    <switch-field class="mt-4" title="Twitter task" value="" subtitle="Quote a tweet">
      <!-- <template v-slot="{ required }"> -->
      <v-form ref="1">
        <app-text-field placeholder="Enter your hastag" append-icon="fa-solid fa-hashtag" />
      </v-form>
      <!-- </template> -->
    </switch-field>

    <!-- Setting four -->
    <switch-field class="mt-4" title="Twitter task" subtitle="Like and reply a post">
      <!-- <template v-slot="{ required }"> -->
      <v-form ref="2">
        <app-text-field placeholder="Enter your tweet link" append-icon="mdi-link" />
      </v-form>
      <!-- </template> -->
    </switch-field>

    <!-- Setting learn to earn quiz -->
    <switch-field class="mt-4" title="Learn to earn" subtitle="Learn document and answer question">
      <!-- <template v-slot="{ required }"> -->
      <v-form ref="3" class="d-flex flex-column">
        <div class="font-18 font-weight-bold">Task name</div>
        <app-text-field
          :rules="[$rules.required]"
          @change="vm.changeLearnToEarnInfo('name', $event)"
          class="mt-2"
          placeholder="Enter task name"
        />
        <div class="font-18 font-weight-bold mt-6">Short description</div>
        <app-textarea
          :rules="[$rules.required]"
          @change="vm.changeLearnToEarnInfo('shortDescription', $event)"
          class="mt-2"
          placeholder="Enter short description that describes the mission"
        />
        <div class="font-18 font-weight-bold mt-6">Quiz cover</div>
        <image-upload-field @change="vm.changeLearnToEarnInfo('imageCover', $event)" class="mt-2" />
        <div class="font-18 mt-6 d-flex">
          <span class="font-weight-bold">Quiz file</span>
          <v-spacer />
          <span class="app-blue--text">Download the quiz template</span>
        </div>
        <file-selector :rules="[$rules.required]" @change="vm.changeLearnToEarnInfo('quizFile', $event)" class="mt-2" />
        <div class="d-flex mt-6">
          <span class="font-weight-bold">Document</span>
          <v-spacer />
          <span class="app-blue--text">Download the quiz template</span>
        </div>
        <file-selector
          :rules="[$rules.required]"
          @change="vm.changeLearnToEarnInfo('learningFile', $event)"
          class="mt-2"
        />
      </v-form>
      <!-- </template> -->
    </switch-field>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Inject, Ref } from 'vue-property-decorator'
import { NewMissionViewModel, settingOneValue, settingTwoValue } from '../../viewmodels/new-mission-viewmodel'
import { Observer } from 'mobx-vue'

@Observer
@Component({
  components: {
    'switch-field': () => import('./common/switch-field.vue'),
    'file-selector': () => import('./file-selector.vue'),
    'image-upload-field': () => import('@/components/image-upload-field.vue'),
  },
})
export default class MissionSettingForm extends Vue {
  @Inject() vm!: NewMissionViewModel
  @Ref('1') form1
  @Ref('2') form2
  @Ref('3') form3

  settingOneValue = settingOneValue
  settingTwoValue = settingTwoValue

  mounted() {
    this.vm.injectForm([this.form1, this.form2, this.form3])
  }
}
</script>

<style scoped></style>
