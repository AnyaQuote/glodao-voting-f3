<template>
  <v-sheet class="banner blue lighten-4 rounded-lg">
    <div class="p-relative">
      <!-- BANNER IMAGE START -->
      <v-sheet class="p-relative grey2 rounded-lg rounded-b-0">
        <v-img :src="projectCover"></v-img>
      </v-sheet>
      <!-- BANNER IMAGE END -->

      <!-- BANNER TOP START -->
      <div class="p-absolute absolute-space d-flex flex-column white--text pt-7 px-9">
        <div class="d-flex align-center justify-space-between">
          <span class="text-h6 font-weight-bold">Project launching soon</span>
          <voting-out-btn />
        </div>
        <div class="row justify-center mt-10">
          <div class="col-12 text-center">
            <div class="text-h3 font-weight-bold">{{ projectName }}</div>
            <v-sheet width="500" class="mx-auto transparent--bg white--text mt-4 text-h5">
              {{ data.shortDescription }}
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
      <!-- BANNER TOP END -->
    </div>
    <!-- BANNER BOTTOM START -->
    <div class="pa-9 d-flex justify-space-between align-center">
      <div class="d-flex justify-center mt-2 text-h5 font-weight-bold">
        <div class="mr-4">LAUNCHING SOON:</div>
        <div>{{ launchDate }}</div>
      </div>
      <v-btn class="rounded-lg" color="blue" height="50" outlined :to="'#'">
        <span class="text-h6">Read more</span>
      </v-btn>
    </div>
    <!-- BANNER BOTTOM END -->
  </v-sheet>
</template>

<script lang="ts">
import { Metadata } from '@/models/VotingModel'
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
  @Prop({ required: true }) projectName!: string
  @Prop({ required: true }) data!: Metadata
  @Prop({ required: true }) type!: string
  @Prop({ required: true }) endDate!: string
  upvote = Math.floor(Math.random() * 100 + 1)
  downvote = 100 - this.upvote
  launchDate = moment(this.endDate).add(1, 'days').toISOString()
  projectLogo = get(this.data, 'projectLogo', '')
  projectCover = get(this.data, 'projectCover', '')
}
</script>

<style lang="scss" scoped>
.subtitle-text {
  word-break: break-all;
}
</style>
