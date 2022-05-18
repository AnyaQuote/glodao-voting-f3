<template>
  <div>
    <div class="background-header" style="height: 330px">
      <v-container class="fill-height d-flex flex-column justify-center text-center">
        <div class="primary-text font-weight-bold mb-2">Apply your project</div>
        <div class="neutral10--text text-h6 font-weight-400">
          Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim
          velit mollit. Exercitation veniam consequat sunt nostrud amet.
        </div>
      </v-container>
    </div>
  </div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue';
import { Component, Vue } from 'vue-property-decorator'

@Observer
@Component
export default class extends Vue {}
</script>

<style lang="scss" scoped>
.primary-text {
  font-size: 64px;
}

.background-header {
  background-image: url('~@/assets/images/dao-voting-background.png') !important;
  background-size: cover;
}
</style>
