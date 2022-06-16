<template>
  <div class="container-custom mx-auto">
    <v-row no-gutters dense>
      <v-col cols="12">
        <div class="d-flex layout-custom">
          <div class="spacer pr--custom mb-6">
            <project-voting-time class="mb-6" />
            <bounty-pool-info-setting />
          </div>
          <div class="layout-item-custom pl--custom mb-6">
            <voting-info />
          </div>
        </div>
      </v-col>
      <v-col cols="12">
        <v-row no-gutters dense>
          <v-col cols="12" md="8" class="pr-md-10">
            <project-info-detail />
          </v-col>
          <v-col cols="12" md="4"></v-col>
        </v-row>
      </v-col>
    </v-row>
    <!-- <update-project-dialog ref="update-dialog" /> -->
  </div>
</template>

<script lang="ts">
import { ProjectDetailViewModel } from '@/modules/project/viewmodels/project-detail-viewmodel'
import { Observer } from 'mobx-vue'
import { Component, Inject, Vue } from 'vue-property-decorator'

@Observer
@Component({
  components: {
    'project-voting-time': () => import('./common/project-voting-time.vue'),
    'bounty-pool-info-setting': () => import('./common/bounty-pool-info-setting.vue'),
    'project-info-detail': () => import('./common/project-info-detail.vue'),
    'voting-info': () => import('./common/voting-info.vue'),
    'update-project-dialog': () => import('../dialogs/update-project-dialog.vue'),
  },
})
export default class extends Vue {
  @Inject() vm!: ProjectDetailViewModel

  // @Ref('update-dialog') dialog: any

  // open() {
  //   this.dialog.open()
  // }
}
</script>

<style lang="scss" scoped>
@import '@/styles/breakpoint-custom.scss';
.container-custom {
  max-width: 360px;

  @include breakpoint(700) {
    max-width: 700px;
  }

  @include breakpoint(desktop) {
    max-width: 1090px;
  }
}

.pl--custom {
  @include breakpoint(700) {
    padding-left: 8px;
  }

  @include breakpoint(desktop) {
    padding-left: 12px;
  }
}

.pr--custom {
  @include breakpoint(700) {
    padding-right: 8px;
  }

  @include breakpoint(desktop) {
    padding-right: 12px;
  }
}

.layout-custom {
  flex-direction: column;

  @include breakpoint(700) {
    flex-direction: row;
  }
}

.layout-item-custom {
  @include breakpoint(700) {
    width: 50%;
  }
  @include breakpoint(desktop) {
    width: 36%;
  }
}

.project-info-detail {
  @include breakpoint(desktop) {
    padding-right: 40px;
  }
}
</style>
