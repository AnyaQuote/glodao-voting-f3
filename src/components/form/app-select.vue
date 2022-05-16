<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { VSelect } from 'vuetify/lib'
@Component
export default class AppSelect extends VSelect {
  @Prop({ default: true }) flat!: boolean
  @Prop({ default: true }) solo!: boolean
  @Prop({ default: true }) outlined!: boolean
  @Prop({ default: 'auto' }) hideDetails!: boolean
}
</script>

<style lang="scss" scoped></style>
