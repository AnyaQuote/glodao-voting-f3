<template>
  <v-hover v-slot="{ hover }">
    <div class="card-wrapper d-flex fill-height" :class="type === 'bounty' ? 'bounty' : 'launchpad'">
      <v-sheet v-bind="$attrs" class="card d-flex flex-column">
        <!-- ------------------------------------------------------------------------------------------------- -->
        <div class="card-image rounded-lg rounded-b-0 flex-shrink-0">
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
            <div class="flag text-center py-2" :class="type === 'bounty' ? 'bounty' : 'launchpad'">
              <span class="text-uppercase">{{ type === 'bounty' ? 'Bounty Project' : 'Launchpad Project' }}</span>
            </div>
          </div>
          <!-- CARD BOTTOM END -->
        </div>
        <!-- --------------------------------------------------------------------------------------------------- -->
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

const propsValue = (): Props => ({
  projectName: 'Hydro Wind Energy',
  shortDescription: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
  labels: ['NFT', 'gaming', 'finance'],
  endTime: '',
  upvote: '',
  type: 'bounty',
  cover:
    'https://images.unsplash.com/photo-1484626753559-5fa3ea273ae8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
})

@Component
export default class LiveCompactCard extends Vue {
  @Prop({ default: propsValue }) props!: Props

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
