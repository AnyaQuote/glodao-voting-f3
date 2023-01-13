<template>
  <v-container class="fill-height">
    <v-row>
      <v-col>
        <app-editor :controller="controller" />
      </v-col>
      <!-- <div class="text-center">
        <div class="text-h1">401</div>
        <div class="primary--text font-weight-bold text-h6 mt-2">You are not authenticated to enter this page</div>
        <div class="mx-auto mt-2">
          Look likes you are trying to enter a page that requires login. Please log in with twitter to continue.
        </div>
        <v-btn class="mt-6 linear-blue--bg white--text text-none" height="45" @click="goToVotingList" depressed>
          Return to voting page
        </v-btn>
      </div>
    </div>
    <div> -->
      <v-col>123{{ controller.content }}</v-col>
      <div><strong>Test</strong></div>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { AppEditorController } from '@/components/editor/app-editor.controller'
import { RoutePaths } from '@/router'
import { Observer } from 'mobx-vue'
import { Component, Vue } from 'vue-property-decorator'

@Observer
@Component({
  components: {
    'app-editor': () => import('@/components/editor/app-editor.component.vue'),
  },
})
export default class NotAuthenticated extends Vue {
  controller = new AppEditorController()

  goToVotingList() {
    this.$router.replace(RoutePaths.voting_list)
  }
}
</script>

<style scoped lang="scss"></style>
