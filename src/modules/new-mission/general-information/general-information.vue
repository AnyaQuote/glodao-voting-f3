<template>
  <div>
    <banner />
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-sheet class="d-flex justify-center align-center py-6 blue-2 lighten-1 lighten-4 mt-6">
            <v-avatar size="48" class="mr-4">
              <v-img src="@/assets/icons/bulleyes.svg" />
            </v-avatar>
            <span class="text-h5 text-uppercase font-weight-bold">Bounty Project</span>
          </v-sheet>
        </v-col>

        <v-col cols="12">
          <div class="mb-6">
            <v-slide-y-transition leave-absolute>
              <project-info />
            </v-slide-y-transition>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator'
import { GeneralInformationViewModel } from '../viewmodels/general-information-viewmodel'

@Component({
  components: {
    'pool-info': () => import('../components/regist-bounty/pool-info.vue'),
    'project-info': () => import('../components/regist-bounty/project-info.vue'),
    banner: () => import('../components/common/banner.vue'),
  },
})
export default class ProjectRegistDetail extends Vue {
  @Provide() vm = new GeneralInformationViewModel()
}
</script>

<style lang="scss" scoped></style>
