<template>
  <v-row>
    <v-col cols="12" class="full-width">
      <v-img src="@/assets/images/new-project--banner.png" />
    </v-col>
    <v-col cols="12">
      <v-sheet class="d-flex justify-center align-center blue lighten-4 py-6">
        <v-avatar size="48" class="mr-4">
          <v-img src="@/assets/icons/bulleyes.svg" />
        </v-avatar>
        <span class="text-h5 text-uppercase font-weight-bold">Launchpad Project</span>
      </v-sheet>
    </v-col>
    <v-col cols="3">
      <launchpad-stepper />
    </v-col>
    <v-col cols="9">
      <project-info v-if="vm.step === 1.1" />
      <token-info v-if="vm.step === 1.2" />
      <raising-info v-if="vm.step === 1.3" />
      <confirm v-if="vm.step === 2.1" />
      <send-token v-if="vm.step === 3.1" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator'
import { LaunchpadFormViewModel } from '../viewmodels/launchpad-form-viewmodel'

@Component({
  components: {
    'launchpad-stepper': () => import('../components/regist-launchpad/launchpad-stepper.vue'),
    'project-info': () => import('../components/regist-launchpad/project-info.vue'),
    'token-info': () => import('../components/regist-launchpad/token-info.vue'),
    'raising-info': () => import('../components/regist-launchpad/raising-info.vue'),
    confirm: () => import('../components/regist-launchpad/confirm.vue'),
    'send-token': () => import('../components/regist-launchpad/send-token.vue'),
  },
})
export default class LaunchpadForm extends Vue {
  @Provide() vm = new LaunchpadFormViewModel()
}
</script>

<style lang="scss" scoped></style>
