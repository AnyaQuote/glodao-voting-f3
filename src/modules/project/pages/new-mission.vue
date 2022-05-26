<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12">
        <div class="d-flex align-center justify-start" @click="goBack">
          <v-icon>mdi-arrow-left</v-icon>
          <span class="text-h6 bluePrimary--text cursor-pointer ml-7">Back to project</span>
        </div>
      </v-col>
      <v-col cols="10">
        <v-sheet class="neutral100--bg rounded-lg" outlined>
          <div class="blue lighten-4 py-6 text-center rounded-lg rounded-b-0">
            <span class="text-h5 font-weight-bold text-uppercase">Create mission</span>
          </div>
          <v-divider />
          <v-form ref="form" class="pa-7">
            <!-- MISSION, REWARD AND TIME INFORMATION -->
            <mission-info />
            <!-- MISSION SETTING -->
            <mission-setting />
            <v-btn class="linear-blue--bg white--text text-none mt-7" height="40" depressed block @click="submit">
              Create
            </v-btn>
          </v-form>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Vue, Provide, Ref } from 'vue-property-decorator'
import { NewMissionViewModel } from '../viewmodels/new-mission-viewmodel'

@Observer
@Component({
  components: {
    'mission-info': () => import('../components/new-mission/mission-info.vue'),
    'mission-setting': () => import('../components/new-mission/mission-setting.vue'),
  },
})
export default class MissionForm extends Vue {
  @Provide() vm = new NewMissionViewModel()
  @Ref('form') form
  goBack() {
    this.$router.go(-1)
  }
  submit() {
    this.form.validate()
    // this.vm.submit()
  }
}
</script>

<style lang="scss" scoped></style>
