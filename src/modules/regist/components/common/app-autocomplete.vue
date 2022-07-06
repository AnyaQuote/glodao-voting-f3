<template>
  <div class="mb-4 mt-2">
    <v-combobox
      :value="model"
      @change="onChange"
      :items="items"
      :search-input.sync="search"
      hide-selected
      :hint="config.hint"
      :label="config.placeholder"
      multiple
      persistent-hint
      small-chips
      outlined
    >
      <template v-slot:no-data>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              No results matching "<strong>{{ search }}</strong
              >". Press <kbd>enter</kbd> to create a new one
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-combobox>
  </div>
</template>

<script lang="ts">
import { EMPTY_ARRAY, NULL } from '@/constants'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

const defaultItems = () => ['NFT', 'Finance', 'Gaming']
const defaultValue = () => []

@Component
export default class AppAutoComplete extends Vue {
  @Prop({ default: defaultItems }) items!: string[]
  @Prop({ default: defaultValue }) value!: string[]
  readonly config = {
    hint: 'Maximum of 5 tags',
    placeholder: 'Enter keywords describe your project',
  }
  model: string[] = EMPTY_ARRAY
  search = NULL

  mounted() {
    if (this.value && this.value.length) {
      this.model = this.value
    }
  }

  onChange(value) {
    this.model = value
  }

  @Watch('model')
  onModelUpdate(value) {
    if (value.length > 5) {
      this.$nextTick(() => this.model.pop())
    }
    this.$emit('onChange', this.model)
  }
}
</script>

<style scoped></style>
