<template>
  <div class="d-flex">
    <!-------------------------- LEFT ------------------------>
    <div style="max-width: 700px" class="pr-6">
      <v-sheet class="rounded-lg pa-6 mb-6 app-blue lighten-1" elevation="3">
        <div class="d-flex align-stretch mb-6">
          <v-sheet height="76" width="76" class="white pa-1 rounded-lg d-flex justify-center mr-6">
            <img :src="require('@/assets/icons/voting-trending--logo.png')" height="100%" />
          </v-sheet>
          <div class="d-flex flex-column justify-center">
            <div class="text-h5 font-weight-bold neutral0--text font-weight-bold mb-1">
              {{ vm.poolDetail.projectName }}
            </div>
            <div class="text-h6 font-weight-bold neutral10--text">${{ vm.poolDetail.data.tokenName }}</div>
          </div>
          <div></div>
        </div>
        <div>
          <div class="mb-2">
            <span class="neutral10--text">Voting starts: </span>
            <span class="neutral0--text font-weight-bold">24/02/2022 10:00 pm </span>
          </div>
          <div>
            <span class="neutral10--text">Voting end: </span>
            <span class="neutral0--text font-weight-bold">24/02/2022 10:00 pm </span>
          </div>
        </div>
      </v-sheet>

      <v-sheet class="rounded-lg pa-6 mb-6" elevation="2">
        <div class="text-h5 font-weight-regular mb-6">Bounty pool information setting</div>
        <v-row no-gutters dense class="mb-6">
          <v-col cols="4">
            <div class="neutral10--text mb-1">Total reward amount</div>
            <div class="neutral0--text font-weight-bold">{{ 10000 | formatNumber(2, 2) }} HWD</div>
          </v-col>
          <v-col cols="4">
            <div class="neutral10--text mb-1">Total mission</div>
            <div class="neutral0--text font-weight-bold">100</div>
          </v-col>
          <v-col cols="4">
            <div class="neutral10--text mb-1">Reward per mission</div>
            <div class="neutral0--text font-weight-bold">{{ 1000 | formatNumber(2, 2) }} HWD</div>
          </v-col>
        </v-row>
        <v-divider class="mb-6"></v-divider>
        <div class="d-flex align-center">
          <span class="neutral0--text pr-6">Campaign time:</span>
          <span class="font-weight-bold">Jan 21st, 10:00 pm</span>
          <span style="width: 4px; height: 4px" class="rounded-circle app-grey mx-2"> </span>
          <span class="font-weight-bold">Jan 21st, 10:00 pm</span>
        </div>
      </v-sheet>

      <v-sheet class="rounded-lg pa-6" elevation="2">
        <!-- title -->
        <div class="mb-7">
          <div class="d-flex align-baseline justify-space-between mb-2">
            <div class="font-weight-600 text-h5 neutral0--text mr-5">Project information detail</div>
            <div class="font-weight-600 text-subtitle-1 blue--text d-flex">
              Edit infomation<v-icon size="17" color="blue" class="ml-2" @click="open()">mdi-pencil</v-icon>
            </div>
          </div>
          <v-icon size="17" class="mr-2">mdi-information-outline</v-icon>
          <span class="text-subtitle-1 font-italic">You can only edit pool information before voting time ended.</span>
        </div>

        <v-row class="mb-6">
          <v-col cols="6">
            <div class="d-flex align-stretch mb-4">
              <v-sheet height="76" width="76" class="white pa-1 rounded-lg d-flex align-center mr-6">
                <img :src="require('@/assets/icons/voting-trending--logo.png')" height="100%" />
              </v-sheet>
              <div class="d-flex flex-column">
                <div class="text-h5 font-weight-bold neutral0--text mb-1">{{ vm.poolDetail.projectName }}</div>
                <div class="text-h6 font-weight-bold neutral10--text">${{ vm.poolDetail.data.tokenName }}</div>
              </div>
            </div>
            <div class="d-flex flex-wrap">
              <div
                v-for="(field, i) in vm.poolDetail.data.fields"
                :key="i"
                class="pa-2 text-caption neutral20 neutral10--text rounded-pill mr-2 text-uppercase"
              >
                {{ field }}
              </div>
            </div>
          </v-col>
          <v-col cols="6">
            <v-hover v-slot="{ hover }">
              <v-img :src="vm.poolDetail.data.projectCover" class="rounded-lg">
                <div v-if="hover" class="fill-height d-flex align-center justify-center">
                  <v-btn
                    height="24"
                    width="100"
                    color="text-none text-subtitle-2 neutral100--text"
                    style="background: rgba(255, 255, 255, 0.3)"
                    class="pa-2"
                  >
                    <v-icon right size="13" color="white" class="ma-0 mr-2">mdi-pencil</v-icon>
                    Change
                  </v-btn>
                </div>
              </v-img>
            </v-hover>
          </v-col>
        </v-row>

        <!-- description -->
        <div class="neutral10--text mb-6">{{ vm.poolDetail.data.shortDescription }}</div>
        <!-- web social link -->
        <div class="mb-7">
          <div class="mb-4 font-weight-bold">Website and social link</div>
          <div class="">
            <a
              v-for="(key, i) in $_keys(vm.poolDetail.data.socialLinks)"
              :key="i"
              :href="$_get(vm.poolDetail.data.socialLinks, key)"
              :class="i !== $_keys(vm.poolDetail.data.socialLinks).length - 1 && 'mb-2'"
              target="_blank"
              class="text-decoration-none d-block"
            >
              <v-row no-gutters dense align="center" class="text-subtitle-1">
                <img :src="require(`@/assets/socials/${key}.light.svg`)" width="24" height="24" class="mr-2" />
                <span class="neutral10--text text-capitalize mr-1">{{ key }}</span>
                <span class="blue--text">{{ vm.poolDetail.data.socialLinks[key] }}</span>
              </v-row>
            </a>
          </div>
        </div>
      </v-sheet>
    </div>

    <!-------------------------- RIGHT ------------------------>
    <div class="spacer">
      <v-sheet class="rounded-lg" elevation="3">
        <v-sheet
          height="40"
          class="rounded-t-lg d-flex align-center justify-center white--text cursor-pointer"
          :color="vm.cancelled ? 'linear-blue--bg' : 'red'"
          @click="vm.changeCancelDialog()"
        >
          {{ vm.cancelled ? 'Withdraw token' : 'Cancel project' }}
        </v-sheet>
        <v-sheet class="pa-6">
          <div class="font-weight-bold neutral0--text mb-3">Final result</div>
          <v-sheet
            height="40"
            class="d-flex align-center justify-center neutral100--text rounded"
            :class="vm.cancelled ? 'red' : 'blue'"
          >
            {{ vm.cancelled ? 'Your project is rejected' : 'Your project is opening for vote' }}
          </v-sheet>
        </v-sheet>
        <div class="pa-6">
          <v-sheet class="d-flex align-baseline mb-2">
            <v-sheet
              height="27"
              width="60"
              class="d-flex justify-center align-center rounded-lg white--text subtitle-2 font-weight-400 mr-3 green lighten-2"
            >
              👍 YES
            </v-sheet>
            <v-sheet class="text-subtitle-1">We want the project to launch </v-sheet>
          </v-sheet>
          <progress-bar :value="70" class="mb-2" />
          <v-sheet class="d-flex justify-space-between text-subtitle-2 font-weight-600">
            <v-sheet>100 votes</v-sheet>
            <v-sheet>90,00%</v-sheet>
          </v-sheet>
        </div>
        <div class="pa-6">
          <v-sheet class="d-flex align-baseline mb-2">
            <v-sheet
              height="27"
              width="60"
              class="d-flex justify-center align-center rounded-lg white--text subtitle-2 font-weight-400 mr-3 red"
            >
              👍 NO
            </v-sheet>
            <v-sheet class="text-subtitle-1">We don't want the project to launch </v-sheet>
          </v-sheet>
          <progress-bar :value="70" class="mb-2" />
          <v-sheet class="d-flex justify-space-between text-subtitle-2 font-weight-600">
            <v-sheet>100 votes</v-sheet>
            <v-sheet>90,00%</v-sheet>
          </v-sheet>
        </div>
      </v-sheet>
    </div>
    <update-project-dialog ref="update-dialog" />
  </div>
</template>

<script lang="ts">
import { ProjectDetailViewModel } from '@/modules/project/viewmodels/project-detail-viewmodel'
import { Observer } from 'mobx-vue'
import { Component, Inject, Ref, Vue } from 'vue-property-decorator'

@Observer
@Component({
  components: {
    'update-project-dialog': () => import('../dialogs/update-project-dialog.vue'),
  },
})
export default class extends Vue {
  @Inject() vm!: ProjectDetailViewModel

  @Ref('update-dialog') dialog: any

  open() {
    this.dialog.open()
  }
}
</script>

<style scoped></style>
