<template>
  <v-hover v-slot="{ hover }">
    <div
      v-if="!$vuetify.breakpoint.xs"
      class="card-wrapper d-flex fill-height"
      :class="type === 'bounty' ? 'bounty' : 'launchpad'"
    >
      <v-sheet class="card d-flex flex-column">
        <!-- ------------------------------------------------------------------------------------------------- -->
        <div class="card-image rounded-lg rounded-b-0 flex-shrink-0">
          <!-- <v-skeleton-loader type="image"></v-skeleton-loader> -->
          <v-img :src="cover" contain class="img-back" />
          <!-- HOVER SHOW SECTION START -->
          <div class="img-front d-flex flex-column" :class="{ blur: hover }">
            <v-sheet class="label white orange--text rounded mt-1 ml-1 pa-1 pr-2 font-weight-medium">
              🔥Trending
            </v-sheet>

            <div class="fill-height d-flex justify-center align-center mt-n6">
              <v-fade-transition>
                <v-btn v-show="hover" class="rounded pa-2">
                  <v-icon class="mt-n1 mr-1">mdi-star-outline</v-icon>
                  <span class="font-weight-medium">VOTE NOW</span>
                </v-btn>
              </v-fade-transition>
            </div>
          </div>
          <!-- HOVER SHOW SECTION END -->
        </div>
        <!-- -------------------------------------------------------------------------------------------------- -->
        <div class="card-content flex-grow-1 d-flex flex-column">
          <!-- CARD TOP START -->
          <div class="card-content-top d-flex flex-column flex-grow-1 pa-6 pt-1">
            <div class="card-title font-weight-bold">{{ projectName }}</div>
            <div class="card-subtitle font-weight-bold mb-4">
              {{ shortDescription }}
            </div>
            <div class="text-uppercase ma-n1">
              <v-chip v-for="(label, i) in labels" :key="i" class="rounded-lg ma-1">{{ label }}</v-chip>
            </div>
          </div>
          <!-- CARD TOP END -->

          <!-- CARD BOTTOM START -->
          <v-spacer />
          <div class="card-content-bottom">
            <v-divider />
            <countdown class="text-h5" :to="endTime"> </countdown>
            <v-divider />
            <div class="d-flex mb-4 mx-6 mt-3">
              <v-icon class="mr-2">mdi-star-outline</v-icon>
              <div class="font-weight-bold mr-1">{{ upvote }}</div>
              <div>votes for launching</div>
            </div>
            <div class="flag text-center py-2" :class="type === 'bounty' ? 'bounty' : 'launchpad'">
              <span class="text-uppercase">{{ type === 'bounty' ? 'Bounty Project' : 'Launchpad Project' }}</span>
            </div>
          </div>
          <!-- CARD BOTTOM END -->
        </div>
        <!-- --------------------------------------------------------------------------------------------------- -->
      </v-sheet>
    </div>
    <div v-else class="card-wrapper rounded-lg" :class="type === 'bounty' ? 'bounty' : 'launchpad'">
      <v-sheet class="rounded-lg" style="overflow: hidden">
        <div class="p-relative">
          <v-img :src="cover" contain class="rounded-t-lg" />
          <div class="p-absolute absolute-space fill-height fill-width d-flex flex-column justify-space-between">
            <div class="mt-1 ml-1">
              <v-sheet
                width="90"
                height="30"
                class="text-caption d-flex align-center justify-center white orange--text text--lighten-1 rounded font-weight-medium"
              >
                🔥TRENDING
              </v-sheet>
            </div>
            <div class="pa-4 pr-8">
              <div class="d-flex align-stretch mb-1">
                <div class="d-flex align-center mr-2">
                  <img :src="require('@/assets/icons/cryptocurrency.svg')" width="36" />
                </div>
                <div class="d-flex align-center neutral100--text font-weight-bold" style="font-size: 18px">
                  {{ projectName }}
                </div>
              </div>
              <v-sheet height="44" class="transparent line-clamp text-caption neutral100--text">
                {{ shortDescription }}
              </v-sheet>
              <div class="d-flex">
                <v-sheet
                  width="45"
                  height="20"
                  class="neutral20 rounded-lg mr-2 d-flex align-center justify-center text-uppercase"
                  style="font-size: 9px"
                  v-for="(label, index) in labels"
                  :key="index"
                >
                  {{ label }}
                </v-sheet>
              </div>
            </div>
          </div>
        </div>
        <!---->
        <div class="pa-4 font-weight-bold text-subtitle-1">10 : 12 : 23 : 24 left</div>
        <v-divider></v-divider>
        <div class="pa-4 d-flex">
          <v-img
            style="margin-top: 1px"
            :src="require('@/assets/icons/start.svg')"
            max-width="17"
            max-height="17"
            class="mr-2"
          ></v-img>
          <div class="text- center">
            <span class="text-subtitle-2 mr-1 font-weight-600">{{ upvote }}</span>
            <span>votes for launching</span>
          </div>
        </div>
        <div class="rounded-lg rounded-t-">
          <div
            class="text-caption orange orange--text text--lighten-1 text-uppercase d-flex align-center justify-center"
          >
            Bounty Project
          </div>
          <div style="height: 4px" class="orange lighten-1 rounded-lg"></div>
        </div>
      </v-sheet>
    </div>
  </v-hover>
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

const defaultProps = (): Props => ({
  projectName: 'Hydro Wind Energy',
  shortDescription: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, ",
  upvote: '90',
  type: 'bounty',
  cover:
    'https://images.unsplash.com/photo-1484626753559-5fa3ea273ae8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
  endTime: '2022-08-11T17:00:00.000Z',
  labels: ['finance', 'gaming'],
})

@Component({
  components: {
    countdown: () => import('./countdown.vue'),
  },
})
export default class LiveVotingCard extends Vue {
  @Prop({ default: defaultProps }) props!: Props

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

  get type() {
    return this.props.type
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
  .card-image {
    position: relative;
    flex-shrink: 0;
    .img-back {
      position: relative;
    }
    .img-front {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      &.blur {
        background: rgba($color: #000000, $alpha: 0.5);
      }
      .label {
        align-self: start;
      }
    }
  }
  .card-content {
    .card-content-top {
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
