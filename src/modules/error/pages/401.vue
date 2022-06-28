<template>
  <v-container class="fill-height">
    <div class="d-flex justify-center align-center fill-height fill-width text-center">
      <div class="text-center">
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
  </v-container>
</template>

<script lang="ts">
import { RoutePaths } from '@/router'
import { Observer } from 'mobx-vue'
import { Component, Vue } from 'vue-property-decorator'
@Observer
@Component
export default class NotAuthenticated extends Vue {
  goToVotingList() {
    this.$router.replace(RoutePaths.voting_list)
  }
}
</script>

<style scoped lang="scss"></style>
