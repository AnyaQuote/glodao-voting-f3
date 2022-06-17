<template>
  <v-sheet class="d-flex px-6 mt-6">
    <!-- ------------------------------------- IMAGE COVER  ------------------------------------- -->
    <v-img
      class="d-none d-md-block rounded-lg flex-shrink-0"
      :src="$_get(pool, 'projectCover')"
      max-width="256"
      height="171"
    />
    <!-- ------------------------------------- INFORMATION --------------------------------------- -->
    <div class="d-flex flex-column flex-grow-1 pa-6">
      <div class="d-flex align-center">
        <!-- ==== LOGO ==== -->
        <v-img :src="$_get(pool, 'projectLogo')" max-width="38" max-height="38" />
        <span class="text-h5 font-weight-600 ml-3">{{ $_get(pool, 'projectName') }}</span>
      </div>

      <!-- ==== ENDED TIME ==== -->
      <div class="mt-2 font-18 neutral-10--text font-weight-600">
        Ended in {{ $_get(pool, 'votingEnd') | ddmmyyyyhhmma }}
      </div>

      <!-- ==== VOTE STAT ==== -->
      <div class="d-flex mt-6">
        <!-- NO STAT PERCENTAGE -->
        <v-sheet
          width="136"
          outlined
          class="d-flex text-center rounded-lg mr-2"
          style="border-color: var(--v-green-base)"
        >
          <span class="flex-grow-1">{{ $_get(pool, 'votedYesPercent') | formatNumber(2) }}%</span>
          <div class="green white--text flex-grow-1 rounded-lg">👍 YES</div>
        </v-sheet>
        <!-- YES STAT PERCENTAGE -->
        <v-sheet width="136" class="d-flex text-center rounded-lg" outlined style="border-color: var(--v-red-base)">
          <span class="flex-grow-1">{{ $_get(pool, 'votedNoPercent') | formatNumber(2) }}%</span>
          <div class="red white--text flex-grow-1 rounded-lg">👎 NO</div>
        </v-sheet>
        <!-- // -->
      </div>
      <!-- =============== -->
    </div>

    <!-- ------------------------------------- BUTTON -------------------------------------------- -->
    <div class="align-self-center">
      <v-btn icon class="blue-2" height="52" width="52" :to="`/voting/${pool.unicodeName}`">
        <v-icon large>mdi-arrow-right</v-icon>
      </v-btn>
    </div>
    <!-- ----------------------------------------------------------------------------------------- -->
  </v-sheet>
</template>

<script lang="ts">
import { PoolStore } from '@/stores/pool-store'
import { Observer } from 'mobx-vue'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Observer
@Component
export default class VotingEndedListItem extends Vue {
  @Prop({ required: true }) pool!: PoolStore
}
</script>

<style scoped></style>
