<template>
  <v-container class="fill-height fill-width">
    <div class="flex-center-box fill-height fill-width text-center" style="height: 100%">
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
        <v-btn class="linear-background-blue-main white--text mt-6" depressed @click="goToBountyPage()">
          Bounty Page
        </v-btn>
      </div>
    </div>
  </v-container>
</template>

<script>
import { Observer } from 'mobx-vue'
import { Component, Vue } from 'vue-property-decorator'
@Observer
@Component({})
export default class HuntingHistory extends Vue {
  goToBountyPage() {
    this.$router.push('/bounty').catch(() => {
      //
    })
  }
}
</script>

<style scoped lang="scss">
.w-50 {
  width: 60%;
}
</style>
