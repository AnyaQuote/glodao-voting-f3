<template>
  <div class="px-16">
    <div class="text-center text-h5 font-weight-bold mb-9">What type of project do you want to launch on GLoDAO?</div>

    <v-row no-gutters dense align="stretch">
      <v-col cols="6" class="pr-3">
        <v-sheet height="290" elevation="3" class="rounded-lg pt-12 pr-6">
          <v-sheet height="100%" class="pa-6 d-flex flex-column justify-space-between">
            <div>
              <img :src="require('@/assets/icons/mission-icon.svg')" width="48" />
            </div>
            <div class="font-weight-bold text-h5">Bounty hunter</div>
            <div class="text-subtitle-1 font-weight-regular">
              Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis
              enim velit mollit.
            </div>
          </v-sheet>
        </v-sheet>
      </v-col>
      <v-col cols="6" class="pl-3">
        <v-sheet height="290" elevation="3" class="rounded-lg pt-12 pr-6">
          <v-sheet height="100%" class="pa-6 d-flex flex-column justify-space-between">
            <div>
              <img :src="require('@/assets/icons/mission-icon.svg')" width="48" />
            </div>
            <div class="font-weight-bold text-h5">Bounty hunter</div>
            <div class="text-subtitle-1 font-weight-regular">
              Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis
              enim velit mollit.
            </div>
          </v-sheet>
        </v-sheet>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue';
import { Component, Vue } from 'vue-property-decorator'

@Observer
@Component
export default class extends Vue {}
</script>

<style scoped></style>
