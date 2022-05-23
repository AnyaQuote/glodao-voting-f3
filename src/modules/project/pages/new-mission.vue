<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12">
        <div class="d-flex align-center justify-start" @click="goBack">
          <v-icon>mdi-arrow-left</v-icon>
          <span class="text-h6 bluePrimary--text cursor-pointer ml-7">Back to project</span>
        </div>
      </v-col>
      <v-col cols="10">
        <v-sheet class="neutral100--bg rounded-lg" outlined>
          <div class="blue lighten-4 py-6 text-center rounded-lg rounded-b-0">
            <span class="text-h5 font-weight-bold text-uppercase">Create mission</span>
          </div>
          <v-divider />
          <v-form class="pa-7">
            <!-- MISSION INFORMATION -->
            <div class="section">
              <div class="title font-weight-bold bluePrimary--text">Mission information</div>
              <span class="label">Mission name</span>
              <app-text-field class="field" placeholder="Enter name of mission" />
              <span class="label">Short description</span>
              <app-text-field class="field" placeholder="Enter short description to describe the mission" />
              <span class="label">Mission cover</span>
              <image-upload-field class="field" />
            </div>
            <!-- REWARD INFORMATION -->
            <div class="d-flex flex-column section">
              <div class="title font-weight-bold bluePrimary--text">Reward information</div>
              <div class="d-flex mb-7">
                <div class="flex-grow-1">
                  <span class="label">Reward Token</span>
                  <app-select class="mr-4" placeholder="Choose token" />
                </div>
                <div class="flex-grow-1">
                  <span class="label">Total reward</span>
                  <app-text-field placeholder="Enter amount" />
                </div>
              </div>
              <div class="d-flex mb-7">
                <div class="flex-grow-1">
                  <span class="label">Priority amount</span>
                  <app-text-field class="mr-4" placeholder="Enter amount" />
                </div>
                <div class="flex-grow-1">
                  <span class="label">Max participant in priority pool</span>
                  <app-text-field placeholder="Enter participants" />
                </div>
              </div>
            </div>
            <!-- MISSION SETTING -->
            <div class="section">
              <div class="title font-weight-bold bluePrimary--text">Mission setting</div>
              <switch-field class="label-field" title="Telegram task" subtitle="Join telegram group" />
              <switch-field class="label-field" title="Twitter task" subtitle="Follow project twitter" />
              <switch-field class="label-field" title="Twitter task" subtitle="Quote a tweet">
                <app-text-field placeholder="Enter your hastag" append-icon="fa-solid fa-hashtag" />
              </switch-field>
              <switch-field class="label-field" title="Twitter task" subtitle="Like and reply a post">
                <app-text-field placeholder="Enter your tweet link" append-icon="mdi-link" />
              </switch-field>
              <switch-field class="label-field" title="Learn to earn" subtitle="Learn document and answer question" />
            </div>

            <v-btn class="linear-blue--bg white--text text-none" height="40" depressed block> Create </v-btn>
          </v-form>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Vue } from 'vue-property-decorator'

@Observer
@Component({
  components: {
    'switch-field': () => import('../components/new-missions-components/new-misstion-switch-field.vue'),
    'image-upload-field': () => import('@/components/image-upload-field.vue'),
  },
})
export default class MissionForm extends Vue {
  goBack() {
    this.$router.go(-1)
  }
}
</script>

<style lang="scss" scoped>
.section {
  margin-bottom: em(28);
  .title {
    font-size: em(18);
    margin-bottom: em(8);
  }
  .label {
    font-weight: 600;
    font-size: em(16);
    margin-bottom: em(16);
  }
  .field {
    margin-bottom: em(28);
  }
  .label-field {
    margin-bottom: em(16);
  }
}
</style>
