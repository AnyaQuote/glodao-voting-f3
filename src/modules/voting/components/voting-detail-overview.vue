<template>
  <v-sheet class="neutral100-bg rounded-lg" elevation="3" v-if="vm.poolStore" outlined>
    <!-- ------------------------------------------------------------------------------------------------------------- -->
    <v-sheet>
      <v-img v-if="$vuetify.breakpoint.smAndUp" class="rounded-t-lg" :src="vm.poolStore.projectCover">
        <div class="d-flex flex-column align-center fill-height">
          <voting-out-btn class="align-self-end mt-4 mr-4" width="51" height="51" />
          <div class="fill-height d-flex align-center pb-16">
            <div class="rounded-lg py-10 blur--bg">
              <div class="text-h5 text-center font-weight-bold mb-10 white--text">Current result</div>
              <div class="d-flex justify-center transparent white--text mx-16">
                <div>
                  <div class="d-flex align-center justify-space-between">
                    <span class="text-h6">👍YES</span>
                    <span class="font-weight-bold font-14">{{ $_get(vm.poolStore, 'votedPercent', 0) }} %</span>
                  </div>
                  <v-progress-linear
                    style="width: 400px"
                    :value="+$_get(vm.poolStore, 'votedPercent', 0)"
                    color="success"
                    height="25"
                  ></v-progress-linear>
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-img>
      <v-sheet v-else>
        <v-img max-height="244" class="rounded-t-lg" :src="vm.poolStore.projectCover" />
        <div class="pa-4 d-flex flex-column">
          <div class="font-18 font-weight-bold mb-2">Current result</div>
          <v-sheet class="rounded-lg pa-4 mb-2 green lighten-4 d-flex align-baseline" outlined>
            <span class="font-18 font-weight-bold mr-8">---%</span>
            <span class="text-subtitle-2 neutral10--text spacer">--- upvotes</span>
            <v-chip label color="green lighten-2" class="white--text rounded-lg px-6">👍 YES votes</v-chip>
          </v-sheet>
          <!-- <v-sheet class="rounded-lg pa-4 red lighten-4 d-flex align-baseline" outlined>
            <span class="font-18 font-weight-bold mr-8">{{ downvote }}%</span>
            <span class="text-subtitle-2 neutral10--text spacer"> 1000 downvotes</span>
            <v-chip label color="red lighten-1" class="white--text rounded-lg px-6">👎 NO votes</v-chip>
          </v-sheet> -->
        </div>
      </v-sheet>
    </v-sheet>
    <voting-detail-button @buttonClick="openConfirmDialog" />
    <!-- BANNER SECTION END -->
    <v-sheet class="pa-6 rounded-lg rounded-t-0">
      <div class="row">
        <div class="col-md-8 col-12">
          <div class="text-h4 font-weight-bold">{{ vm.poolStore.projectName }}</div>
        </div>
        <div class="col-4">
          <countdown :to="vm.poolStore.endDate" class="text-h5" />
        </div>
        <div class="col-12">
          <div class="row">
            <v-sheet class="rounded-lg pa-6 neutral10--text font-weight-medium mr-4" elevation="3">
              <div>Total reward</div>
              <div class="d-flex align-center">
                <span class="text-h6 font-weight-bold"
                  >{{ vm.poolStore.amount | formatNumber(2, 0) }} {{ vm.poolStore.rewardTokenSymbol }}
                </span>
              </div>
            </v-sheet>
            <v-sheet class="rounded-lg pa-6 neutral10--text font-weight-medium mr-4" elevation="3">
              <div>Total missions</div>
              <div class="d-flex align-center">
                <span class="text-h6 font-weight-bold">{{ vm.poolStore.totalMission | formatNumber(0) }} </span>
              </div>
            </v-sheet>
            <v-sheet class="rounded-lg pa-6 neutral10--text font-weight-medium mr-4" elevation="3">
              <div>Mission reward</div>
              <div class="d-flex align-center">
                <span class="text-h6 font-weight-bold"
                  >{{ vm.poolStore.rewardPerMission | formatNumber }} {{ vm.poolStore.rewardTokenSymbol }}</span
                >
              </div>
            </v-sheet>
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on" class="align-stretch mt-2" color="grey2">mdi-information</v-icon>
              </template>
              <span>Token rewards are calculated according to the price at the time of pool closing</span>
            </v-tooltip>
          </div>
        </div>
        <div class="col-12">
          <div>
            {{ vm.poolStore.shortDescription }}
          </div>
          <!-- <ul class="mb-n4">
            <li v-for="i in [1, 2, 3]" :key="i" class="mb-4">
              Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis
              enim velit mollit. Exercitation veniam consequat sunt nostrud amet. Velit officia consequat duis enim
              velit mollit. Exercitation veniam consequat sunt nostrud amet.
            </li>
          </ul> -->
        </div>

        <div class="col-md-8 col-12 ma-n1">
          <v-chip class="ma-1" :color="`${typeColor} lighten-4`" :text-color="typeColor" label>{{
            vm.poolStore.type
          }}</v-chip>
          <v-chip class="ma-1 text-uppercase" label v-for="(field, i) in vm.poolStore.fields" :key="i">{{
            field
          }}</v-chip>
        </div>

        <div class="col-md-4 col-12 d-flex justify-md-end justify-start align-center">
          <v-btn
            v-for="(item, index) in vm.socialLinks"
            :href="$_get(item, 'link')"
            color="bluePrimary"
            :key="index"
            icon
          >
            <v-icon small>fab fa-{{ $_get(item, 'icon') }}</v-icon>
          </v-btn>
          <v-btn icon color="bluePrimary" :href="vm.poolStore.website">
            <icon-git-book />
          </v-btn>
        </div>
      </div>
    </v-sheet>
    <!-- <vote-prep-dialog ref="vote-prep-dialog" @openConfirmDialog="openConfirmDialog" /> -->
    <vote-confirm-dialog ref="vote-confirm-dialog" :voteResult="voteResult" />
  </v-sheet>
</template>

<script lang="ts">
import { Component, Vue, Ref, Inject } from 'vue-property-decorator'
import { VotingDetailViewModel } from '../viewmodels/voting-detail-viewmodel'

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
}
</script>

<style lang="scss" scoped>
.blur--bg {
  backdrop-filter: blur(8px);
  background-color: rgba(0, 0, 0, 0.5) !important;
}
</style>
