<script setup>

import {onMounted, reactive} from "vue";
import dayjs from "dayjs";

let users = reactive([]);

onMounted(async () => {
    const settings = {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    }
    try {
        const fetchResponse = await fetch("http://localhost:3300/users?page=1", settings);
        const data = await fetchResponse.json();

        console.log(data)

        data.users.forEach(el => {
            users.push(el)
        })

        //users = data.users
        //console.log(users)
    } catch (error) {
        console.log(error);
    }
});
</script>

<template>
    <div class="container">
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
                            <td>{{ user.first_name }}</td>
                            <td>{{ user.last_name }}</td>
                            <td v-if="user.is_disabled == 1">Yes</td>
                            <td v-else>No</td>
                            <td>{{ dayjs(user.until).format('DD/MM/YYYY') }}</td>
                            <td>
                                <button type="button" class="btn btn-warning btn-sm">Modify</button>
                                <button type="button" class="btn btn-danger btn-sm">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<style scoped>
button {
    margin: 0px 5px;
}
</style>
