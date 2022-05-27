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
    <v-col v-else-if="!vm.loading && vm.votingList.length" cols="12">
      <v-sheet class="pa-8 rounded-lg" outlined elevation="3">
        <div class="blue-diversity--text text-h5 font-weight-bold">Trending</div>
        <div class="text-h6">No projects avalible for voting right now</div>
      </v-sheet>
    </v-col>
    <!-- --------------------------------------------- HAS PROJECTS ---------------------------------------------- -->
    <v-row v-else>
      <v-col cols="12" md="8">
        <v-carousel
          height="auto"
          hide-delimiter-background
          hide-delimiters
          v-model="tab"
          class="fill-height"
          show-arrows-on-hover
        >
          <template v-slot:prev="{ on, attrs }">
            <v-sheet
              class="ml-n4 mt-n4 px-2 py-10 d-flex justify-center rounded-lg rounded-l-0 carousel-button"
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
              class="mr-n4 mt-n4 px-2 py-10 d-flex justify-center rounded-lg rounded-r-0 carousel-button"
            >
              <v-icon color="black">mdi-chevron-right</v-icon>
            </v-sheet>
          </template>
          <v-carousel-item v-for="(item, i) in vm.votingList" :key="i" eager>
            <!-- CAROUSEL ITEM START -->
            <v-sheet class="rounded-lg" :class="[carouselItemColor, customPadding]">
              <v-img
                class="p-relative rounded-lg rounded-b-0 text-end"
                max-height="435"
                aspect-ratio="1"
                :src="$_get(item, 'projectCover')"
              >
                <voting-out-btn class="mt-7 mr-7" />
              </v-img>
              <div class="d-flex align-end p-absolute absolute-space">
                <v-sheet class="neutral100--bg rounded-lg pa-3 ml-6" outlined :class="logoSize">
                  <v-img contain aspect-ratio="1" :src="$_get(item, 'projectLogo')" />
                </v-sheet>
                <div class="font-weight-bold ml-4 mb-sm-6 mb-3 text-sm-h4 text-subtitle-1">
                  {{ $_get(item, 'projectName') }}
                </div>
              </div>
            </v-sheet>
            <!-- CAROUSEL ITEM END -->
          </v-carousel-item>
        </v-carousel>
      </v-col>
      <v-col cols="12" md="4">
        <div class="text-uppercase blue-diversity--text text-h6 mb-4">Trending now</div>
        <v-sheet class="d-flex flex-row flex-md-column transparent--bg" :class="carouselItemClass">
          <!-- PREVIEW SCROLL ITEM START -->
          <div
            v-for="(item, index) in vm.votingList"
            class="mb-md-4 mr-md-0 mr-2 pa-1 cursor-pointer"
            @click="changeTab(index)"
            :key="index"
            v-ripple
          >
            <v-hover v-slot="{ hover }">
              <div
                v-if="$vuetify.breakpoint.mdAndUp"
                class="d-flex transparent-border"
                :class="{ 'active-border': hover }"
              >
                <v-img class="rounded-lg" max-width="163" max-height="99" :src="$_get(item, 'projectCover')" />
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
              <div v-else class="transparent-border" :class="{ 'active-border': hover }">
                <v-img class="rounded-lg" max-width="160" :src="$_get(item, 'projectCover')" />
              </div>
            </v-hover>
          </div>
          <!-- PREVIEW SCROLL ITEM END -->
        </v-sheet>
      </v-col>
    </v-row>
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

  get carouselItemColor() {
    return this.$vuetify.theme.dark ? 'neutral100--bg' : 'blue lighten-4'
  }

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

.transparent-border {
  border: thin solid transparent;
}

.active-border {
  border: thin solid var(--v-blue-diversity-base) !important;
  border-radius: 8px;
}

.carousel-button {
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
}

.overflow-y-auto {
  overflow-y: auto;
}

.overflow-x-auto {
  overflow-x: auto;
}

.w-h-160 {
  width: 160px;
  height: 160px;
}

.w-h-80 {
  width: 80px;
  height: 80px;
}
</style>
