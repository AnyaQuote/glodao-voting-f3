<template>
    <v-avatar v-bind="$attrs" v-on="$listeners">
        <v-img :src="source" />
    </v-avatar>
</template>

<script lang="ts">
    import { Component, Vue, Prop } from 'vue-property-decorator';

    @Component
    export default class  extends Vue {
        @Prop(String) src!: string
        get source() {
            return this.src
        }
    }
</script>

<style lang="scss" scoped>

</style>