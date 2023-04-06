<script setup>

import {onMounted, reactive} from "vue";

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
            users = data.users
            console.log(users)
            } catch (error) {
            console.log(error);
        }
});
</script>

<template class="text-center">
    <table class="table table-striped">
          <thead>
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">First name</th>
                    <th scope="col">Last name</th>
                    <th scope="col">Is disabled ?</th>
                    <th scope="col">Until </th>
                    <th scope="col" colspan="2">Actions </th>
                    </tr>
                </thead>
                <tbody v-for="user in users" :key="user.id">
                    <tr>
                    <th scope="row">{{ user.id }}</th>
                    <td>{{ user.first_name }}</td>
                    <td>{{ user.last_name }}</td>
                    <td>{{ user.is_disabled }}</td>
                    <td>{{ user.until }}</td>
                    <td><button type="button" class="btn btn-warning">Modify</button><button type="button" class="btn btn-danger">Delete</button></td>
                    </tr>
                </tbody>
    </table>
</template>

<style scoped>

</style>
