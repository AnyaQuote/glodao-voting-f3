<template>
  <v-sheet class="neutral100-bg rounded-lg" elevation="3" outlined>
    <!-- ------------------------------------------------------------------------------------------------------------- -->
    <v-sheet>
      <v-img v-if="$vuetify.breakpoint.smAndUp" class="rounded-t-lg" :src="vm.projectCover">
        <div class="d-flex flex-column align-center fill-height">
          <voting-out-btn class="align-self-end mt-4 mr-4" width="51" height="51" />
          <div class="fill-height d-flex align-center pb-16">
            <div class="rounded-lg py-10 blur--bg">
              <div class="text-h5 text-center font-weight-bold mb-10 white--text">Current result</div>
              <!-- CENTER CONTENT BOX START -->
              <div class="d-flex justify-center transparent white--text mx-16">
                <div class="d-flex mr-10">
                  <voting-progress-circle class="flex-shrink-0" :value="`${upvote}`" color="green" />
                  <div class="d-flex flex-column justify-space-around flex-grow-1 ml-4">
                    <span class="text-h6">👍YES</span>
                    <span class="font-weight-bold font-14">{{ upvote }} votes</span>
                  </div>
                </div>
                <div class="d-flex">
                  <voting-progress-circle class="flex-shrink-0 mr-4" :value="`${downvote}`" color="error" />
                  <div class="d-flex flex-column justify-space-around flex-grow-1">
                    <span class="text-h6">👎NO</span>
                    <span class="font-weight-bold font-14">{{ downvote }} votes</span>
                  </div>
                </div>
              </div>

              <!-- CENTER CONTENT BOX END -->
            </div>
          </div>
        </div>
      </v-img>
      <v-sheet v-else>
        <v-img max-height="244" class="rounded-t-lg" :src="vm.projectCover" />
        <div class="pa-4 d-flex flex-column">
          <div class="font-18 font-weight-bold mb-2">Current result</div>
          <v-sheet class="rounded-lg pa-4 mb-2 green lighten-4 d-flex align-baseline" outlined>
            <span class="font-18 font-weight-bold mr-8">{{ upvote }}%</span>
            <span class="text-subtitle-2 neutral10--text spacer">1000 upvotes</span>
            <v-chip label color="green lighten-2" class="white--text rounded-lg px-6">👍 YES votes</v-chip>
          </v-sheet>
          <v-sheet class="rounded-lg pa-4 red lighten-4 d-flex align-baseline" outlined>
            <span class="font-18 font-weight-bold mr-8">{{ downvote }}%</span>
            <span class="text-subtitle-2 neutral10--text spacer"> 1000 downvotes</span>
            <v-chip label color="red lighten-1" class="white--text rounded-lg px-6">👎 NO votes</v-chip>
          </v-sheet>
        </div>
      </v-sheet>
    </v-sheet>
    <voting-detail-button @buttonClick="openDialog" />
    <!-- BANNER SECTION END -->
    <!-- --------------------------------------------------------------------------------------------------------------------- -->
    <!-- CONTENT SECTION START -->
    <v-sheet class="pa-6 rounded-lg rounded-t-0">
      <div class="row">
        <div class="col-md-8 col-12">
          <div class="text-h4 font-weight-bold">{{ vm.projectName }}</div>
        </div>
        <div class="col-4">
          <countdown :to="vm.endDate" class="text-h5" />
        </div>
        <div class="col-12">
          <div class="row">
            <div class="col-md-3 col-12" v-for="i in [1, 2, 3]" :key="i">
              <reward-card class="reward-card" />
            </div>
            <!-- TOOLTIP SECTION START -->
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on" class="align-stretch mt-2" color="grey2">mdi-information</v-icon>
              </template>
              <span>Token rewards are calculated according to the price at the time of pool closing</span>
            </v-tooltip>
            <!-- TOOLTIP SECTION END -->
          </div>
        </div>
        <div class="col-12">
          <div>
            {{ vm.shortDescription }}
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
          <v-chip class="ma-1" :color="`${typeColor} lighten-4`" :text-color="typeColor" label>{{ vm.type }}</v-chip>
          <v-chip class="ma-1 text-uppercase" label v-for="(field, i) in vm.fields" :key="i">{{ field }}</v-chip>
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
          <v-btn icon color="bluePrimary" :href="vm.website">
            <icon-git-book />
          </v-btn>
        </div>
      </div>
    </v-sheet>
    <!-- --------------------------------------------------------------------------------------------------------------- -->
    <!-- CONTENT SECTION END -->
    <vote-prep-dialog ref="vote-prep-dialog" @openConfirmDialog="openConfirmDialog" />
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
    'reward-card': () => import('../components/common/reward-card.vue'),
    'voting-detail-button': () => import('../components/detail/voting-detail-button.vue'),
    'vote-prep-dialog': () => import('../components/detail/vote-prep-dialog.vue'),
    'vote-confirm-dialog': () => import('../components/detail/vote-confirm-dialog.vue'),
  },
})
export default class VotingDetailOverview extends Vue {
  @Ref('vote-prep-dialog') votePrepDialog
  @Ref('vote-confirm-dialog') voteConfirmDialog
  @Inject() vm!: VotingDetailViewModel

  upvote = Math.floor(Math.random() * 100) + 1
  downvote = 100 - this.upvote
  typeColor = this.vm.type === 'bounty' ? 'orange' : 'green'

  voteResult = ''

  openDialog() {
    this.votePrepDialog.open()
  }

  openConfirmDialog(voteResult) {
    this.voteResult = voteResult
    this.voteConfirmDialog.open()
  }
}
</script>

<style lang="scss" scoped>
.blur--bg {
  backdrop-filter: blur(8px);
  background-color: rgba(0, 0, 0, 0.5) !important;
}
</style>
