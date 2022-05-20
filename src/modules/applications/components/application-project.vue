<template>
  <v-sheet class="rounded-lg neutral100--bg" outlined>
    <v-sheet class="d-flex justify-space-between align-center text-h6 rounded-t-lg blue lighten-3">
      <v-sheet height="58" class="d-flex align-stretch">
        <v-sheet
          width="240"
          class="d-flex justify-center align-center font-weight-bold rounded-tl-lg"
          :class="index === 1 ? 'blue white--text' : 'neutral10--text'"
          @click="tab(1)"
        >
          Bounty project
        </v-sheet>
        <v-sheet
          width="240"
          class="d-flex justify-center align-center font-weight-bold"
          :class="index === 2 ? 'blue white--text' : 'neutral10--text'"
          @click="tab(2)"
        >
          Lauchpad project
        </v-sheet>
      </v-sheet>
      <v-checkbox
        dense
        hide-details
        label="Hide rejected project"
        class="pa-0 ma-0 mr-8"
        color="blue"
        :input-value="vm.hideProjectFilter"
        @change="vm.hideProject()"
      ></v-checkbox>
    </v-sheet>
    <v-sheet class="padding-form">
      <project-card v-for="(project, index) in vm.bountyProjects" :key="index" :project="project" class="mb-6" />
    </v-sheet>
  </v-sheet>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Provide, Vue, Inject } from 'vue-property-decorator'
import { Applications } from '../viewmodels/applications-viewmodel'

@Observer
@Component({
  components: {
    'project-card': () => import('./project-card.vue'),
  },
})
export default class AppicationsProject extends Vue {
  @Inject() vm!: Applications

  index = 1

  tab(index: number): void {
    if (this.index !== index) this.index = index
  }
}
</script>

<style lang="scss" scoped>
.padding-form {
  padding: 48px 93.5px;
}
</style>
