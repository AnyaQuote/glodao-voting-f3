<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import { VTextField } from 'vuetify/lib'

@Component
export default class AppTextField extends VTextField {
  @Prop({ default: true }) solo!: boolean
  @Prop({ default: true }) flat!: boolean
  @Prop({ default: true }) outlined!: boolean
  @Prop({ default: false }) hideDetails!: boolean
  @Prop({ default: true }) dense!: boolean
}
</script>

<style lang="scss" scoped></style>
