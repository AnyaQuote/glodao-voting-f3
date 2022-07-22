<template>
  <div class="mb-10 mt-4">
    <div class="d-flex align-center font-weight-medium">
      <template v-for="(crumb, index) in data">
        <div
          :key="index"
          v-if="!crumb.divider"
          class="text-truncate"
          :class="{ 'blue-diversity--text cursor-pointer ': crumb.active, 'neutral10--text': !crumb.active }"
          @click="crumb.active ? crumb.onCallback() : null"
        >
          {{ crumb.name }}
        </div>
        <v-icon v-else :key="index" class="mx-2 mx-sm-5" size="22">mdi-chevron-right</v-icon>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Prop, Vue } from 'vue-property-decorator'

const defaultProp = () => ({})

@Observer
@Component
export default class MissionBreadcrumb extends Vue {
  @Prop({ default: defaultProp }) data!: Breadcrumb[]
}

interface Breadcrumb {
  name?: string
  onCallback?: () => void
  active?: boolean
  divider?: boolean
}
</script>

<style scoped></style>
