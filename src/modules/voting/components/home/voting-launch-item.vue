<template>
  <v-sheet v-if="$vuetify.breakpoint.smAndUp" class="blue lighten-4 rounded-lg">
    <!-- BANNER IMAGE START -->
    <v-sheet class="rounded-lg rounded-b-0">
      <v-img :src="$_get(pool, 'data.projectCover', '')">
        <div class="d-flex flex-column white--text pt-7 px-9">
          <div class="d-flex align-center justify-space-between">
            <span class="text-h6 font-weight-bold">Project launching soon</span>
            <voting-out-btn />
          </div>
          <div class="row justify-center mt-10">
            <div class="col-12 text-center">
              <div class="text-h3 font-weight-bold">{{ $_get(pool, 'projectName') }}</div>
              <v-sheet width="500" class="mx-auto transparent--bg white--text mt-4 text-h5">
                {{ $_get(pool, 'data.shortDescription') }}
              </v-sheet>
              <div class="d-flex justify-center mt-4">
                <div class="mr-13">
                  <voting-progress-circle :value="`${upvote}`" color="green"> </voting-progress-circle>
                  <div class="mt-2 text-h6">👍 YES votes</div>
                </div>
                <div>
                  <voting-progress-circle :value="`${downvote}`" color="red"> </voting-progress-circle>
                  <div class="mt-2 text-h6">👎 NO votes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-img>
    </v-sheet>
    <!-- BANNER IMAGE END -->
    <!-- BANNER BOTTOM START -->
    <div class="pa-9 d-flex justify-space-between justify-start align-center">
      <div class="d-flex justify-center align-center mt-2 text-h6 font-weight-bold flex-wrap">
        <div class="mr-4">Ended voting in:</div>
        <div>{{ $_get(pool, 'endDate') | ddmmyyyyhhmmss }}</div>
        <v-sheet v-show="$vuetify.breakpoint.mdAndUp" height="8" width="8" class="rounded-circle blue mx-4"> </v-sheet>
        <div>Launching soon on {{ platform }}</div>
      </div>
      <v-btn class="rounded-lg" color="blue" height="50" outlined :to="'#'">
        <span class="text-h6">Read more</span>
      </v-btn>
    </div>
    <!-- BANNER BOTTOM END -->
  </v-sheet>
  <v-sheet v-else class="blue lighten-4 rounded-lg">
    <v-img :src="$_get(pool, 'data.projectCover', '')">
      <div class="text-end ma-4">
        <voting-out-btn />
      </div>
    </v-img>
    <div class="white d-flex flex-column align-center py-4">
      <div class="font-28 font-weight-bold mb-4">{{ $_get(pool, 'projectName') }}</div>
      <div class="mb-4 text-subtitle-1">
        <span class="font-weight-bold">{{ upvote | formatNumber(2) }}%</span>
        <span>👍 YES votes</span>
      </div>
      <div class="text-subtitle-1">
        <span class="font-weight-bold">{{ downvote | formatNumber(2) }}%</span>
        <span>👎 NO votes</span>
      </div>
    </div>
    <div class="d-flex flex-column align-center py-4 text-subtitle-1 font-weight-bold">
      <div class="mb-2">Ended voting in: {{ $_get(pool, 'endDate') | ddmmyyyyhhmmss }}</div>
      <div class="mb-4">Launching soon on {{ platform }}</div>
      <v-btn class="rounded-lg" color="blue" height="50" outlined :to="'#'">
        <span class="text-h6">Read more</span>
      </v-btn>
    </div>
  </v-sheet>
</template>

<script lang="ts">
import { Metadata, VotingPools } from '@/models/VotingModel'
import { Component, Vue, Prop } from 'vue-property-decorator'
import { get } from 'lodash-es'
import moment from 'moment'
@Component({
  components: {
    'voting-out-btn': () => import('../common/voting-out-btn.vue'),
    'voting-progress-circle': () => import('../common/voting-progress-circle.vue'),
  },
})
export default class VotingLaunchItem extends Vue {
  @Prop({ required: true }) pool!: VotingPools
  upvote = Math.floor(Math.random() * 100 + 1)
  downvote = 100 - this.upvote
  platform = this.pool.type === 'bounty' ? 'Bounty Hunter' : 'Launchpad'
}
</script>

<style lang="scss" scoped>
.font-28 {
  font-size: 28px;
  line-height: 36.4px;
}
</style>
