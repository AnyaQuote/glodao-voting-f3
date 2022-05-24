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
            <mission-info-form />
            <!-- REWARD INFORMATION -->
            <reward-info-form />
            <!-- MISSION SETTING -->
            <mission-setting-form />
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
    'mission-info-form': () => import('../components/new-mission/mission-info-form.vue'),
    'reward-info-form': () => import('../components/new-mission/reward-info-form.vue'),
    'mission-setting-form': () => import('../components/new-mission/mission-setting-form.vue'),
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
