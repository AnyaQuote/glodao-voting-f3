<template>
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
                @click.stop="openNewProject"
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
                @click.stop="openNewProject"
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
            1231232
            <v-col cols="6">
              <v-sheet
                class="neutral100--bg rounded-lg fill-height d-flex justify-center align-center cursor-pointer"
                @click.stop="openNewProject"
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
</template>

<script lang="ts">
import { AppProvider } from '@/app-providers'
import { Component, Vue, Inject } from 'vue-property-decorator'

@Component({
  components: {
    'regist-card': () => import('../components/regist-card.vue'),
  },
})
export default class ProjectList extends Vue {
  @Inject() providers!: AppProvider

  openNewProject() {
    this.providers.router.push({ name: 'new-project' })
  }
}
</script>

<style scoped></style>
