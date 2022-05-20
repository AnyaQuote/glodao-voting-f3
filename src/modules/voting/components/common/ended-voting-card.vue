<template>
<<<<<<< HEAD
  <div v-if="!$vuetify.breakpoint.xs" class="card-wrapper d-flex fill-height" :class="className">
    <v-sheet class="card d-flex flex-column">
=======
  <div class="card-wrapper d-flex fill-height" :class="type">
    <v-sheet class="card neutral100--bg d-flex flex-column">
>>>>>>> dev
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
  <div v-else class="mb-6">
    <div class="card-wrapper rounded-lg" :class="className">
      <div class="white rounded-lg" style="overflow: hidden">
        <div class="pa-6">
          <div class="d-flex align-stretch mb-2">
            <img :src="require('@/assets/icons/cryptocurrency.svg')" width="36" class="mr-2" />
            <div class="d-flex align-center font-weight-bold" style="font-size: 18px">
              {{ projectName }}
            </div>
          </div>
          <div style="height: 40px" class="neutral0--text text-caption line-clamp mb-2">{{ shortDescription }}</div>
          <v-btn
            class="rounded-lg text-none blue lighten-1 blue--text text-caption font-weight-400"
            elevation="0"
            block
          >
            APPROVED for launch
          </v-btn>
        </div>
        <v-divider></v-divider>
        <div class="text-subtitle-2 rounded-lg pa-6 d-flex align-center" style="line-height: 150%">
          <img :src="require('@/assets/icons/start.svg')" max-width="17" max-height="17" class="mr-2" />
          <div class="font-weight-bold mt-1">
            {{ upvote }}%
            <span class="green--text text--lighten-1">YES </span>
            <span class="font-weight-600"> votes</span>
          </div>
          <v-sheet height="4" width="4" class="blue mx-1 rounded-circle pa-0"></v-sheet>
          <div class="font-weight-bold mt-1">
            {{ downvote }}%
            <span class="error--text">NO</span>
            <span class="font-weight-600"> votes</span>
          </div>
        </div>
        <div class="rounded-lg">
          <div
            class="orange--text text--lighten-1 text-caption d-flex align-center justify-center pt-1"
            style="height: 24px; background: var(--v-orange-base)"
          >
            BOUNTY PROJECT
          </div>
          <div style="height: 4px; background: var(--v-orange-lighten1)"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Metadata } from '@/models/VotingModel'
import { Component, Vue, Prop } from 'vue-property-decorator'
<<<<<<< HEAD

interface Props {
  projectName?: string
  shortDescription?: string
  labels?: string[]
  endTime?: string
  upvote?: string
  downvote?: string
  type?: string
  cover?: string
}

const defaultProps = (): Props => ({
  projectName: 'Hydro Wind Energy',
  shortDescription: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
  upvote: '90',
  downvote: '90',
  type: 'bounty',
  cover:
    'https://images.unsplash.com/photo-1484626753559-5fa3ea273ae8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
  endTime: '2022-08-11T17:00:00.000Z',
  labels: ['finance', 'gaming'],
})

@Component
export default class EndedVotingCard extends Vue {
  @Prop({ default: defaultProps }) props!: Props

  get name() {
    return `${this.upvote}% <span class="green--text text--lighten-1">YES</span> votes <v-sheet height="4" width="4" color="blue" class="rounde-circle"></v-sheet> ${this.downvote}% <span class="red--text">NO</span> votes `
  }

  get projectName() {
    return this.props.projectName
  }

  get shortDescription() {
    return this.props.shortDescription
  }

  get className() {
    return this.props.type === 'bounty' ? 'bounty' : 'launchpad'
  }

  get cover() {
    return this.props.cover
  }

  get upvote() {
    return this.props.upvote
  }

  get downvote() {
    return this.props.downvote
  }
=======
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
>>>>>>> dev
}
</script>

<style lang="scss" scoped>
.line-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
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
