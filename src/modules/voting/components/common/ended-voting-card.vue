<template>
  <div class="card-wrapper d-flex fill-height" :class="type">
    <v-sheet class="card neutral100--bg d-flex flex-column">
      <!-- <v-skeleton-loader type="image"></v-skeleton-loader> -->
      <img :src="projectCover" class="rounded-lg rounded-b-0 flex-shrink-0" />
      <div class="card-content d-flex flex-column">
        <!-- CARD TOP START -->
        <div class="card-content-top d-flex flex-column pa-6 pb-0">
          <div class="d-flex align-center">
            <v-avatar size="48" class="mr-4">
              <v-img :src="projectLogo"> </v-img>
            </v-avatar>
            <div class="text-h5 clip-text flex-grow-1 font-weight-bold">{{ projectName }}</div>
          </div>
          <div class="text-subtitle-2 clip-text font-weight-bold">
            {{ data.shortDescription }}
          </div>
        </div>

        <!-- CARD TOP END -->
        <v-spacer />
        <v-sheet
          :class="isApproved ? 'blue lighten-5 blue--text' : 'error lighten-5 error--text'"
          class="ma-4 mb-6 rounded d-flex align-center justify-center"
          height="36"
        >
          {{ isApproved ? 'APPROVE for launch' : 'UNAPPROVE for launch' }}
        </v-sheet>
        <!-- CARD BOTTOM START -->
        <div class="card-content-bottom">
          <v-divider />
          <div class="d-flex align-center mb-4 mx-6 mt-3">
            <v-icon class="mr-2">mdi-star-outline</v-icon>
            <div class="font-weight-bold number-count mr-1">{{ upvote }}%</div>
            <div><span class="green--text font-weight-bold">YES</span> votes</div>
            <div class="dot mx-2"></div>
            <div class="font-weight-bold number-count mr-1">{{ downvote }}%</div>
            <div><span class="error--text font-weight-bold">NO</span> votes</div>
          </div>
          <div class="flag text-center py-2" :class="type">
            <span class="text-uppercase">{{ typeName }}</span>
          </div>
        </div>
      </div>
      <!-- CARD BOTTOM END -->
    </v-sheet>
  </div>
</template>

<script lang="ts">
import { Metadata } from '@/models/VotingModel'
import { Component, Vue, Prop } from 'vue-property-decorator'
import { get } from 'lodash'
@Component
export default class EndedVotingCard extends Vue {
  @Prop({ required: true }) projectName!: string
  @Prop({ required: true }) data!: Metadata
  @Prop({ required: true }) type!: string
  @Prop({ required: true }) status!: string
  isApproved = this.status === 'approved'
  // HARD CODED-------
  upvote = this.isApproved ? Math.floor(Math.random() * 100) + 1 : 10
  downvote = 100 - this.upvote
  // ------------------
  typeName = this.type === 'bounty' ? 'Bounty Project' : 'Launchpad Project'
  projectLogo = get(this.data, 'projectLogo', '')
  projectCover = get(this.data, 'projectCover', '')
}
</script>

<style lang="scss" scoped>
.card {
  $bounty-light-1: #ff7a00;
  $bounty-light-2: #ffe0c2;
  $launchpad-light-1: #1e8c0b;
  $launchpad-light-2: #dffada;
  border-radius: em(8);
  overflow: hidden;
  flex: 1;
  @at-root.card-wrapper {
    padding: em(1.5);
    border-radius: em(9);
    &.bounty {
      background: linear-gradient(180deg, $bounty-light-1 0%, #fff9f3 80%);
    }
    &.launchpad {
      background: linear-gradient(180deg, $launchpad-light-1 0%, #fff9f3 80%);
    }
  }
  .card-content {
    flex: 1;
    .card-content-top {
      flex: 1;
      .clip-text {
        word-break: break-word;
        text-overflow: hidden;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }
    }
    .card-content-bottom {
      .number-count {
        font-size: em(18);
      }
      .dot {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: var(--v-blue-base);
      }
      .flag {
        &.bounty {
          background: $bounty-light-2 !important;
          border-bottom: 4px solid $bounty-light-1;
          color: $bounty-light-1;
        }
        &.launchpad {
          background: $launchpad-light-2 !important;
          border-bottom: 4px solid $launchpad-light-1;
          color: $launchpad-light-1;
        }
      }
    }
  }
}
</style>
