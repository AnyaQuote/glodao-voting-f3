<template>
  <v-row>
    <v-col cols="12" md="8" order="2" order-md="1">
      <v-sheet outlined rounded="lg" class="pa-6 mb-6">
        <!-- PROJECT LOGO AND NAME START  -->
        <div class="d-flex align-center">
          <v-avatar size="76">
            <v-img src="@/assets/icons/voting-trending--logo.png" />
          </v-avatar>
          <div class="d-flex flex-column justify-space-between ml-4 flex-grow-1">
            <span class="text-h5 font-weight-bold">Mission Dragon #1</span>
            <span class="text-h6 font-weight-bold neutral-10--text">Jan 21st 2022 - Jan 21st 2023</span>
          </div>
          <v-sheet color="blue-2" class="blue-diversity--text font-weight-600 pa-2" rounded>
            Learn to earn Mission
          </v-sheet>
        </div>
        <!-- PROJECT LOGO AND NAME END  -->

        <!-- DESCRIPTION START -->
        <div class="mt-7 neutral-10--text">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
          standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to
          make a type specimen book. It has survived not only five centuries, but also the leap into electronic
          typesetting, remaining essentially unchanged.
        </div>
        <!-- DESCRIPTION END -->

        <div class="mt-6 row no-gutters">
          <v-img
            class="col-12 col-sm-6 mb-2 mb-sm-0 rounded-lg"
            src="@/assets/images/voting-trending--background.png"
          />
          <div class="col-12 col-sm-6">
            <v-sheet
              class="px-4 py-8 d-flex justify-center align-center ml-0 ml-sm-4 fill-height"
              rounded="lg"
              outlined
            >
              <div>
                <div class="text-center text-h5 font-weight-600">100,000.00 $SB</div>
                <div class="text-center">Total reward</div>
              </div>
            </v-sheet>
          </div>
        </div>

        <div class="mt-6">
          <div class="text-h6 font-weight-bold">Mission setting</div>
          <mission-document-viewer class="mt-4" :document="mock" />
        </div>
      </v-sheet>
    </v-col>
    <v-col cols="12" md="4" class="mb-4 mb-md-0" order="1" order-md="2">
      <v-sheet outlined rounded="lg" style="border: 2px solid var(--v-blue-diversity-base)">
        <div class="blue-diversity white--text py-2 text-center font-weight-600">Mission stats</div>
        <div class="pa-6">
          <div class="d-flex justify-space-between font-18 font-weight-600">
            <span>Total participant</span>
            <span>1,500</span>
          </div>
          <div class="d-flex justify-space-between mt-5 font-18 font-weight-600">
            <span>Total participant</span>
            <span>1,500</span>
          </div>
          <div class="d-flex justify-space-between mt-5 font-18 font-weight-600">
            <span>Total participant</span>
            <span>1,500</span>
          </div>
        </div>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Vue } from 'vue-property-decorator'
import { mock } from './mock'

@Observer
@Component({
  components: {
    'mission-document-viewer': () => import('../mission-detail/mission-document-viewer.vue'),
  },
})
export default class MissionLearnToEarnDetail extends Vue {
  mock = mock
}
</script>

<style scoped></style>
