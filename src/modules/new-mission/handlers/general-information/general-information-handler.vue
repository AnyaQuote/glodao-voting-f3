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
              <project-info :handler="handler" />
            </v-slide-y-transition>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide, Prop, Watch } from 'vue-property-decorator'
import { GeneralInformationHandler } from '../general-information/general-information-handler'

@Component({
  components: {
    'project-info': () => import('@/modules/new-mission/components/regist-bounty/project-info.vue'),
    banner: () => import('@/modules/new-mission/components/common/banner.vue'),
  },
})
export default class ProjectRegistDetail extends Vue {
  @Prop() handler!: GeneralInformationHandler
}
</script>

<style lang="scss" scoped></style>
