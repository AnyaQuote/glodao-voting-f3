<template>
  <div class="red--text">
    stake
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
import { Observer } from "mobx-vue"

@Observer
@Component({
  components: {}
})
export default class Stake extends Vue {}
</script>
