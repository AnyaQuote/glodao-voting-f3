<template>
  <v-hover v-slot="{ hover }">
    <div class="card-wrapper d-flex fill-height" :class="type">
      <v-sheet class="card d-flex flex-column neutral100--bg">
        <!-- ------------------------------------------------------------------------------------------------- -->
        <div class="card-image rounded-lg rounded-b-0 flex-shrink-0">
          <v-img :src="projectCover" contain class="p-relative"> </v-img>
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
          <div class="card-content-top d-flex flex-column flex-grow-1 pa-6">
            <div class="d-flex align-center">
              <v-avatar size="48" class="mr-4">
                <v-img :src="projectLogo"> </v-img>
              </v-avatar>
              <div class="text-h5 flex-grow-1 font-weight-bold">{{ projectName }}</div>
            </div>

            <div class="text-subtitle-2 neutral10--text font-weight-bold mb-4">
              {{ data.shortDescription }}
            </div>
            <div class="text-uppercase ma-n1">
              <v-chip v-for="(field, i) in data.fields" :key="i" class="rounded-lg ma-1">{{ field }}</v-chip>
            </div>
          </div>
          <!-- CARD TOP END -->

          <!-- CARD BOTTOM START -->
          <v-spacer />
          <div class="card-content-bottom">
            <v-divider />
            <countdown class="text-h5 my-3" :to="endDate"> </countdown>
            <v-divider />
            <div class="d-flex mb-4 mx-6 mt-3">
              <v-icon class="mr-2">mdi-star-outline</v-icon>
              <div class="font-weight-bold mr-1">90</div>
              <div>votes for launching</div>
            </div>
            <div class="flag text-center py-2" :class="type">
              <span class="text-uppercase">{{ typeName }}</span>
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
import { Metadata } from '@/models/VotingModel'
import { Component, Vue, Prop } from 'vue-property-decorator'
import { get } from 'lodash'

@Component({
  components: {
    countdown: () => import('./countdown.vue'),
  },
})
export default class LiveVotingCard extends Vue {
  @Prop({ required: true }) projectName!: string
  @Prop({ required: true }) data!: Metadata
  @Prop({ required: true }) type!: string
  @Prop({ required: true }) endDate!: string
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
