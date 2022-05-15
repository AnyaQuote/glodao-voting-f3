<template>
  <div class="card-wrapper d-flex fill-height" :class="className">
    <v-sheet class="card d-flex flex-column">
      <!-- <v-skeleton-loader type="image"></v-skeleton-loader> -->
      <img :src="cover" class="rounded-lg rounded-b-0 card-img" />
      <div class="card-content d-flex flex-column">
        <!-- CARD TOP START -->
        <div class="card-content-top d-flex flex-column pa-6 pb-0 pt-1">
          <div class="card-title font-weight-bold ">{{ projectName }}</div>
          <div class="card-subtitle font-weight-bold">
            {{ shortDescription }}
          </div>
        </div>

        <!-- CARD TOP END -->
        <v-spacer />
        <v-sheet
          :class="upvote > downvote ? 'blue lighten-5 blue--text' : 'error lighten-5 error--text'"
          class="ma-4 rounded d-flex align-center justify-center"
          height="36"
        >
          {{ upvote > downvote ? 'UNAPPROVE for launch' : 'APPROVE for launch' }}
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
          <div class="flag text-center py-2" :class="className">
            <span class="text-uppercase">{{ props.type === 'bounty' ? 'Bounty Project' : 'Launchpad Project' }}</span>
          </div>
        </div>
      </div>
      <!-- CARD BOTTOM END -->
    </v-sheet>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

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
  shortDescription:
    "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
  upvote: '90',
  downvote: '90',
  type: 'bounty',
  cover:
    'https://images.unsplash.com/photo-1484626753559-5fa3ea273ae8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
  endTime: '2022-08-11T17:00:00.000Z',
  labels: ['finance', 'gaming']
})

@Component
export default class EndedVotingCard extends Vue {
  @Prop({ default: defaultProps }) props!: Props

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
  .card-img {
    flex-shrink: 0;
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
      .card-title {
        @extend .clip-text;
        font-size: em(28) !important;
        line-height: em(36.4) !important;
      }
      .card-subtitle {
        @extend .clip-text;
        font-size: em(14) !important;
        line-height: em(21) !important;
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
