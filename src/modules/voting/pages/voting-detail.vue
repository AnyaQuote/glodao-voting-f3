<template>
  <v-row class="mb-72">
    <v-col cols="12">
      <div class="d-flex align-center mt-5">
        <v-breadcrumbs :items="items" divider=">" class="pa-0">
          <template v-slot:item="{ item }">
            <v-breadcrumbs-item :disabled="item.disabled" :href="item.href">
              <span
                class="font-weight-bold"
                :class="item.text === 'DAO Voting' ? 'bluePrimary--text' : 'neutral10--text'"
                >{{ item.text }}</span
              >
            </v-breadcrumbs-item>
          </template>
          <template v-slot:divider>
            <v-icon size="22"> mdi-chevron-right </v-icon>
          </template>
        </v-breadcrumbs>
      </div>
    </v-col>

    <v-col cols="12">
      <voting-detail-overview></voting-detail-overview>
    </v-col>

    <v-col cols="12">
      <div class="row mt-72">
        <!-- <div class=" debug mb-6"> -->
        <v-sheet class="col-12 rounded-lg pa-4 d-flex align-center justify-space-between mb-6">
          <div class="text-h5 neutral100--bg font-weight-bold">USER VOTE (800)</div>
          <v-btn icon>
            <v-icon large>mdi-information</v-icon>
          </v-btn>
        </v-sheet>
        <!-- </div> -->

        <!-- VOTED USER LIST START -->
        <div class="col-12">
          <voting-list-item class="mb-4 pa-2" elevation="3" v-for="i in Array(7)" :key="i" />
        </div>

        <div class="col-12">
          <v-pagination prev-icon="mdi-arrow-left" :length="4" next-icon="mdi-arrow-right" />
        </div>
        <!-- VOTED USER LIST END -->
      </div>
    </v-col>

    <v-col cols="12">
      <div class="nominated-section mt-72">
        <div class="header">
          <span class="header-title mr-5 font-weight-bold text-uppercase">SIMILIAR NOMINATED PROJECT</span>
        </div>
      </div>
      <div class="app-slide-group">
        <v-slide-group class="ma-n1 px-1">
          <v-slide-item v-for="i in [1, 2, 3, 4, 5]" :key="i" class="ma-1 debug">
            <live-compact-card width="348" />
          </v-slide-item>
        </v-slide-group>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator'
import { VotingDetailViewModel } from '../viewmodels/voting-detail-viewmodel'
import { get } from 'lodash-es'
@Component({
  components: {
    'voting-detail-overview': () => import('../components/voting-detail-overview.vue'),
    'voting-list-item': () => import('../components/common/voting-list-item.vue'),
    'live-compact-card': () => import('../components/common/live-compact-card.vue'),
  },
})
export default class VotingDetail extends Vue {
  @Provide() vm = new VotingDetailViewModel()
  items = [
    {
      text: 'DAO Voting',
      disabled: false,
      href: '/voting',
    },
    {
      text: 'Hydro Wind Energy',
      disabled: true,
      href: '/voting/123',
    },
  ]

  mounted() {
    this.vm.getUnicode(get(this.$route, 'query.id'))
  }
}
</script>

<style lang="scss" scoped>
.mt-72 {
  margin-top: em(72);
}
.mb-72 {
  margin-bottom: em(72);
}
.nominated-section {
  .header {
    font-size: em(28);
    line-height: em(36.4);
    .header-title {
    }
    .header-subtitle {
    }
  }
}
</style>
