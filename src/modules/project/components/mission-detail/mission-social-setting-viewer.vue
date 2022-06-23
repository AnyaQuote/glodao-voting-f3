<template>
  <div class="d-flex flex-column mt-2">
    <v-sheet class="d-flex align-center pa-5" rounded="lg" outlined>
      <v-img class="d-none d-md-block" src="@/assets/icons/twitter.svg" max-width="24" max-height="24" />
      <span class="mx-3 font-weight-600">Twitter task</span>
      <span class="bullet neutral-10--text">Follow Project twitter</span>
    </v-sheet>

    <v-sheet class="d-flex align-center pa-5 mt-2" rounded="lg" outlined>
      <v-img class="d-none d-md-block" src="@/assets/icons/twitter.svg" max-width="24" max-height="24" />
      <span class="mx-3 font-weight-600">Twitter task</span>
      <span class="bullet neutral-10--text">Follow Project twitter</span>
    </v-sheet>

    <v-sheet class="pa-5 mt-2" rounded="lg" outlined>
      <div class="d-flex align-center">
        <v-img class="d-none d-md-block" src="@/assets/icons/twitter.svg" max-width="24" max-height="24" />
        <span class="mx-3 font-weight-600">Twitter task</span>
        <span class="bullet neutral-10--text">Follow Project twitter</span>
      </div>
      <v-sheet :width="linkWidth" class="mt-2 text-truncate">
        <span class="mr-2">Twitter link:</span>
        <a class="blue-diversity--text text-truncate" href="https://twitter.com/elonmusk/status/1538406040374595585">
          https://twitter.com/elonmusk/status/1538406040374595585
        </a>
      </v-sheet>
    </v-sheet>
    <v-sheet class="d-flex align-center pa-5 mt-2" rounded="lg" outlined>
      <v-img class="d-none d-md-block" src="@/assets/icons/twitter.svg" max-width="24" max-height="24" />
      <span class="mx-3 font-weight-600">Twitter task</span>
      <span class="bullet neutral-10--text">Follow Project twitter</span>
    </v-sheet>
  </div>
</template>

<script lang="ts">
import { Data } from '@/models/MissionModel'
import { Observer } from 'mobx-vue'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Observer
@Component
export default class MissionSocialSettingViewer extends Vue {
  @Prop({ required: true }) data!: Data

  mounted() {
    console.log({ ...this.data })
  }

  get linkWidth() {
    return this.$vuetify.breakpoint.mdAndUp ? '600' : '300'
  }
}
</script>

<style scoped></style>
