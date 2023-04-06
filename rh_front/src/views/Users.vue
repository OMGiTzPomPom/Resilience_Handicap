<script setup>

import {onMounted} from "vue";

onMounted(async () => {
   let page = 1
            const settings = {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            }
        try {
            const fetchResponse = await fetch("http://localhost:3300/users?page=page", settings);
            const data = await fetchResponse.json();
            # data = {"users":[], "page": 1}
            console.log(data)
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
                    <th scope="col">Until </th>
                    <th scope="col" colspan="2">Actions </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <th scope="row">1</th>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>12/12/2023</td>
                    <td><button type="button" class="btn btn-warning">Modify</button><button type="button" class="btn btn-danger">Delete</button></td>
                    </tr>
                    <tr>
                    <th scope="row">2</th>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>12/12/2023</td>
                     <td><button type="button" class="btn btn-warning">Modify</button><button type="button" class="btn btn-danger">Delete</button></td>
                    </tr>
                    <tr>
                    <th scope="row">3</th>
                    <td>Larry</td>
                    <td>Books</td>
                    <td>12/12/2023</td>
                    <td colspan="2"><button type="button" class="btn btn-warning">Modify</button><button type="button" class="btn btn-danger">Delete</button></td>
                    </tr>
                </tbody>
    </table>
</template>

<style scoped>

</style>
