<template>
  <v-hover v-slot="{ hover }">
    <div v-if="pool" class="pa-1 rounded-lg d-flex fill-height" :class="typeBorderColor">
      <v-sheet class="flex-grow-1 overflow-hidden d-flex flex-column rounded-lg neutral100--bg">
        <div class="card-image rounded-lg rounded-b-0 flex-shrink-0">
          <v-img :src="pool.projectCover">
            <div class="d-flex flex-column fill-height" :class="{ blur: hover }">
              <v-sheet class="align-self-start white orange--text rounded mt-1 ml-1 pa-1 pr-2 font-weight-medium">
                🔥Trending
              </v-sheet>
              <div class="fill-height d-flex justify-center align-center mt-n6">
                <v-fade-transition>
                  <v-btn v-show="hover" class="rounded pa-2" @click="openDetail">
                    <v-icon class="mt-n1 mr-1">mdi-star-outline</v-icon>
                    <span class="font-weight-medium">VOTE NOW</span>
                  </v-btn>
                </v-fade-transition>
              </div>
            </div>
          </v-img>
        </div>
        <div class="flex-grow-1 d-flex flex-column">
          <div class="d-flex flex-column flex-grow-1 pa-6">
            <div class="d-flex align-center">
              <v-avatar size="48" class="mr-4">
                <v-img :src="pool.projectLogo"> </v-img>
              </v-avatar>
              <div class="text-h5 flex-grow-1 font-weight-bold">{{ pool.projectName }}</div>
            </div>

            <div class="text-subtitle-2 neutral10--text font-weight-bold mb-4">
              {{ pool.shortDescription }}
            </div>
            <div class="text-uppercase ma-n1">
              <v-chip v-for="(field, i) in pool.fields" :key="i" class="rounded-lg ma-1">{{ field }}</v-chip>
            </div>
          </div>

          <v-spacer />
          <div class="card-content-bottom">
            <v-divider />
            <countdown class="text-h5 my-3" :to="pool.endDate"> </countdown>
            <v-divider />
            <div class="d-flex mb-4 mx-6 mt-3">
              <v-icon class="mr-2">mdi-star-outline</v-icon>
              <div class="font-weight-bold number-count mr-1">{{ pool.votedPercent | formatNumber(4) }}%</div>
              <div><span class="green--text font-weight-bold">YES</span> votes</div>
            </div>
            <div class="flag text-center py-2" :class="typeBackgroundColor">
              <span class="text-uppercase white--text">{{ typeName }}</span>
            </div>
          </div>
        </div>
      </v-sheet>
    </div>
    <!-- <div v-else class="pa-1 rounded-lg" :class="typeBorderColor">
      <v-sheet class="rounded-lg">
        <v-img :src="$_get(pool, 'data.projectCover')" height="221" class="rounded-t-lg">
          <div class="fill-height fill-width d-flex flex-column justify-space-between">
            <v-sheet
              width="90"
              height="30"
              class="text-caption d-flex align-center justify-center white orange--text rounded font-weight-medium mt-1 ml-1"
            >
              🔥TRENDING
            </v-sheet>
            <div class="pa-4 pr-8">
              <div class="d-flex align-stretch mb-1">
                <v-avatar size="36">
                  <img :src="$_get(pool, 'data.projectLogo')" />
                </v-avatar>
                <div class="font-18 spacer white--text font-weight-bold d-flex align-center pl-3">
                  {{ $_get(pool, 'projectName') }}
                </div>
              </div>
              <v-sheet height="40" class="transparent white--text text-caption line-clamp mb-1">
                {{ $_get(pool, 'data.shortDescription') }}
              </v-sheet>
              <div class="d-flex">
                <v-sheet
                  v-for="(field, i) in $_get(pool, 'data.fields')"
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
            <div
              v-show="hover"
              class="p-absolute absolute-space d-flex align-center jusitfy-center"
              :class="{ blur: hover }"
            >
              <v-fade-transition>
                <v-btn v-show="hover" class="rounded pa-2 mx-auto" @click="openDetail">
                  <v-icon class="mt-n1 mr-1">mdi-star-outline</v-icon>
                  <span class="font-weight-medium">VOTE NOW</span>
                </v-btn>
              </v-fade-transition>
            </div>
          </div>
        </v-img>
        <countdown class="my-2 font-weight-bold text-subtitle-1" :to="$_get(pool, 'endDate')"> </countdown>
        <v-divider></v-divider>
        <div class="pa-4 d-flex align-center">
          <v-icon class="mr-2">mdi-star-outline</v-icon>
          <div class="mt-1">
            <span class="text-subtitle-2 mr-1 font-weight-600"></span>
            <span>votes for launching</span>
          </div>
        </div>
        <div class="text-center py-2" :class="typeBackgroundColor">
          <span class="text-uppercase" :class="typeTextColor">{{ typeName }}</span>
        </div>
      </v-sheet>
    </div> -->
  </v-hover>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { RoutePaths } from '@/router'
import { get } from 'lodash'
import { PoolStore } from '@/stores/pool-store'

@Component({
  components: {
    countdown: () => import('./countdown.vue'),
  },
})
export default class LiveVotingCard extends Vue {
  @Prop({ required: true }) pool!: PoolStore

  get typeName() {
    return this.pool.type === 'bounty' ? 'Bounty Project' : 'Launchpad Project'
  }

  get typeTextColor() {
    return this.pool.type === 'bounty' ? 'orange--text' : 'green--text'
  }

  get typeBackgroundColor() {
    return this.pool.type === 'bounty' ? 'orange lighten-1' : 'green lighten-4'
  }

  get typeBorderColor() {
    return this.pool.type === 'bounty' ? 'bounty-border' : 'launchpad-border'
  }

  openDetail() {
    this.$router.push(RoutePaths.voting_detail + this.pool.unicodeName)
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

.clip-text {
  word-break: break-word;
  text-overflow: hidden;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.bounty-border {
  background: linear-gradient(180deg, var(--v-orange-base) 0%, #fff9f3 80%);
}
.launchpad-border {
  background: linear-gradient(180deg, (--v-green-base) 0%, #fff9f3 80%);
}

.blur {
  background: rgba($color: #000000, $alpha: 0.5);
}
</style>
