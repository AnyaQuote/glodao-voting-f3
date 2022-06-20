<template>
  <v-row>
    <!-- -------------------------------------------- LOADING ----------------------------------------------------- -->
    <v-row v-if="vm.loading">
      <v-col cols="12" md="9">
        <v-skeleton-loader type="image, image" />
        <v-skeleton-loader tile v-show="$vuetify.breakpoint.mdAndUp" type="image" />
      </v-col>
      <v-col cols="12" md="3">
        <div class="row">
          <v-skeleton-loader v-for="index in 3" :key="index" height="206" type="image" class="col-4 col-md-12" />
        </div>
      </v-col>
    </v-row>
    <!-- --------------------------------------------- EMPTY ------------------------------------------------------ -->
    <v-col v-else-if="!vm.loading && !vm.votingList.length" cols="12">
      <div class="py-8">
        <div class="text-uppercase text-h4 font-weight-bold">Trending now</div>
        <div class="text-h6 text-center mt-8">No projects avalible for voting right now</div>
      </div>
    </v-col>
    <!-- --------------------------------------------- HAS PROJECTS ---------------------------------------------- -->
    <!-- CAROUSEL ITEM START -->
    <v-row v-else class="overflow-hidden mx-1 mx-sm-0">
      <v-col cols="12" md="8">
        <v-carousel
          height="auto"
          hide-delimiter-background
          hide-delimiters
          v-model="tab"
          cycle
          continuous
          class="fill-height elevation-3 rounded-lg"
          show-arrows-on-hover
        >
          <template v-slot:prev="{ on, attrs }">
            <v-sheet
              class="ml-n4 mt-n4 px-2 py-10 d-flex justify-center rounded-lg rounded-l-0 carousel-button"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon color="primary">mdi-chevron-left</v-icon>
            </v-sheet>
          </template>
          <template v-slot:next="{ on, attrs }">
            <v-sheet
              v-bind="attrs"
              v-on="on"
              class="mr-n4 mt-n4 px-2 py-10 d-flex justify-center rounded-lg rounded-r-0 carousel-button"
            >
              <v-icon color="primary">mdi-chevron-right</v-icon>
            </v-sheet>
          </template>
          <v-carousel-item v-for="(item, i) in vm.votingList" :key="i" eager>
            <v-sheet class="rounded-lg blue-2 linear-gradient--bg" :class="customPadding">
              <v-img
                class="p-relative rounded-lg rounded-b-0 text-end z-index-1"
                :max-height="$vuetify.breakpoint.smAndUp ? 435 : 234"
                aspect-ratio="1"
                :src="$_get(item, 'projectCover')"
              >
                <voting-share-btn class="ma-7" />
              </v-img>
              <div class="d-flex align-end p-absolute absolute-space">
                <v-sheet class="blue-2 rounded-lg pa-3 ml-6 z-index-2" outlined :class="logoSize">
                  <v-img contain aspect-ratio="1" :src="$_get(item, 'projectLogo')" />
                </v-sheet>
                <div class="font-weight-bold ml-4 mb-sm-6 mb-3 text-sm-h4 text-subtitle-1 text-truncate">
                  {{ $_get(item, 'projectName') }}
                </div>
              </div>
            </v-sheet>
          </v-carousel-item>
        </v-carousel>
      </v-col>
      <!-- CAROUSEL ITEM END -->

      <!-- PREVIEW SCROLL ITEM START -->
      <v-col cols="12" md="4">
        <div class="text-uppercase blue-diversity--text text-h6 mb-4">Trending now</div>
        <v-sheet
          v-if="$vuetify.breakpoint.mdAndUp"
          height="480"
          class="rounded-lg-y pa-n4 overflow-y-scroll rounded-lg"
          elevation="3"
        >
          <!-- ------------------------------------ MOBILE SLIDER VERTICAL -------------------------------------- -->
          <div
            v-for="(item, index) in vm.votingList"
            class="pa-4 cursor-pointer"
            @click="changeTab(index)"
            :key="index"
            v-ripple
          >
            <v-hover v-slot="{ hover }">
              <div class="d-flex transparent-border" :class="{ 'active-border': hover }">
                <v-img
                  class="rounded-lg"
                  :src="$_get(item, 'projectCover')"
                  max-height="100"
                  min-height="100"
                  max-width="160"
                />
                <div class="ml-4 d-flex flex-column justify-space-around align-start">
                  <v-sheet
                    class="transparent--bg rounded-pill px-3"
                    :style="`border-color: ${borderColorBy(item.type)} !important`"
                    outlined
                  >
                    <span class="text-subtitle-2 text-capitalize">{{ item.type }}</span>
                  </v-sheet>
                  <div class="font-weight-medium">
                    {{ item.projectName }}
                  </div>
                </div>
              </div>
            </v-hover>
          </div>
        </v-sheet>
        <!-- ------------------------------------ MOBILE SLIDER HORIZONTAL ------------------------------------ -->
        <v-sheet v-else class="d-flex pa-n1 rounded-lg overflow-x-scroll" elevation="3">
          <div
            v-for="(item, index) in vm.votingList"
            class="pa-1 cursor-pointer"
            @click="changeTab(index)"
            :key="index"
            v-ripple
          >
            <v-hover v-slot="{ hover }">
              <div class="transparent-border" :class="{ 'active-border': hover }">
                <v-img class="rounded-lg" height="100" width="150" :src="$_get(item, 'projectCover')" />
              </div>
            </v-hover>
          </div>
        </v-sheet>
        <!-- PREVIEW SCROLL ITEM END -->
        <!-- --------------------------------------------------------- -------------------------------------- -->
      </v-col>
    </v-row>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator'
import { VotingListViewModel } from '../viewmodels/voting-list-viewmodel'

@Component({
  components: {
    'voting-share-btn': () => import('../components/common/voting-share-btn.vue'),
  },
})
export default class VotingTrendingSection extends Vue {
  @Inject() vm!: VotingListViewModel
  tab = 1
  changeTab(index: number) {
    this.tab = index
  }

  // get carouselItemColor() {
  //   return this.$vuetify.theme.dark ? 'neutral100--bg' : 'blue lighten-4'
  // }

  get logoSize() {
    return this.$vuetify.breakpoint.smAndUp ? 'w-h-160' : 'w-h-80'
  }

  get customPadding() {
    return this.$vuetify.breakpoint.smAndUp ? 'pb-92' : 'pb-12'
  }

  get borderColorBy() {
    return (type) => (type === 'bounty' ? 'orange' : 'green')
  }
}
</script>

<style lang="scss" scoped>
.pb-92 {
  padding-bottom: 92px;
}

.linear-gradient--bg {
  background: linear-gradient(12.87deg, var(--v-blue-2-base) 6.84%, rgba(20, 57, 115, 0) 94.95%) !important;
}

.transparent-border {
  border: 2px solid transparent;
}

.active-border {
  border: 2px solid var(--v-blue-diversity-base) !important;
  border-radius: 8px;
  transform: scale(105%);
  transition: transform 300ms;
}

.overflow-y-scroll {
  overflow-y: scroll;
}

.overflow-x-scroll {
  overflow-x: scroll;
}

.w-h-160 {
  width: 160px;
  height: 160px;
}

.w-h-80 {
  width: 80px;
  height: 80px;
}

.z-index-1 {
  z-index: 1;
}

.z-index-2 {
  z-index: 2;
}
</style>
