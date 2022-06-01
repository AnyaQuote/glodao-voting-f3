<template>
  <v-sheet
    class="rounded-lg padding-form"
    :class="$vuetify.breakpoint.mobile ? 'pa-4' : 'pa-6'"
    :outlined="!$vuetify.theme.dark"
  >
    <!-- title -->
    <div class="mb-8">
      <div class="font-weight-600 mb-2" :class="$vuetify.breakpoint.mobile ? 'font-18' : 'text-h5'">
        Project information detail
      </div>
      <div class="d-flex align-center">
        <v-icon size="17" class="mr-2">mdi-information-outline</v-icon>
        <span
          class="text-subtitle-1 font-italic font-weight-regular"
          :class="$vuetify.breakpoint.mobile && 'text-subtitle-2'"
        >
          You can only edit pool information before voting time ended.
        </span>
      </div>
    </div>

    <div class="mb-6 flex-custom mb-6">
      <div class="layout-custom pr--custom mb-4">
        <div class="d-flex mb-4">
          <div class="project-logo flex-shrink-0 pa-1 rounded-lg mr-4 pa-1">
            <v-img height="100%" :src="vm.poolStore.projectLogo" />
          </div>
          <div class="text-truncate">
            <div class="text-h5 font-weight-bold text-truncate">{{ vm.poolStore.projectName }}</div>
            <div class="text-h6 font-weight-bold neutral-10--text">${{ vm.poolStore.tokenName }}</div>
          </div>
        </div>
        <div class="d-flex flex-wrap">
          <div
            v-for="(field, i) in vm.poolStore.fields"
            :key="i"
            class="pa-2 text-caption neutral-20 neutral-10--text rounded-pill mr-2 mb-2 text-uppercase"
          >
            {{ field }}
          </div>
        </div>
      </div>
      <div class="layout-custom pl-custom">
        <v-hover v-slot="{ hover }">
          <v-img aspect-ratio="1" max-height="200" :src="vm.poolStore.projectCover" class="rounded-lg">
            <div v-if="hover" class="fill-height d-flex align-center justify-center">
              <v-btn
                height="24"
                width="100"
                color="text-none text-subtitle-2 neutral-100--text"
                style="background: rgba(255, 255, 255, 0.3)"
                class="pa-2"
              >
                <v-icon right size="13" color="white" class="ma-0 mr-2">mdi-pencil</v-icon>
                Change
              </v-btn>
            </div>
          </v-img>
        </v-hover>
      </div>
    </div>

    <!-- description -->
    <div class="neutral-10--text mb-6 font-weight-regular" :class="$vuetify.breakpoint.mobile && 'text-subtitle-2'">
      {{ vm.poolStore.shortDescription }}
    </div>
    <!-- web social link -->
    <div>
      <div class="mb-4 font-weight-bold">Website and social link</div>
      <div style="display: grid; gap: 12px">
        <div v-for="(key, i) in $_keys(vm.poolStore.socialLinks)" :key="i" class="d-flex text-truncate">
          <v-icon color="app-blue" class="mr-2" size="24">
            {{ key !== 'website' ? `fab fa-${key}` : 'mdi-web' }}
          </v-icon>
          <div class="neutral-10--text text-capitalize mr-1">{{ key }}:</div>
          <a target="_blank" :href="vm.poolStore.socialLinks[key]" class="text-truncate blue--text text-truncate">
            {{ vm.poolStore.socialLinks[key] }}
          </a>
        </div>
      </div>
    </div>
  </v-sheet>
</template>

<script lang="ts">
import { ProjectDetailViewModel } from '@/modules/project/viewmodels/project-detail-viewmodel'
import { Observer } from 'mobx-vue'
import { Component, Inject, Vue } from 'vue-property-decorator'

@Observer
@Component
export default class extends Vue {
  @Inject() vm!: ProjectDetailViewModel

  get statusReport() {
    if (this.vm.poolStore?.onVoting)
      return {
        color: 'app-blue',
        text: 'Your project is opening for vote',
      }
    if (this.vm.poolStore?.status === 'approved')
      return {
        color: 'app-green',
        text: 'Project is approved',
      }
    if (this.vm.poolStore?.status === 'cancelled')
      return {
        color: 'app-red',
        text: 'Project is cancelled',
      }
    if (this.vm.poolStore?.voteEnded)
      return {
        color: 'app-red',
        text: 'Project is ended',
      }

    return {
      color: 'app-grey',
      text: this.vm.poolStore?.status,
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/breakpoint-custom.scss';
.project-logo {
  width: 76px;
  height: 76px;

  @include breakpoint(700) {
    width: 80px;
    height: 80px;
  }
}

.flex-custom {
  display: flex;
  flex-direction: column;

  @include breakpoint(700) {
    flex-direction: row;
  }
}

.layout-custom {
  @include breakpoint(700) {
    width: 50%;
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

.text-truncate--custom {
  max-width: 210px;

  @include breakpoint(desktop) {
    max-width: 190px;
  }
}
</style>
