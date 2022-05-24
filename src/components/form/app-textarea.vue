<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import { VTextarea } from 'vuetify/lib'

@Component
export default class AppTextArea extends VTextarea {
  @Prop({ default: true }) solo!: boolean
  @Prop({ default: true }) flat!: boolean
  @Prop({ default: true }) outlined!: boolean
  @Prop({ default: true }) autoGrow!: boolean
  @Prop({ default: '3' }) row!: string
  @Prop({ default: 'auto' }) hideDetails!: string
}
</script>

<style lang="scss" scoped></style>
