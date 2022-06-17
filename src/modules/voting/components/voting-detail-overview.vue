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
                <voting-progress-circle
                  class="flex-shrink-0"
                  color="green lighten-1"
                  :value="$_get(vm.poolStore, 'votedYesPercent', 0) | formatNumber(2)"
                />
                <div class="d-flex flex-column justify-space-around ml-4">
                  <div class="text-h5">👍 YES</div>
                  <div class="text-h6 font-weight-bold">
                    &nbsp;&nbsp;{{ $_get(vm.poolStore, 'approvedUsers.length', 0) | formatNumber(0) }} vote(s)
                  </div>
                </div>
              </div>

              <!-- ==== no vote progress circle ==== -->
              <div class="col-12 col-md-6 d-flex justify-center">
                <voting-progress-circle
                  class="flex-shrink-0"
                  color="red lighten-1"
                  :value="$_get(vm.poolStore, 'votedNoPercent', 0) | formatNumber(2)"
                />
                <div class="d-flex flex-column justify-space-around ml-4">
                  <div class="text-h5">👎 NO</div>
                  <div class="font-weight-bold text-h6">
                    &nbsp;&nbsp;{{ $_get(vm.poolStore, 'rejectedUsers.length', 0) | formatNumber(0) }} vote(s)
                  </div>
                </div>
              </div>
              <!-- =================================== -->
            </v-sheet>
          </div>
        </div>
        <voting-share-btn class="align-self-start mb-4 ml-4" />
      </div>
    </v-img>

    <!-- mobile banner -->
    <v-sheet v-else>
      <v-img max-height="244" class="rounded-t-lg" :src="$_get(vm.poolStore, 'projectCover')" />
      <div class="pa-4 d-flex flex-column">
        <div class="font-18 font-weight-bold mb-2">Current result</div>

        <!-- ==== yes vote progress content ==== -->
        <v-sheet class="rounded-lg pa-4 mb-2 green lighten-4 d-flex align-baseline black--text" outlined>
          <span class="font-18 font-weight-bold mr-8"
            >{{ $_get(vm.poolStore, 'votedYesPercent', 0) | formatNumber(2) }}%</span
          >
          <span class="text-subtitle-2 spacer"
            >{{ $_get(vm.poolStore, 'approvedUsers.length', 0) | formatNumber(0) }} upvote(s)</span
          >
          <v-chip label color="green lighten-2" class="white--text rounded-lg px-6">👍 YES votes</v-chip>
        </v-sheet>

        <!-- ==== no vote progress content ==== -->
        <v-sheet class="rounded-lg pa-4 mb-2 red lighten-4 d-flex align-baseline black--text" outlined>
          <span class="font-18 font-weight-bold mr-8"
            >{{ $_get(vm.poolStore, 'votedNoPercent', 0) | formatNumber(2) }}%</span
          >
          <span class="text-subtitle-2 spacer"
            >{{ $_get(vm.poolStore, 'rejectedUsers.length', 0) | formatNumber(0) }} downvote(s)</span
          >
          <v-chip label color="red lighten-2" class="white--text rounded-lg px-6">👎 NO votes</v-chip>
        </v-sheet>
        <!-- ==================================== -->
      </div>
    </v-sheet>

    <!-- ------------------------------------- VOTE BUTTON  ------------------------------------------------------------------ -->
    <voting-detail-button />

    <!-- ------------------------------------- OVERVIEW ---------------------------------------------------------------------- -->
    <v-sheet class="pa-6 rounded-lg rounded-t-0">
      <div class="row">
        <!-- ==== PROJECT NAME ==== -->
        <div class="col-md-8 col-12 d-flex align-center text-h4 font-weight-bold">
          <v-img
            class="mr-6 rounded-circle"
            max-width="64"
            aspect-ratio="1"
            :src="$_get(vm.poolStore, 'projectLogo')"
          />
          {{ $_get(vm.poolStore, 'projectName') }}
        </div>
        <!-- ==== COUNT DOWN AND STATUS ==== -->
        <div class="col-md-4 col-12">
          <countdown v-if="$_get(vm.poolStore, 'onVoting')" :to="$_get(vm.poolStore, 'votingEnd')" class="text-h5" />
          <voting-status v-else />
        </div>
        <!-- ==== CARDS ==== -->
        <div class="col-12">
          <voting-info-cards />
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

        <div
          v-if="!!$_get(vm.poolStore, 'socialLinks')"
          class="col-md-4 col-12 d-flex justify-md-end justify-start align-center"
        >
          <!-- ==== SOCIAL LINKS ==== -->
          <v-tooltip top v-for="([icon, link], index) in vm.socialLinks" :key="index">
            <template v-slot:activator="{ on, attrs }">
              <v-btn :href="link" color="blue-diversity" v-bind="attrs" v-on="on" icon>
                <v-icon small>{{ getDisplayIcon(icon) }}</v-icon>
              </v-btn>
            </template>
            {{ link }}
          </v-tooltip>
        </div>
      </div>
    </v-sheet>
    <!-- ------------------------------------------------------------------------------------------------------------------- -->
  </v-sheet>
</template>

<script lang="ts">
import { SOCIAL_ICONS } from '@/constants'
import { Component, Vue, Ref, Inject } from 'vue-property-decorator'
import { VotingDetailViewModel } from '../viewmodels/voting-detail-viewmodel'

@Component({
  components: {
    'voting-share-btn': () => import('../components/common/voting-share-btn.vue'),
    'voting-progress-circle': () => import('../components/common/voting-progress-circle.vue'),
    countdown: () => import('../components/common/countdown.vue'),
    'icon-git-book': () => import('@/assets/icons/icon-git-book.vue'),
    'voting-detail-button': () => import('../components/detail/voting-detail-button.vue'),
    'vote-prep-dialog': () => import('@/modules/voting/components/detail/vote-prep-dialog.vue'),
    'voting-info-cards': () => import('../components/detail/voting-info-cards.vue'),
    'voting-status': () => import('../components/detail/voting-status.vue'),
  },
})
export default class VotingDetailOverview extends Vue {
  @Ref('vote-prep-dialog') votePrepDialog
  @Inject() vm!: VotingDetailViewModel

  openDialog() {
    this.votePrepDialog.open()
  }

  getDisplayIcon(iconKey: string) {
    const iconName = iconKey.split('-')[0]
    return SOCIAL_ICONS[iconName]
  }

  get typeColor() {
    return this.vm.poolStore?.type === 'bounty' ? 'orange' : 'green'
  }
}
</script>

<style lang="scss" scoped></style>
