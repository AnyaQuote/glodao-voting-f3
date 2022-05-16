<template>
  <div class="row">
    <div class="col-8">
      <v-carousel height="auto" hide-delimiter-background hide-delimiters v-model="tab">
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
        <v-carousel-item v-for="i in n" :key="i" eager>
          <!-- CAROUSEL ITEM START -->
          <v-sheet class="trending-left blue lighten-5 rounded-lg">
            <div class="trending-left-top">
              <v-img class="img rounded-lg rounded-b-0" src="@/assets/images/voting-trending--background.png" contain />
              <voting-out-btn class="btn mt-7 mr-7" width="51" height="51" />
            </div>
            <div class="trending-left-bottom d-flex align-end px-4 pb-4">
              <div class="trending-left-bottom__content text-h4 py-6 font-weight-bold">Hydro Wind Energy</div>
              <v-sheet class="trending-left-bottom__logo rounded-lg pa-3" width="160" height="160">
                <v-img contain aspect-ratio="1" src="../../../assets/icons/voting-trending--logo.png" />
              </v-sheet>
            </div>
          </v-sheet>
          <!-- CAROUSEL ITEM END -->
        </v-carousel-item>
      </v-carousel>
    </div>
    <div class="col-4">
      <div class="trending-right">
        <div class="text-uppercase blue--text text-h6 mb-4">Trending now</div>
        <div class="trending-right__content pa-5 pb-0">
          <!-- PREVIEW SCROLL ITEM START -->
          <v-sheet
            v-for="i in n"
            :key="i"
            class="d-flex mb-4"
            :class="{ active: tab === i }"
            v-ripple
            @click="changeTab(i)"
          >
            <v-img class="rounded-lg" contain max-width="163" src="@/assets/images/voting-trending--background.png" />
            <div class="ml-4 d-flex flex-column justify-space-around align-start">
              <v-chip color="yellow" outlined>
                <span class="black--text text-subtitle-2 mx-2">Bounty</span>
              </v-chip>
              <div class="font-weight-medium" style="font-size: 1.125rem; line-height: 1.125rem">Hydro Wind Energy</div>
            </div>
          </v-sheet>
          <!-- PREVIEW SCROLL ITEM END -->
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {
    'voting-out-btn': () => import('../components/common/voting-out-btn.vue')
  }
})
export default class VotingTrendingSection extends Vue {
  n = [0, 1, 2, 3, 4, 5]
  tab = 1
  changeTab(index: number) {
    this.tab = index
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
  .trending-left-top {
    position: relative;
    .img {
      position: relative;
    }
    .btn {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
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

.trending-right {
  .trending-right__content {
    height: 480px;
    overflow-y: auto;
    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      border-radius: 10px;
      background-color: #f5f5f5;
    }
    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
      background-color: #f5f5f5;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      background-color: var(--v-blue-lighten2);
    }
    .active {
      border: 1px solid var(--v-blue-base) !important;
      border-radius: em(8);
    }
  }
}

.fill-height {
  height: 100%;
}
</style>
