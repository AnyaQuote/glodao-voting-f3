<template>
  <v-row>
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
      <!-- BANNER SECTION START -->
      <voting-detail-overview></voting-detail-overview>
    </v-col>
    <v-col cols="12">
      USER VOTE
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import VotingDetailOverview from '../components/voting-detail-overview.vue'

@Component({
  components: {
    'voting-detail-overview': () => import('../components/voting-detail-overview.vue')
  }
})
export default class VotingDetail extends Vue {
  items = [
    {
      text: 'DAO Voting',
      disabled: false,
      href: '/voting'
    },
    {
      text: 'Hydro Wind Energy',
      disabled: true,
      href: '/voting/123'
    }
  ]
}
</script>

<style lang="scss" scoped></style>
