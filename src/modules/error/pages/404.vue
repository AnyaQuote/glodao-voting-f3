<template>
  <v-container class="fill-height">
    <div class="d-flex justify-center align-center fill-height fill-width text-center">
      <div class="text-center">
        <div class="text-h1">404</div>
        <div class="primary--text font-weight-bold text-h6 mt-2">We can't find that page</div>
        <div
          :class="{
            'w-50': $vuetify.breakpoint.mdAndUp,
          }"
          class="mx-auto mt-2"
        >
          We are fairly sure that page used to be here, but seem to have gone missing. We do apologise on it's behalf
        </div>
        <v-btn class="linear-blue--bg white--text mt-6" depressed @click="goToVotingList"> Voting page </v-btn>
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
export default class NotFound extends Vue {
  goToVotingList() {
    this.$router.replace(RoutePaths.voting_list)
  }
}
</script>

<style scoped lang="scss"></style>
