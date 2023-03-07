<template>
  <div class="mb-4 mt-2">
    <v-combobox
      :value="model"
      @change="onChange"
      :items="items"
      :search-input.sync="search"
      hide-selected
      :append-icon="appendIcon"
      :hint="hint"
      :label="placeholder"
      :rules="rules"
      persistent-hint
      multiple
      small-chips
      outlined
    >
      <template v-slot:no-data>
        <v-list-item v-if="items.length > 0">
          <v-list-item-content>
            <v-list-item-title>
              No results matching "<strong>{{ search }}</strong
              >". Press <kbd>enter</kbd> to create a new one
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
      <template v-slot:selection="data">
        <v-chip
          :key="JSON.stringify(data.item)"
          v-bind="data.attrs"
          :input-value="data.selected"
          :disabled="data.disabled"
          @click:close="data.parent.selectItem(data.item)"
        >
          <span class="text-subtitle-1">{{ data.item }}</span>
        </v-chip>
      </template>
    </v-combobox>
  </div>
</template>

<script lang="ts">
import { EMPTY_ARRAY, NULL } from '@/constants'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

const defaultValue = () => []

@Component
export default class AppAutoComplete extends Vue {
  @Prop({ default: defaultValue }) items!: string[]
  @Prop({ default: defaultValue }) rules!: any[]
  @Prop({ default: defaultValue }) value!: string[]
  @Prop({ default: 'Enter keywords' }) placeholder!: string
  @Prop({ default: null }) limit!: number
  model: string[] = EMPTY_ARRAY
  search = NULL

  mounted() {
    if (this.value && this.value.length) {
      this.model = this.value
    }
  }

  onChange(value: string[]) {
    this.model = value
  }

  @Watch('model')
  onModelUpdate(value: string[]) {
    if (this.limit && value.length > this.limit) {
      this.$nextTick(() => this.model.pop())
    }
    this.$emit('onChange', this.model)
  }

  get hint() {
    return this.limit ? `Maximum of ${this.limit} tags` : 'Press ENTER to input tag, BACKSPACE to delete tag'
  }

  get appendIcon() {
    return this.items.length > 0 ? 'mdi-chevron-down' : ''
  }
}
</script>

<style scoped></style>
