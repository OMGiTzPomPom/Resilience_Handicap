<script setup>
import Footer from "./Footer.vue";

</script>

<template>
    <div class="container-fluid">
        <div class="row">
                <router-view></router-view>
            <Footer/>
        </div>
    </div>
</template>

<style>
main {
    padding-bottom: 100px;
}
</style>