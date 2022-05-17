<template>
  <v-sheet class="banner blue lighten-4 rounded-lg">
    <div class="banner-top">
      <!-- BANNER IMAGE START -->
      <v-sheet class="banner-image grey2 rounded-lg rounded-b-0">
        <v-img src="@/assets/images/voting-home--background.png"></v-img>
      </v-sheet>
      <!-- BANNER IMAGE END -->

      <!-- BANNER TOP START -->
      <div class="banner-top__content d-flex flex-column white--text pt-7 px-9">
        <div class="d-flex align-center justify-space-between">
          <span class="text-h6 font-weight-bold">Project launching soon</span>
          <voting-out-btn />
        </div>
        <div class="row justify-center mt-10">
          <div class="col-12 text-center">
            <div class="text-h3 font-weight-bold">{{ projectName }}</div>
            <div class="subtitle-text mt-4 text-h5">
              {{ shortDescription }}
            </div>
            <div class="d-flex justify-center mt-4">
              <div class="mr-13">
                <voting-progress-circle :value="upvote" color="green"> </voting-progress-circle>
                <div class="mt-2 text-h6">👍 YES votes</div>
              </div>
              <div>
                <voting-progress-circle value="90" color="red"> </voting-progress-circle>
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
      <v-btn class="rounded-lg" color="blue" height="50" outlined :to="readmoreLink">
        <span class="text-h6">Read more</span>
      </v-btn>
    </div>
    <!-- BANNER BOTTOM END -->
  </v-sheet>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

interface Props {
  projectName?: string
  shortDescription?: string
  upvote?: string
  downvote?: string
  detailLink?: string
  readmoreLink?: string
  launchDate?: string
}

@Component({
  components: {
    'voting-out-btn': () => import('../common/voting-out-btn.vue'),
    'voting-progress-circle': () => import('../common/voting-progress-circle.vue'),
  },
})
export default class VotingLaunchItem extends Vue {
  @Prop() props!: Props

  get projectName() {
    return this.props.projectName
  }

  get shortDescription() {
    return this.props.shortDescription
  }

  get upvote() {
    return this.props.upvote
  }

  get downvote() {
    return this.props.downvote
  }

  get detailLink() {
    return this.props.detailLink
  }

  get readmoreLink() {
    return this.props.readmoreLink
  }

  get launchDate() {
    return this.props.launchDate
  }
}
</script>

<style lang="scss" scoped>
.banner {
  .banner-top {
    position: relative;
    .banner-image {
      position: relative;
    }
    .banner-top__content {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      .subtitle-text {
        word-break: break-all;
      }
    }
  }
}
</style>
