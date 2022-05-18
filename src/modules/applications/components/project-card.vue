<template>
  <v-sheet class="rounded-lg" outlined>
    <v-row no-gutters dense align="stretch" style="border-bottom: thin solid var(--v-neutral20-base)">
      <!-- RIGHT -->
      <v-col cols="6" style="border-right: thin solid var(--v-neutral20-base)">
        <v-sheet height="124" class="pa-6 d-flex blue lighten-3 rounded-tl-lg">
          <v-sheet width="76" height="78" class="d-flex justify-center align-center white rounded-lg pa-3 mr-4">
            <img :src="require(`@/assets/icons/${project.logo}`)" width="100%" />
          </v-sheet>
          <v-spacer class="d-flex flex-column justify-center">
            <div class="text-h5 font-weight-bold">{{ project.name }}</div>
            <div class="text-h6 neutral10--text">${{ project.token }}</div>
          </v-spacer>
        </v-sheet>

        <v-divider></v-divider>

        <v-sheet class="pa-6">
          {{ project.description }}
        </v-sheet>

        <v-divider></v-divider>

        <v-sheet class="pa-6">
          <v-sheet class="d-flex">
            <v-sheet class="mr-2">Voting start: </v-sheet>
            <v-sheet class="font-weight-bold">{{ project.start }}</v-sheet>
          </v-sheet>
          <v-sheet class="d-flex">
            <v-sheet class="mr-2">Voting start: </v-sheet>
            <v-sheet class="font-weight-bold">{{ project.end }}</v-sheet>
          </v-sheet>
        </v-sheet>
      </v-col>

      <!-- LEFT -->
      <v-col cols="6" class="d-flex flex-column">
        <v-sheet height="124" class="pa-6">
          <v-sheet class="mb-3 font-weight-bold" style="font-size: 18px">Final result</v-sheet>
          <v-sheet
            height="40"
            class="d-flex justify-center align-center rounded white--text font-weight-600 text-subtitle-1"
            :class="project.status === 'approved' ? 'green lighten-1' : 'redSenamatic'"
          >
            {{ project.status === 'approved' ? 'Your project is approved' : 'Your project is rejected' }}
          </v-sheet>
        </v-sheet>

        <v-divider></v-divider>

        <v-sheet class="spacer pa-6 d-flex flex-column justify-space-between">
          <v-sheet>
            <v-sheet class="d-flex align-baseline mb-2">
              <v-sheet
                height="27"
                width="60"
                class="d-flex justify-center align-center rounded-lg white--text subtitle-2 font-weight-400 mr-3 green lighten-1"
              >
                👍 YES
              </v-sheet>
              <v-sheet class="text-subtitle-1">We want the project to launch </v-sheet>
            </v-sheet>
            <progress-bar :value="(project.yesVote * 100) / project.totalVote" class="mb-2" />
            <v-sheet class="d-flex justify-space-between text-subtitle-2 font-weight-400">
              <v-sheet>{{ project.yesVote }} votes</v-sheet>
              <v-sheet>{{ ((project.yesVote * 100) / project.totalVote) | formatNumber(2, 2) }}%</v-sheet>
            </v-sheet>
          </v-sheet>
          <v-sheet>
            <v-sheet class="d-flex align-baseline mb-2">
              <v-sheet
                height="27"
                width="60"
                class="d-flex justify-center align-center rounded-lg white--text subtitle-2 font-weight-400 mr-3 red"
              >
                👎 NO
              </v-sheet>
              <v-sheet class="text-subtitle-1">We don’t want the project to launch </v-sheet>
            </v-sheet>
            <progress-bar :value="((project.totalVote - project.yesVote) * 100) / project.totalVote" class="mb-2" />
            <v-sheet class="d-flex justify-space-between text-subtitle-2 font-weight-400">
              <v-sheet>{{ project.totalVote - project.yesVote }} votes</v-sheet>
              <v-sheet>
                {{ (((project.totalVote - project.yesVote) * 100) / project.totalVote) | formatNumber(2, 2) }}%
              </v-sheet>
            </v-sheet>
          </v-sheet>
        </v-sheet>
      </v-col>
    </v-row>
    <v-sheet
      height="56"
      class="blue lighten-3 blue--text font-weight-600 text-subtitle-1 d-flex align-center justify-center rounded-b-lg"
    >
      View detail
    </v-sheet>
  </v-sheet>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Observer
@Component
export default class ProjectCard extends Vue {
  @Prop() project: any
}
</script>

<style scoped></style>
