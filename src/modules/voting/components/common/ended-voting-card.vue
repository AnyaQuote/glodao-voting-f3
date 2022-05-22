<template>
  <v-hover v-slot="{ hover }">
    <div v-if="!$vuetify.breakpoint.xs" class="pa-1 rounded-lg d-flex fill-height" :class="typeBorderColor">
      <v-sheet class="rounded-lg neutral100--bg d-flex flex-column overflow-hidden">
        <v-img :src="$_get(pool, 'data.projectCover')" class="rounded-lg rounded-b-0 flex-shrink-0">
          <div class="d-flex flex-column fill-height" :class="{ blur: hover }">
            <v-sheet class="align-self-start white orange--text rounded mt-1 ml-1 pa-1 pr-2 font-weight-medium">
              🔥Ended
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

        <div class="d-flex flex-column">
          <!-- CARD TOP START -->
          <div class="d-flex flex-column pa-6 pb-0">
            <div class="d-flex align-center">
              <v-avatar size="48" class="mr-4">
                <v-img :src="$_get(pool, 'data.projectLogo')"> </v-img>
              </v-avatar>
              <div class="text-h5 clip-text flex-grow-1 font-weight-bold">{{ $_get(pool, 'projectName') }}</div>
            </div>
            <div class="text-subtitle-2 clip-text font-weight-bold">
              {{ $_get(pool, 'data.shortDescription') }}
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
              <v-icon class="mr-2">mdi-star-outline</v-icon>
              <div class="font-weight-bold number-count mr-1">{{ upvote }}%</div>
              <div><span class="green--text font-weight-bold">YES</span> votes</div>
              <div class="dot mx-2"></div>
              <div class="font-weight-bold number-count mr-1">{{ downvote }}%</div>
              <div><span class="error--text font-weight-bold">NO</span> votes</div>
            </div>
            <div class="text-center py-2" :class="typeBackgroundColor">
              <span class="text-uppercase" :class="typeTextColor">{{ typeName }}</span>
            </div>
          </div>
        </div>
        <!-- CARD BOTTOM END -->
      </v-sheet>
    </div>
    <div v-else class="mb-6">
      <div class="rounded-lg pa-1" :class="typeBackgroundColor">
        <div class="white rounded-lg overflow-hidden">
          <div class="pa-6">
            <div class="d-flex align-stretch mb-2">
              <v-img :src="$_get(pool, 'data.projectLogo')" max-width="36" max-height="36" class="mr-2" />
              <div class="d-flex align-center font-weight-bold font-18">
                {{ $_get(pool, 'projectName') }}
              </div>
            </div>
            <div style="height: 40px" class="neutral0--text text-caption line-clamp mb-2">
              {{ $_get(pool, 'data.shortDescription') }}
            </div>
            <v-sheet :class="statusColor" class="ma-1 rounded d-flex align-center justify-center" height="36">
              {{ isApproved ? 'APPROVE for launch' : 'UNAPPROVE for launch' }}
            </v-sheet>
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
            <v-sheet
              height="24"
              class="orange orange--text text--lighten-1 text-caption d-flex align-center justify-center py-1"
            >
              BOUNTY PROJECT
            </v-sheet>
          </div>
        </div>
      </div>
    </div>
  </v-hover>
</template>

<script lang="ts">
import { VotingPools } from '@/models/VotingModel'
import { Component, Vue, Prop } from 'vue-property-decorator'
import { RoutePaths } from '@/router'

@Component
export default class EndedVotingCard extends Vue {
  @Prop({ required: true }) pool!: VotingPools

  // HARD CODED-------
  upvote = this.isApproved ? Math.floor(Math.random() * 100) + 1 : 10
  downvote = 100 - this.upvote
  // ------------------

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
