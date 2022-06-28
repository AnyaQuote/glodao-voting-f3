<template>
  <div>
    <v-sheet class="d-none d-sm-flex px-6 mt-6">
      <!-- ------------------------------------- IMAGE COVER  ------------------------------------- -->
      <v-img
        class="d-none d-md-block rounded-lg flex-shrink-0"
        :src="$_get(pool, 'projectCover')"
        max-width="256"
        height="171"
      />
      <v-img
        class="d-sm-block d-md-none rounded-lg flex-shrink-0 align-self-center"
        :src="$_get(pool, 'projectCover')"
        max-height="120"
        aspect-ratio="1"
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
            style="border-color: var(--v-green-base) !important"
          >
            <span class="flex-grow-1">{{ $_get(pool, 'votedYesPercent') | formatNumber(2) }}%</span>
            <div class="green white--text flex-grow-1 rounded-lg">👍 YES</div>
          </v-sheet>
          <!-- YES STAT PERCENTAGE -->
          <v-sheet
            width="136"
            class="d-flex text-center rounded-lg"
            outlined
            style="border-color: var(--v-red-base) !important"
          >
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

    <v-sheet class="d-block d-sm-none mt-6">
      <v-img class="rounded-lg" :src="$_get(pool, 'projectCover')" aspect-ratio="1" max-height="200">
        <div class="d-flex flex-column fill-height">
          <!-- ---------------------- UPPER LIST ITEM CONTENT START ---------------------- -->
          <div class="d-flex justify-space-between align-start">
            <div class="d-flex ma-1 ml-2">
              <!-- NO STAT PERCENTAGE -->
              <v-sheet
                outlined
                style="border-color: var(--v-green-base) !important"
                class="d-flex text-center rounded-lg mr-2 text-subtitle-2 white--text black-opaque--bg"
              >
                <span class="flex-grow-1 px-2">{{ $_get(pool, 'votedYesPercent') | formatNumber(2) }}%</span>
                <div class="green flex-grow-1 rounded-lg px-2">👍 YES</div>
              </v-sheet>
              <!-- YES STAT PERCENTAGE -->
              <v-sheet
                outlined
                style="border-color: var(--v-red-base) !important"
                class="d-flex text-center rounded-lg text-subtitle-2 white--text black-opaque--bg"
              >
                <span class="flex-grow-1 px-2">{{ $_get(pool, 'votedNoPercent') | formatNumber(2) }}%</span>
                <div class="red flex-grow-1 rounded-lg px-2">👎 NO</div>
              </v-sheet>
            </div>
            <v-btn icon class="blue-2 align-self-end ma-3" height="30" width="30" :to="`/voting/${pool.unicodeName}`">
              <v-icon size="20">mdi-arrow-right</v-icon>
            </v-btn>
          </div>
          <!-- ---------------------- UPPER LIST ITEM CONTENT END ---------------------- -->

          <v-spacer />

          <!-- ---------------------- BOTTOM LIST ITEM CONTENT START ---------------------- -->
          <div class="d-flex align-end px-4 pa-2 black-opaque--bg">
            <v-img class="rounded-circle" :src="$_get(pool, 'projectLogo')" max-height="48" max-width="48" />
            <div class="d-flex flex-column ml-4">
              <div class="text-subtitle-1 font-weight-600 white--text">{{ $_get(pool, 'projectName') }}</div>
              <span class="white--text">Ended in {{ $_get(pool, 'votingEnd') | ddmmyyyyhhmma }}</span>
            </div>
          </div>
          <!-- ---------------------- BOTTOM LIST ITEM CONTENT END ------------------------- -->
        </div>
      </v-img>
    </v-sheet>
    <!-- ---------------------------------  MOBILE LIST ITEM VIEW END ------------------------------ -->
  </div>
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
