<template>
  <div>
    <banner />
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-sheet class="d-flex justify-center align-center py-6 blue lighten-4">
            <v-avatar size="48" class="mr-4">
              <v-img src="@/assets/icons/bulleyes.svg" />
            </v-avatar>
            <span class="text-h5 text-uppercase">Bounty Project</span>
          </v-sheet>
        </v-col>
        <v-col cols="12" md="3">
          <bounty-stepper />
        </v-col>
        <v-col cols="12" md="9">
          <v-slide-y-transition fixed>
            <project-info v-if="vm.step === 1.1" />
            <confirm-payment v-if="vm.step === 2.1" />
          </v-slide-y-transition>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { authStore } from '@/stores/auth-store'
import { Component, Vue, Provide, Inject } from 'vue-property-decorator'
import { component } from 'vue/types/umd'
import { BountyApplyViewModel } from '../viewmodels/bounty-apply-viewmodel'

@Component({
  components: {
    'bounty-stepper': () => import('../components/regist-bounty/bounty-stepper.vue'),
    'project-info': () => import('../components/regist-bounty/project-info.vue'),
    'confirm-payment': () => import('../components/regist-bounty/confirm.vue'),
    banner: () => import('../components/common/banner.vue'),
  },
})
export default class ProjectRegistDetail extends Vue {
  @Provide() vm = new BountyApplyViewModel()
}
</script>

<style lang="scss" scoped></style>
