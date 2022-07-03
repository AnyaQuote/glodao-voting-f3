<template>
  <v-tabs class="rounded-lg mt-7 outlined" color="blue-diversity" background-color="neutral-100">
    <v-tab>App Description</v-tab>
    <v-tab>App Screenshot</v-tab>
    <v-tab-item class="pa-6">
      <p>
        Battle the likes of sozzled bearbearians and nuke-addled snotwolves to protect our glowing green world from the
        sweaty hands of the Uberlich! Krumit's Tale involves the same core deck building mechanics as Meteorfall:
        Journeys and the same cast of overly optimistic heroes, but expands the ‘swipe’ mechanic into a dynamic grid
        based system. This means more depth and longevity – our heroes will have to choose perks to complement their
        deck-building strategy and carefully manage the board if they wish to triumph. <br /><br />
        + A follow-up to the popular mobile solo deckbuilding card game - Meteorfall: Journeys! <br />
        + The brave heroes of Meteorfall return! Play as five different heroes - Bruno, Greybeard, Mischief, Muldorf,
        and Rose - each with their own cards and a distinct playstyle<br />
        + More than 30 achievements to unlock <br />
        + Feeling competitive? Check out the daily challenge mode! Each day has a different set of modifiers which tweak
        the rules of the game in radical ways. <br />
        + Mobile optimized gameplay. The game can be played one-handed in portrait mode and auto-saves frequently
      </p>
    </v-tab-item>
    <v-tab-item class="pa-6 d-flex">
      <v-sheet class="debug">
        <!-- <v-img height="200" src="@/assets/images/mission/mock-screenshot.jpg" /> -->
      </v-sheet>
    </v-tab-item>
  </v-tabs>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Inject, Vue } from 'vue-property-decorator'
import { InAppTrialDetailViewModel } from '../../viewmodels/iat-detail-viewmodel'

@Observer
@Component
export default class MissionAppOverview extends Vue {
  @Inject() vm!: InAppTrialDetailViewModel
}
</script>

<style scoped>
.outlined {
  border: 1px solid var(--v-neutral-20-base);
}
</style>
