<template>
  <div>
    <dao-header class="mb-14"></dao-header>
    <v-container>
      <dao-body></dao-body>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue';
import { Component, Vue } from 'vue-property-decorator'

@Observer
@Component({
  components: {
    'dao-header': () => import('../components/header.vue'),
    'dao-body': () => import('../components/body.vue'),
  },
})
export default class DAOVoting extends Vue {}
</script>

<style scoped></style>
