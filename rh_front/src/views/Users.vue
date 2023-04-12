<script setup>

import {ref, onMounted, reactive} from "vue";
import dayjs from "dayjs";

import ViewUserModal from "@/components/modals/ViewUserModal.vue";

let users = reactive([]);

const formSearch = reactive({
    data : "",
    isDisabled : false,
})

let page = ref(1);
let total = ref(0);
const settingsGet = {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    }

onMounted(async () => {
    page = ref(1);
    total = ref(0);
    try {
        const fetchResponse = await fetch(`http://localhost:3300/users/total/?search=${formSearch.data}`, settingsGet);
        const data = await fetchResponse.json();
        total.value = data.total
    } catch (error) {
        console.log(error);
    }

    try {
        const fetchResponse = await fetch(`http://localhost:3300/users?search=${formSearch.data}&page=${page.value}`, settingsGet);
        const data = await fetchResponse.json();
        users.splice(0);
        data.users.forEach(el => {
            users.push(el)
        })

    } catch (error) {
        console.log(error);
    }

});

const search = async (e) => {
    page = ref(1);
    try {
        const fetchResponse = await fetch(`http://localhost:3300/users/total/?search=${formSearch.data}`, settingsGet);
        const data = await fetchResponse.json();
        
        total.value = data.total
    } catch (error) {
        console.log(error);
    }
    try {
        const fetchResponse = await fetch(`http://localhost:3300/users/?search=${formSearch.data}&page=${page.value}`, settingsGet);
        const data = await fetchResponse.json();
        users.splice(0);
        page = ref(1);
        return data.users.forEach(el => {
            users.push(el)
        })
    } catch (error) {
        console.log(error);
    }

}


const previous = async (e) => {
    if(page.value > 1){
        page.value -= 1
        try {
        const fetchResponse = await fetch(`http://localhost:3300/users/?search=${formSearch.data}&page=${page.value}`, settingsGet);
        const data = await fetchResponse.json();
        users.splice(0);
        data.users.forEach(el => {
            users.push(el)
        })
        // you need to fix that to render immediately !
        console.log(users);
    } catch (error) {
        console.log(error);
    }
    }
}

const next = async (e) => {
    if(page.value < (total.value / 3)){
        page.value += 1
        try {
        const fetchResponse = await fetch(`http://localhost:3300/users/?search=${formSearch.data}&page=${page.value}`, settingsGet);
        const data = await fetchResponse.json();
          users.splice(0);
          data.users.forEach(el => {
            users.push(el)
        })
        // you need to fix that to render immediately !
        console.log(users);
    } catch (error) {
        console.log(error);
    }
    }
}
</script>

<template>
    <div class="container">
        <div class="row">
            <nav class="navbab">
            <div class="container">
                <form class="" role="search">
                     <input @input.prevent="search" v-model="formSearch.data" class="form-control" type="search" placeholder="Search" aria-label="Search">
                </form>
            </div>
            </nav>
        </div>
        <div class="row">
            <div class="col mx-auto">
                <table class="table table-responsive table-striped mx-auto">
                    <thead>
                        <tr>
                            <th scope="col" class="">First name</th>
                            <th scope="col" class="">Last name</th>
                            <th scope="col" class="">Is disabled ?</th>
                            <th scope="col" class="">Until </th>
                            <th scope="col" class="" colspan="2">Actions </th>
                         </tr>
                    </thead>
                    <tbody v-for="user in users" :key="user.id">
                        <tr>
                            <td data-bs-toggle="modal" data-bs-target="#viewUserModal">{{ user.first_name }}</td>
                            <td data-bs-toggle="modal" data-bs-target="#viewUserModal">{{ user.last_name }}</td>
                            <td data-bs-toggle="modal" data-bs-target="#viewUserModal" v-if="user.is_disabled == 1">Yes</td>
                            <td data-bs-toggle="modal" data-bs-target="#viewUserModal" v-else>No</td>
                            <td data-bs-toggle="modal" data-bs-target="#viewUserModal">{{ dayjs(user.until).format('DD/MM/YYYY') }}</td>
                            <td>
                                <button type="button" class="btn btn-warning btn-sm">Modify</button>
                                <button type="button" class="btn btn-danger btn-sm">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="row">
            Page: {{ page }} of {{ (Math.round(total / 3) === 0) ? 1 : Math.round(total / 3)  }}
        </div>
        <div class="row">
            <div class="col">
                <button @click="previous" type="button" class="btn btn-sm">previous</button>
                <button @click="next" type="button" class="btn btn-sm">next</button>
            </div>

        </div>
    </div>

    <!--Modals-->

    <ViewUserModal/>
</template>

<style scoped>
button {
    margin: 0px 5px;
}
</style>
