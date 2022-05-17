<template>
  <div>
    <v-carousel height="auto" hide-delimiters>
      <template v-slot:prev="{ on, attrs }">
        <v-sheet
          class="ml-n4 mt-n16 px-2 py-10 d-flex justify-center rounded-lg rounded-l-0 white--background"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon color="black">mdi-chevron-left</v-icon>
        </v-sheet>
      </template>
      <template v-slot:next="{ on, attrs }">
        <v-sheet
          v-bind="attrs"
          v-on="on"
          class="mr-n4 mt-n16 px-2 py-10 d-flex justify-center rounded-lg rounded-r-0 white--background"
        >
          <v-icon color="black">mdi-chevron-right</v-icon>
        </v-sheet>
      </template>
      <v-carousel-item v-for="(prop, i) in data" :key="i">
        <voting-launch-item :props="prop"></voting-launch-item>
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {
    'voting-launch-item': () => import('../components/home/voting-launch-item.vue'),
  },
})
export default class VotingLaunchSection extends Vue {
  data = [
    {
      projectName: 'Hydro Wind Enery',
      shortDescription: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
      upvote: '90',
      downvote: '90',
      detailLink: '',
      readmoreLink: '',
      launchDate: 'JAN 21ST, 2022 AT 10:00 PM ONLY',
    },
    {
      projectName: 'Hydro Wind Enery',
      shortDescription: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
      upvote: '90',
      downvote: '90',
      detailLink: '',
      readmoreLink: '',
      launchDate: 'JAN 21ST, 2022 AT 10:00 PM ONLY',
    },
    {
      projectName: 'Hydro Wind Enery',
      shortDescription: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
      upvote: '90',
      downvote: '90',
      detailLink: '',
      readmoreLink: '',
      launchDate: 'JAN 21ST, 2022 AT 10:00 PM ONLY',
    },
  ]
}
</script>

<style lang="scss" scoped>
.white--background {
  background: white;
}
</style>
