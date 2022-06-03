<template>
  <v-sheet class="neutral100-bg rounded-lg" elevation="3" v-if="vm.poolStore" outlined>
    <!-- ------------------------------------- BANNER ------------------------------------------------------------------------ -->
    <!-- desktop banner -->
    <v-img
      v-if="$vuetify.breakpoint.smAndUp"
      max-height="614"
      aspect-ratio="1"
      class="rounded-t-lg"
      :src="$_get(vm.poolStore, 'projectCover')"
    >
      <div class="d-flex flex-column align-center fill-height">
        <div class="fill-height d-flex align-center">
          <div class="rounded-lg py-8 black-opaque--bg">
            <v-sheet class="row no-gutters transparent white--text mx-0 mx-md-16">
              <div class="col-12 font-weight-bold mb-6 text-center" style="font-size: 2rem; line-height: 2.5rem">
                Current result
              </div>
              <!-- ==== yes vote progress circle ==== -->
              <div class="col-12 col-md-6 mb-6 mb-md-0 d-flex justify-center">
                <voting-progress-circle class="flex-shrink-0" color="green lighten-1" value="--" />
                <div class="d-flex flex-column justify-space-around ml-4">
                  <div class="text-h5">👍 YES</div>
                  <div class="text-h6 font-weight-bold">&nbsp;&nbsp;{{ 1000 | shortNumber }} votes</div>
                </div>
              </div>
              <!-- ==== no vote progress circle ==== -->
              <div class="col-12 col-md-6 d-flex justify-center">
                <voting-progress-circle class="flex-shrink-0" color="red lighten-1" value="--" />
                <div class="d-flex flex-column justify-space-around ml-4">
                  <div class="text-h5">👍 NO</div>
                  <div class="font-weight-bold text-h6">&nbsp;&nbsp;{{ 1000 | shortNumber }} votes</div>
                </div>
              </div>
              <!-- =================================== -->
            </v-sheet>
          </div>
        </div>
        <voting-out-btn class="align-self-start mb-8 ml-8" />
      </div>
    </v-img>
    <!-- mobile banner -->
    <v-sheet v-else>
      <v-img max-height="244" class="rounded-t-lg" :src="vm.poolStore.projectCover" />
      <div class="pa-4 d-flex flex-column">
        <div class="font-18 font-weight-bold mb-2">Current result</div>
        <!-- ==== yes vote progress content ==== -->
        <v-sheet class="rounded-lg pa-4 mb-2 green lighten-4 d-flex align-baseline black--text" outlined>
          <span class="font-18 font-weight-bold mr-8">---%</span>
          <span class="text-subtitle-2 spacer">--- upvotes</span>
          <v-chip label color="green lighten-2" class="white--text rounded-lg px-6">👍 YES votes</v-chip>
        </v-sheet>
        <!-- ==== no vote progress content ==== -->
        <v-sheet class="rounded-lg pa-4 mb-2 red lighten-4 d-flex align-baseline black--text" outlined>
          <span class="font-18 font-weight-bold mr-8">---%</span>
          <span class="text-subtitle-2 spacer">--- downvotes</span>
          <v-chip label color="red lighten-2" class="white--text rounded-lg px-6">👍 NO votes</v-chip>
        </v-sheet>
        <!-- ==================================== -->
      </div>
    </v-sheet>
    <!-- ------------------------------------- VOTE BUTTON  ------------------------------------------------------------------ -->
    <voting-detail-button @buttonClick="openConfirmDialog" />
    <!-- ------------------------------------- OVERVIEW ---------------------------------------------------------------------- -->
    <v-sheet class="pa-6 rounded-lg rounded-t-0">
      <div class="row">
        <!-- ==== PROJECT NAME ==== -->
        <div class="col-md-8 col-12 d-flex align-center text-h4 font-weight-bold">
          <v-img class="mr-6" max-width="64" aspect-ratio="1" :src="$_get(vm.poolStore, 'projectLogo')" />
          {{ $_get(vm.poolStore, 'projectName') }}
        </div>
        <!-- ==== COUNT DOWN AND STATUS ==== -->
        <div class="col-md-4 col-12">
          <countdown v-if="$_get(vm.poolStore, 'onVoting')" :to="$_get(vm.poolStore, 'endDate')" class="text-h5" />
          <v-sheet
            v-else
            height="40"
            class="d-flex justify-center align-center rounded font-weight-600 text-subtitle-1"
            :class="statusReport.color"
            outlined
          >
            {{ statusReport.text }}
          </v-sheet>
        </div>
        <!-- ==== CARDS ==== -->
        <div class="col-12">
          <div class="row no-gutters">
            <!-- Total reward card -->
            <v-sheet
              class="col-12 col-md-2 mb-2 mb-md-0 mr-md-4 mr-0 rounded-lg pa-6 neutral10--text d-flex flex-row flex-md-column align-md-start align-center justify-start justify-space-between flex-wrap text-truncate"
              elevation="3"
              outlined
            >
              <div class="font-weight-medium">Total reward</div>
              <div class="d-flex align-center">
                <span class="text-h6 font-weight-bold"
                  >{{ $_get(vm.poolStore, 'amount') | formatNumber }} {{ $_get(vm.poolStore, 'tokenName') }}
                </span>
                <v-img src="@/assets/icons/crypto.svg" class="ml-2" max-width="24" max-height="24" />
              </div>
            </v-sheet>
            <!-- Total mission card -->
            <v-sheet
              class="col-12 col-md-2 mb-2 mb-md-0 mr-md-4 mr-0 rounded-lg pa-6 neutral10--text mr-4 d-flex flex-row flex-md-column align-md-start align-center justify-start justify-space-between flex-wrap text-truncate"
              elevation="3"
              outlined
            >
              <div class="font-weight-medium">Total missions</div>
              <div class="d-flex align-center">
                <span class="text-h6 font-weight-bold">{{ $_get(vm.poolStore, 'totalMission') }} </span>
                <v-img src="@/assets/icons/bulleyes.svg" class="ml-2" max-width="24" max-height="24" />
              </div>
            </v-sheet>
            <!-- Mission reward card -->
            <v-sheet
              class="col-12 col-md-2 mb-2 mb-md-0 mr-0 mr-md-4 rounded-lg pa-6 neutral10--text d-flex flex-row flex-md-column align-md-start align-center justify-start justify-space-between flex-wrap text-truncate"
              elevation="3"
              outlined
            >
              <span class="font-weight-medium">Mission reward</span>
              <div class="d-flex align-center">
                <span class="text-h6 font-weight-bold"
                  >{{ $_get(vm.poolStore, 'rewardPerMission') | formatNumber }}
                  {{ $_get(vm.poolStore, 'tokenName') }}</span
                >
                <v-img src="@/assets/icons/crypto.svg" class="ml-2" max-width="24" max-height="24" />
              </div>
            </v-sheet>
            <!-- Total reward value item -->
            <v-sheet
              class="col-12 col-md-2 mb-2 mb-md-0 mr-0 mr-md-4 rounded-lg pa-6 neutral10--text d-flex flex-row flex-md-column align-md-start align-center justify-start justify-space-between flex-wrap text-truncate"
              elevation="3"
              outlined
            >
              <div class="font-weight-medium">Total reward value</div>
              <div class="d-flex align-center">
                <span class="text-h6 font-weight-bold"
                  >{{ $_get(vm.poolStore, 'amount') | formatNumber }} {{ $_get(vm.poolStore, 'tokenName') }}</span
                >
                <v-img src="@/assets/icons/crypto.svg" class="ml-2" max-width="24" max-height="24" />
              </div>
            </v-sheet>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on" class="align-stretch mt-2" color="grey2">mdi-information</v-icon>
              </template>
              <span>Token rewards are calculated according to the price at the time of pool closing</span>
            </v-tooltip>
          </div>
        </div>
        <!-- ==== DESCRIPTION ==== -->
        <div class="col-12">
          <ul>
            <li class="neutral-10--text">{{ vm.poolStore.shortDescription }}</li>
          </ul>
        </div>
        <!-- ==== LABElS ==== -->
        <div class="col-md-8 col-12 ma-n1">
          <v-chip class="ma-1 text-uppercase" :color="`${typeColor} lighten-5`" :text-color="typeColor" label>{{
            vm.poolStore.type
          }}</v-chip>
          <v-chip class="ma-1 text-uppercase neutral-20" label v-for="(field, i) in vm.poolStore.fields" :key="i">{{
            field
          }}</v-chip>
        </div>
        <!-- ==== SOCIAL LINKS ==== -->
        <div class="col-md-4 col-12 d-flex justify-md-end justify-start align-center">
          <v-btn v-for="([icon, link], index) in vm.socialLinks" :href="link" color="blue-diversity" :key="index" icon>
            <v-icon small>fab fa-{{ icon }}</v-icon>
          </v-btn>
          <v-btn icon color="blue-diversity" :href="$_get(vm.poolStore, 'website')">
            <icon-git-book />
          </v-btn>
        </div>
      </div>
    </v-sheet>
    <!-- ------------------------------------------------------------------------------------------------------------------- -->
    <!-- <vote-prep-dialog ref="vote-prep-dialog" @openConfirmDialog="openConfirmDialog" /> -->
    <vote-confirm-dialog ref="vote-confirm-dialog" :voteResult="voteResult" />
  </v-sheet>
