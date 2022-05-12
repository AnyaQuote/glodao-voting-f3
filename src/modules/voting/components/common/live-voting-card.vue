<template>
  <div class="card-wrapper d-flex fill-height" :class="className">
    <v-sheet class="card d-flex flex-column">
      <img :src="cover" class="rounded-lg rounded-b-0 card-img" />
      <div class="card-content d-flex flex-column">
        <!-- CARD TOP START -->
        <div class="card-content-top d-flex flex-column pa-6 pt-1">
          <div class="card-title font-weight-bold ">{{ projectName }}</div>
          <div class="card-subtitle font-weight-bold mb-4 ">
            {{ shortDescription }}
          </div>
          <div class="text-uppercase ma-n1 ">
            <v-chip v-for="(label, i) in labels" :key="i" class="rounded-lg ma-1">{{ label }}</v-chip>
          </div>
        </div>
        <!-- CARD TOP END -->

        <!-- CARD BOTTOM START -->
        <v-spacer />
        <div class="card-content-bottom">
          <v-divider />
          <countdown class=" text-h5" :to="endTime"> </countdown>
          <v-divider />
          <div class="d-flex mb-4 mx-6 mt-3">
            <v-icon class="mr-2">mdi-star-outline</v-icon>
            <div class="font-weight-bold mr-1">{{ upvote }}</div>
            <div>votes for launching</div>
          </div>
          <div class="flag text-center py-2" :class="className">
            <span class="text-uppercase">{{ isBounty ? 'Bounty Project' : 'Launchpad Project' }}</span>
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
  type?: string
  cover?: string
}

@Component({
  components: {
    countdown: () => import('./countdown.vue')
  }
})
export default class LiveVotingCard extends Vue {
  @Prop() props!: Props

  get projectName() {
    return this.props.projectName
  }

  get shortDescription() {
    return this.props.shortDescription
  }

  get labels() {
    return this.props.labels
  }

  get endTime() {
    return this.props.endTime
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
