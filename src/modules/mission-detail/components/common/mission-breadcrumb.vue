<template>
  <div class="mb-10 mt-4">
    <div class="d-flex align-center font-weight-medium">
      <template v-for="(crumb, index) in data">
        <span
          v-if="crumb.active"
          class="blue-diversity--text mr-5 cursor-pointer text-truncate"
          @click="crumb.onCallback"
          :key="index"
        >
          {{ crumb.name }}
        </span>
        <span v-else :key="index" class="neutral10--text text-truncate">
          {{ crumb.name }}
        </span>
        <v-icon v-if="crumb.active" :key="index" class="mr-5" size="22">mdi-chevron-right</v-icon>
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
}
</script>

<style scoped></style>
