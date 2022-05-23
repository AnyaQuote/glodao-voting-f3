<template>
  <v-row>
    <v-col v-if="vm.loading" cols="12" md="9">
      <v-skeleton-loader type="image, image" />
      <v-skeleton-loader tile v-show="$vuetify.breakpoint.mdAndUp" type="image" />
    </v-col>

    <!-- --------------------------------------------------------------------------------------------------- -->
    <v-col v-else cols="12" md="8">
      <v-carousel height="555" hide-delimiter-background hide-delimiters v-model="tab">
        <template v-slot:prev="{ on, attrs }">
          <v-sheet
            class="ml-n4 px-2 py-10 d-flex justify-center rounded-lg rounded-l-0 carousel-button"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon color="black">mdi-chevron-left</v-icon>
          </v-sheet>
        </template>
        <template v-slot:next="{ on, attrs }">
          <v-sheet
            v-bind="attrs"
            v-on="on"
            class="mr-n4 px-2 py-10 d-flex justify-center rounded-lg rounded-r-0 carousel-button"
          >
            <v-icon color="black">mdi-chevron-right</v-icon>
          </v-sheet>
        </template>
        <v-carousel-item v-for="(item, i) in vm.votingList" :key="i" eager>
          <!-- CAROUSEL ITEM START -->
          <v-sheet class="trending-left blue lighten-5 rounded-lg">
            <v-img class="rounded-lg rounded-b-0 text-end" :src="$_get(item, 'data.projectCover')">
              <voting-out-btn class="mt-7 mr-7" width="51" height="51" />
            </v-img>
            <div class="trending-left-bottom d-flex align-end px-4 pb-4">
              <div class="trending-left-bottom__content text-h4 py-6 font-weight-bold">{{ item.projectName }}</div>
              <v-sheet class="trending-left-bottom__logo rounded-lg pa-3" width="160" height="160">
                <v-img contain aspect-ratio="1" :src="$_get(item, 'data.projectLogo')" />
              </v-sheet>
            </div>
          </v-sheet>
          <!-- CAROUSEL ITEM END -->
        </v-carousel-item>
      </v-carousel>
    </v-col>
    <!-- --------------------------------------------------------------------------------------------------- -->

    <v-col v-if="vm.loading" cols="12" md="3">
      <div class="row">
        <v-skeleton-loader v-for="index in 3" :key="index" height="206" type="image" class="col-4 col-md-12" />
      </div>
    </v-col>

    <!-- --------------------------------------------------------------------------------------------------- -->
    <v-col v-else cols="12" md="4">
      <div class="text-uppercase blue--text text-h6 mb-4">Trending now</div>
      <v-sheet class="d-flex flex-row flex-md-column" :height="carouselItemHeight" :class="carouselItemClass">
        <!-- PREVIEW SCROLL ITEM START -->
        <div
          v-for="(item, index) in vm.votingList"
          class="mb-md-4 mr-md-0 mr-2 cursor-pointer"
          @click="changeTab(i)"
          :key="index"
          v-ripple
        >
          <div v-if="$vuetify.breakpoint.mdAndUp" class="d-flex">
            <v-img class="rounded-lg" max-width="163" max-height="99" :src="$_get(item, 'data.projectCover')" />
            <div class="ml-4 d-flex flex-column justify-space-around align-start">
              <v-chip outlined :color="item.type === 'bounty' ? 'yellow' : 'green'">
                <span class="black--text text-subtitle-2 mx-2 text-capitalize">{{ item.type }}</span>
              </v-chip>
              <div class="font-weight-medium">
                {{ item.projectName }}
              </div>
            </div>
          </div>
          <div v-else>
            <v-img class="rounded-lg" max-width="164" :src="$_get(item, 'data.projectCover')" />
          </div>
        </div>
        <!-- PREVIEW SCROLL ITEM END -->
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator'
import { VotingListViewModel } from '../viewmodels/voting-list-viewmodel'

@Component({
  components: {
    'voting-out-btn': () => import('../components/common/voting-out-btn.vue'),
  },
})
export default class VotingTrendingSection extends Vue {
  @Inject() vm!: VotingListViewModel
  tab = 1
  changeTab(index: number) {
    this.tab = index
  }

  get carouselItemHeight() {
    return this.$vuetify.breakpoint.mdAndUp ? '480' : 'auto'
  }

  get carouselItemClass() {
    return this.$vuetify.breakpoint.mdAndUp ? 'overflow-y-auto' : 'overflow-x-auto'
  }
}
</script>

<style lang="scss" scoped>
.carousel-button {
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  margin-top: -100px;
}

.trending-left {
  .trending-left-bottom {
    position: relative;
    .trending-left-bottom__content {
      margin-left: 180px;
    }
    .trending-left-bottom__logo {
      position: absolute;
    }
  }
}

.overflow-y-auto {
  overflow-y: auto;
}

.overflow-x-auto {
  overflow-x: auto;
}
</style>
