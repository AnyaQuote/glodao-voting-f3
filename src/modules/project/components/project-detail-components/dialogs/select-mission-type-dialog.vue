<template>
  <app-dialog ref="dialog" v-slot="{ close }">
    <v-card>
      <v-card-title>
        <v-spacer />
        <v-icon @click="close">mdi-close</v-icon>
      </v-card-title>
      <v-card-text tag="div">
        <div class="text-h6 font-weight-bold text-center">Please select type of mission to start creating</div>
        <v-radio-group mandatory v-model="type">
          <div class="d-flex flex-column">
            <v-sheet class="rounded pa-5" outlined :class="isActive('1')">
              <v-radio color="blue-diversity" value="1">
                <template #label>
                  <span class="font-18 font-weight-bold" :class="isActive('1')">Social & Learn mission</span>
                </template>
              </v-radio>
              <div class="text-subtitle-2 font-weight-regular">Setting social tasks or learn to earn tasks</div>
            </v-sheet>
            <v-sheet class="rounded pa-5 fill-heigh mt-4" outlined :class="isActive('2')">
              <v-radio color="blue-diversity" value="2" disabled>
                <template #label>
                  <span class="font-18 font-weight-bold" :class="isActive('2')">
                    <span>Trial mission app (Comming soon)</span>
                  </span>
                </template>
              </v-radio>
              <div class="text-subtitle-2 font-weight-regular">Setting tasks</div>
            </v-sheet>
          </div>
        </v-radio-group>
        <div class="d-flex">
          <v-btn class="flex-grow" outlined depressed @click="close">Cancel</v-btn>
          <div class="mx-6"></div>
          <v-btn class="flex-grow linear-blue--bg white--text" outlined depressed @click="goToNewMission">Next</v-btn>
        </div>
      </v-card-text>
    </v-card>
  </app-dialog>
</template>

<script lang="ts">
import { EMPTY_STRING } from '@/constants'
import { ProjectDetailViewModel } from '@/modules/project/viewmodels/project-detail-viewmodel'
import { RouteName } from '@/router'
import { get } from 'lodash-es'
import { Observer } from 'mobx-vue'
import { Component, Inject, Ref, Vue } from 'vue-property-decorator'

@Observer
@Component
export default class SelectMissionTypeDialog extends Vue {
  @Inject() vm!: ProjectDetailViewModel
  @Ref('dialog') dialog
  type = ''

  open() {
    this.dialog.open()
  }

  goToNewMission() {
    if (this.type === '1') {
      this.$router.push({
        name: RouteName.NEW_MISSION,
        params: {
          unicodeName: get(this.vm.poolStore, 'unicodeName', EMPTY_STRING),
        },
      })
    } else {
      this.$router.push({
        name: RouteName.NEW_IAT_MISSION,
        params: {
          unicodeName: get(this.vm.poolStore, 'unicodeName', EMPTY_STRING),
        },
      })
    }
  }

  get isActive() {
    return (type: string) => (this.type === type ? 'active-type' : '')
  }
}
</script>

<style scoped>
.active-type {
  color: var(--v-blue-diversity-base) !important;
  border-color: var(--v-blue-diversity-base) !important;
  background-color: var(--v-blue-2-base) !important;
}
</style>