</template>

<script lang="ts">
import { Component, Vue, Ref, Inject } from 'vue-property-decorator'
import { VotingDetailViewModel } from '../viewmodels/voting-detail-viewmodel'
import VotingProgressCircle from './common/voting-progress-circle.vue'

@Component({
  components: {
    'voting-out-btn': () => import('../components/common/voting-out-btn.vue'),
    'voting-progress-circle': () => import('../components/common/voting-progress-circle.vue'),
    countdown: () => import('../components/common/countdown.vue'),
    'icon-git-book': () => import('@/assets/icons/icon-git-book.vue'),
    'voting-detail-button': () => import('../components/detail/voting-detail-button.vue'),
    'vote-confirm-dialog': () => import('../components/detail/vote-confirm-dialog.vue'),
  },
})
export default class VotingDetailOverview extends Vue {
  // @Ref('vote-prep-dialog') votePrepDialog
  @Ref('vote-confirm-dialog') voteConfirmDialog
  @Inject() vm!: VotingDetailViewModel

  voteResult = ''

  // openDialog() {
  //   this.votePrepDialog.open()
  // }

  openConfirmDialog(voteResult) {
    this.voteResult = voteResult
    this.voteConfirmDialog.open()
  }

  get typeColor() {
    return this.vm.poolStore?.type === 'bounty' ? 'orange' : 'green'
  }

  get statusReport() {
    if (this.vm.poolStore?.status === 'approved')
      return {
        color: 'green--text',
        text: 'Project is approved',
      }
    if (this.vm.poolStore?.status === 'cancelled')
      return {
        color: 'red--text',
        text: 'Project is cancelled',
      }
    if (this.vm.poolStore?.voteEnded)
      return {
        color: 'red--text',
        text: 'Project is ended',
      }
    return {
      color: 'grey--text',
      text: this.vm.poolStore?.status,
    }
  }
}
</script>

<style lang="scss" scoped></style>
