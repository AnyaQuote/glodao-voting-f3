<template>
  <!-- -------------------------------------------- DESKTOP CARD ------------------------------------------ -->
  <v-hover v-slot="{ hover }">
    <div v-if="$vuetify.breakpoint.smAndUp" class="pa-thin rounded-lg fill-height" :class="typeBorderColor">
      <v-sheet class="rounded-lg d-flex flex-column fill-height overflow-hidden">
        <!-- CARD TOP START -->
        <v-img max-height="234" aspect-ratio="1" :src="$_get(pool, 'projectCover')" class="rounded-t-lg">
          <div class="d-flex flex-column fill-height" :class="{ blur: hover }">
            <div class="align-self-start white rounded mt-1 ml-1 pa-1 pr-2 white orange--text font-weight-medium">
              🔥 Ended
            </div>
            <div class="fill-height d-flex justify-center align-center mt-n6">
              <v-fade-transition>
                <v-btn v-show="hover" class="neutral100--bg rounded pa-2" @click="openDetail">
                  <v-icon class="mt-n1 mr-1">mdi-star-outline</v-icon>
                  <span class="font-weight-medium">VOTE NOW</span>
                </v-btn>
              </v-fade-transition>
            </div>
          </div>
        </v-img>
        <div class="d-flex flex-column flex-grow-1">
          <!-- CARD TOP START -->
          <div class="d-flex flex-column pa-6 pb-0">
            <div class="d-flex align-center">
              <v-avatar size="48" class="mr-4">
                <v-img :src="$_get(pool, 'projectLogo')"> </v-img>
              </v-avatar>
              <div class="text-h5 flex-grow-1 font-weight-bold">{{ $_get(pool, 'projectName') }}</div>
            </div>
            <div class="text-subtitle-2 two-lines font-weight-bold">
              {{ $_get(pool, 'shortDescription') }}
            </div>
          </div>
          <!-- CARD TOP END -->
          <v-spacer />
          <v-sheet :class="statusColor" class="ma-4 mb-6 rounded d-flex align-center justify-center" height="36">
            {{ isApproved ? 'APPROVE for launch' : 'UNAPPROVE for launch' }}
          </v-sheet>
          <!-- CARD BOTTOM START -->
          <div>
            <v-divider />
            <div class="d-flex align-center mb-4 mx-6 mt-3">
              <!-- YES VOTE  -->
              <v-icon class="mr-2">mdi-star-outline</v-icon>
              <div class="font-weight-bold number-count mr-1">
                {{ $_get(pool, 'votedYesPercent') | formatNumber(2) }}%
              </div>
              <div><span class="green--text font-weight-bold">YES</span> votes</div>
              <!------------->

              <v-sheet height="4" width="4" class="blue-diversity rounded-circle mx-2"></v-sheet>

              <!-- NO VOTE -->
              <div class="font-weight-bold number-count mr-1">
                {{ $_get(pool, 'votedNoPercent') | formatNumber(2) }}%
              </div>
              <div><span class="red--text font-weight-bold">NO</span> votes</div>
              <!------------->
            </div>
            <div class="text-center py-2" :class="typeBackgroundColor">
              <span class="text-uppercase" :class="typeTextColor">{{ typeName }}</span>
            </div>
            <v-sheet height="4" class="orange" />
          </div>
        </div>
        <!-- CARD BOTTOM END -->
      </v-sheet>
    </div>
    <!-- -------------------------------------------- MOBILE CARD ------------------------------------------ -->
    <div v-else>
      <div class="rounded-lg pa-thin" :class="typeBackgroundColor">
        <v-sheet class="rounded-lg overflow-hidden">
          <div class="pa-6">
            <div class="d-flex align-stretch mb-2">
              <v-img :src="$_get(pool, 'projectLogo')" max-width="36" max-height="36" class="mr-2" />
              <div class="d-flex align-center font-weight-bold font-18">
                {{ $_get(pool, 'projectName') }}
              </div>
            </div>
            <div class="text-caption two-line mb-2">
              {{ $_get(pool, 'shortDescription') }}
            </div>
            <v-sheet :class="statusColor" class="ma-1 rounded d-flex align-center justify-center" height="36">
              {{ isApproved ? 'APPROVE for launch' : 'UNAPPROVE for launch' }}
            </v-sheet>
          </div>
          <v-divider></v-divider>
          <div class="text-subtitle-2 rounded-lg pa-4 d-flex align-center">
            <v-icon class="mr-2">mdi-star-outline</v-icon>
            <!-- YES VOTE  -->
            <div class="font-weight-bold mt-1 text-subtitle-1">
              {{ $_get(pool, 'votedYesPercent') | formatNumber(2) }}%
              <span class="app-green--text">YES </span>
              <span class="font-weight-600"> votes</span>
            </div>
            <!------------->

            <v-sheet height="4" width="4" class="blue-diversity mt-1 rounded-circle mx-2"></v-sheet>

            <!-- NO VOTE  -->
            <div class="font-weight-bold mt-1 text-subtitle-1">
              {{ $_get(pool, 'votedNoPercent') | formatNumber(2) }}%
              <span class="app-red--text">NO </span>
              <span class="font-weight-600"> votes</span>
            </div>
            <!------------->
          </div>
          <v-sheet height="24" class="text-caption text-center app-orange lighten-2 app-orange--text py-1">
            BOUNTY PROJECT
          </v-sheet>
          <v-sheet height="4" class="app-orange" />
        </v-sheet>
      </div>
    </div>
    <!-- ---------------------------------------------------------------------------------------------- -->
  </v-hover>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { RoutePaths } from '@/router'
import { PoolStore } from '@/stores/pool-store'

@Component
export default class EndedVotingCard extends Vue {
  @Prop({ required: true }) pool!: PoolStore

  get typeName() {
    return this.pool.type === 'bounty' ? 'Bounty Project' : 'Launchpad Project'
  }

  get isApproved() {
    return this.pool.status === 'approved'
  }

  get statusColor() {
    return this.isApproved ? 'blue lighten-5 blue--text' : 'red lighten-5 red--text'
  }

  get typeTextColor() {
    return this.pool.type === 'bounty' ? 'app-orange--text' : 'app-green--text'
  }

  get typeBackgroundColor() {
    return this.pool.type === 'bounty' ? 'app-orange lighten-2' : 'app-green lighten-2'
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
.two-lines {
  word-break: break-word;
  text-overflow: hidden;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.pa-thin {
  padding: 1px;
  padding-bottom: 0px;
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
