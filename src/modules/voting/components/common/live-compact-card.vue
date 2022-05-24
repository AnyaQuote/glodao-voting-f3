<template>
  <!-- <v-slide-item> -->
  <v-hover v-slot="{ hover }">
    <div class="d-flex fill-height rounded-lg pa-1" :class="typeBorderColor">
      <v-sheet
        :width="$vuetify.breakpoint.mdAndUp ? '348' : 'auto'"
        class="d-flex flex-column rounded-lg overflow-hidden"
      >
        <!-- ------------------------------------------------------------------------------------------------- -->
        <div class="card-image rounded-lg rounded-b-0 flex-shrink-0">
          <v-img :src="$_get(pool, 'data.projectCover')">
            <div class="p-absolute absolute-space d-flex flex-column" :class="{ blur: hover }">
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
          <!-- HOVER SHOW SECTION START -->

          <!-- HOVER SHOW SECTION END -->
        </div>
        <!-- -------------------------------------------------------------------------------------------------- -->
        <div class="card-content flex-grow-1 d-flex flex-column">
          <!-- CARD TOP START -->
          <div class="d-flex flex-column flex-grow-1 pa-6">
            <div class="d-flex align-center mb-4">
              <v-avatar size="48" class="mr-4">
                <v-img :src="$_get(pool, 'data.projectLogo')" />
              </v-avatar>
              <div class="text-h5 flex-grow-1 font-weight-bold">{{ $_get(pool, 'projectName') }}</div>
            </div>
            <div class="text-subtitle-2 text-truncate neutral10--text font-weight-bold mb-4">
              {{ $_get(pool, 'data.shortDescription') }}
            </div>
            <div class="text-uppercase ma-n1">
              <v-chip v-for="(field, i) in $_get(pool, 'data.fields')" :key="i" class="rounded-lg ma-1">{{
                field
              }}</v-chip>
            </div>
          </div>
          <!-- CARD TOP END -->

          <!-- CARD BOTTOM START -->
          <v-spacer />
          <div class="card-content-bottom">
            <div class="text-center py-2" :class="typeBackgroundColor">
              <span class="text-uppercase" :class="typeTextColor">{{ typeName }}</span>
            </div>
          </div>
          <!-- CARD BOTTOM END -->
        </div>
        <!-- --------------------------------------------------------------------------------------------------- -->
      </v-sheet>
    </div>
  </v-hover>
  <!-- </v-slide-item> -->
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { VotingPool } from '@/models/VotingModel'
import { RoutePaths } from '@/router'

@Component
export default class LiveCompactCard extends Vue {
  @Prop({ required: true }) pool!: VotingPool

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
