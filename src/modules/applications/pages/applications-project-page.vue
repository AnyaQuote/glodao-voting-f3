<template>
  <v-container>
    <applications-project />
  </v-container>
</template>

<script lang="ts">
import { Component, Provide, Vue } from 'vue-property-decorator'
import { Applications } from '../viewmodels/applications-viewmodel'

@Component({
  components: {
    'applications-project': () => import('../components/application-project.vue'),
  },
})
export default class AppicationsProject extends Vue {
  @Provide() vm = new Applications()

  index = 1

  tab(index: number): void {
    if (this.index !== index) this.index = index
  }
}
</script>

<style lang="scss" scoped>
.padding-form {
  padding: 48px 93.5px;
}
</style>
