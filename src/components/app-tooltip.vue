<template>
  <v-tooltip top>
    <template v-slot:activator="{ on, attrs }">
      <v-icon x-small v-bind="attrs" v-on="on" class="hand">mdi-help-circle-outline</v-icon>
    </template>
    <span>{{ text }}</span>
  </v-tooltip>
</template>

<script>
export default {
  props: {
    text: String,
  },
}
</script>

<style scoped lang="scss">
.hand::before {
  cursor: pointer;
}
</style>
