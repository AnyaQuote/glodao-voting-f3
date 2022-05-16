<template>
  <div>
    <v-tabs>
      <v-tab>All</v-tab>
      <v-tab>Bounty project</v-tab>
      <v-tab>Launchpad project</v-tab>
      <v-tab-item>
        <div class="row pa-6">
          <div class="col-3">
            <v-select :items="['rejected', 'upcoming']" label="status"></v-select>
          </div>
          <div class="col-12">
            <v-row>
              <v-col cols="6" v-for="i in [1, 2, 3, 4, 5]" :key="i">
                <regist-card />
              </v-col>
              <v-col cols="6">
                <v-sheet
                  class="neutral100--bg rounded-lg fill-height d-flex justify-center align-center cursor-pointer"
                  v-ripple
                  outlined
                >
                  <v-icon color="bluePrimary">mdi-plus</v-icon>
                  <span class="font-weight-bold bluePrimary--text">New Application</span>
                </v-sheet>
              </v-col>
            </v-row>
          </div>
        </div>
      </v-tab-item>
      <v-tab-item>
        <div class="row pa-6">
          <div class="col-3">
            <v-select :items="['rejected', 'upcoming']" label="status"></v-select>
          </div>
          <div class="col-12">
            <v-row>
              <v-col cols="6" v-for="i in [1, 2, 3, 4, 5]" :key="i">
                <regist-card />
              </v-col>
              <v-col cols="6">
                <v-sheet
                  class="neutral100--bg rounded-lg fill-height d-flex justify-center align-center cursor-pointer"
                  v-ripple
                  outlined
                >
                  <v-icon color="bluePrimary">mdi-plus</v-icon>
                  <span class="font-weight-bold bluePrimary--text">New Application</span>
                </v-sheet>
              </v-col>
            </v-row>
          </div>
        </div>
      </v-tab-item>
      <v-tab-item>
        <div class="row pa-6">
          <div class="col-3">
            <v-select :items="['rejected', 'upcoming']" label="status"></v-select>
          </div>
          <div class="col-12">
            <v-row>
              <v-col cols="6" v-for="i in [1, 2, 3, 4, 5]" :key="i">
                <regist-card />
              </v-col>
              <v-col cols="6">
                <v-sheet
                  class="neutral100--bg rounded-lg fill-height d-flex justify-center align-center cursor-pointer"
                  v-ripple
                  outlined
                >
                  <v-icon color="bluePrimary">mdi-plus</v-icon>
                  <span class="font-weight-bold bluePrimary--text">New Application</span>
                </v-sheet>
              </v-col>
            </v-row>
          </div>
        </div>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {
    'regist-card': () => import('../components/regist-card.vue'),
  },
})
export default class RegistHome extends Vue {}
</script>

<style scoped></style>
