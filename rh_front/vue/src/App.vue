<script setup>
import {RouterView} from 'vue-router'
</script>

<template>
        <RouterView />
</template>

<style>

html {
    --el-color-primary: var(--bs-primary) !important;
    --el-color-success: var(--bs-success) !important;
    --el-color-warning: var(--bs-warning) !important;
    --el-color-danger: var(--bs-danger) !important;
    --el-color-error: var(--bs-yellow) !important;
}

</style>
