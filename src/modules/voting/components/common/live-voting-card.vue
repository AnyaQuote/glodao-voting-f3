<template>
  <v-hover v-slot="{ hover }">
    <div v-if="!$vuetify.breakpoint.xs" class="card-wrapper d-flex fill-height" :class="type">
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
    <div v-else class="card-wrapper rounded-lg" :class="type">
      <v-sheet class="rounded-lg" style="overflow: hidden">
        <div class="p-relative">
          <v-img :src="projectCover" height="221" class="rounded-t-lg">
            <div class="fill-height fill-width d-flex flex-column justify-space-between">
              <v-sheet
                width="90"
                height="30"
                class="text-caption d-flex align-center justify-center white orange--text text--lighten-1 rounded font-weight-medium mt-1 ml-1"
              >
                🔥TRENDING
              </v-sheet>
              <div class="pa-4 pr-8">
                <div class="d-flex align-stretch mb-1">
                  <v-avatar size="32">
                    <img :src="projectLogo" />
                  </v-avatar>
                  <div class="spacer white--text font-weight-bold d-flex align-center pl-3" style="font-size: 18px">
                    {{ projectName }}
                  </div>
                </div>
                <v-sheet height="40" class="transparent white--text text-caption line-clamp mb-1">
                  {{ data.shortDescription }}
                </v-sheet>
                <div class="d-flex">
                  <v-sheet
                    v-for="(field, i) in data.fields.slice(0, 3)"
                    :key="i"
                    height="20"
                    width="43"
                    class="neutral20 neutral0--text rounded-lg d-flex align-center justify-center text-uppercase mr-1"
                    style="font-size: 9px"
                  >
                    {{ field }}
                  </v-sheet>
                </div>
              </div>
            </div>
          </v-img>
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
          >
          </v-img>
          <div class="text- center">
            <span class="text-subtitle-2 mr-1 font-weight-600">{{ 90 }}</span>
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
