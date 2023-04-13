<script setup>

import {ref, onMounted, reactive} from "vue";
import dayjs from "dayjs";
import 'dayjs/locale/en';
import localedata from 'dayjs/plugin/localeData';
import router from "@/router";

dayjs.extend(localedata);
dayjs.locale('en');

const daysOfWeek = [...Array(7).keys()].map(day =>
    dayjs().locale('en').day(day + 1).format('dddd')
);

let users = reactive([]);
let jsonUser = reactive({
    firstName : "",
    lastName : "",
    ImmatriculationOne : "",
    ImmatriculationTwo : "",
    AuthorizedUntil : "",
    isDisabled : false,
    days : {}
});

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
        } catch (error) {
            console.log(error);
        }
    }
}

const getUser = async (id) => {
    page = ref(1);
    try {
        const fetchResponse = await fetch(`http://localhost:3300/user/${id}`, settingsGet);
        const data = await fetchResponse.json();

        jsonUser.id = data.id;
        jsonUser.firstName =  data.first_name;
        jsonUser.lastName =  data.last_name;
        jsonUser.ImmatriculationOne =  data.license_1;
        jsonUser.ImmatriculationTwo =  data.license_2;
        jsonUser.AuthorizedUntil =  data.until;
        jsonUser.days =  data._days;

        if(data.is_disabled == 1) {
            jsonUser.isDisabled =  true;
        } else {
            jsonUser.isDisabled =  false;
        }
    } catch (error) {
        console.log(error);
    }
}

const submitModif = async (id) => {
    const settings = {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
                first_name : jsonUser.firstName,
                last_name : jsonUser.lastName,
                license_1 : jsonUser.ImmatriculationOne,
                license_2 : jsonUser.ImmatriculationTwo,
                disabled : jsonUser.isDisabled,
                days : JSON.stringify(jsonUser.days),
                until : dayjs(jsonUser.AuthorizedUntil).format('YYYY-MM-DD')
            }
        )
    }
    try {
        await fetch(`http://localhost:3300/user/${id}`, settings);
        await location.reload();
    } catch (e) {
        console.log(e);
    }
}

const deleteUser = async (id) => {
    const settings = {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    }
    try {
        await fetch(`http://localhost:3300/user/${id}`, settings);
        await location.reload();
    } catch (e) {
        console.log(e);
    }
}

onMounted(async () => {
    page = ref(1);
    total = ref(0);
    try {
        const fetchResponse = await fetch(`http://localhost:3300/users/total`, settingsGet);
        const data = await fetchResponse.json();
        total.value = data.total
    } catch (error) {
        console.log(error);
    }

    try {
        const fetchResponse = await fetch(`http://localhost:3300/users`, settingsGet);
        const data = await fetchResponse.json();
        users.splice(0);
        data.users.forEach(el => {
            users.push(el)
        })

    } catch (error) {
        console.log(error);
    }
});


</script>

<template>
    <div class="container">
        <div class="row">
            <nav class="navbab">
            <div class="container">
                <div class="row">
                    <div class="col">
                        <form class="" role="search">
                            <h5>Seach by First Name</h5>
                            <input class="form-control" type="search" placeholder="Search" aria-label="Search">
                        </form>
                    </div>
                    <div class="col">
                        <form class="" role="search">
                            <h5>Seach by Last Name</h5>
                            <input class="form-control" type="search" placeholder="Search" aria-label="Search">
                        </form>
                    </div>
                    <div class="col">
                    <form class="" role="search">
                        <h5>Seach by License</h5>
                        <input class="form-control" type="search" placeholder="Search" aria-label="Search">
                    </form>
                </div>
                </div>
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
                            <td>{{ user.first_name }}</td>
                            <td>{{ user.last_name }}</td>
                            <td v-if="user.is_disabled == 1">Yes</td>
                            <td v-else>No</td>
                            <td>{{ dayjs(user.until).format('DD/MM/YYYY') }}</td>
                            <td>
                                <button @click="getUser(user.id)" type="button" class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#editUserModal">Modify</button>
                                <button @click="getUser(user.id)" type="button" class="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#deleteUserModal">Delete</button>
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
    <div class="modal fade" id="editUserModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="editUserModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="editUserModalLabel">Update User</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="submitModif(jsonUser.id)">
                        <div class="form-group row">
                            <label for="firstname" class="col-4 mx-auto col-form-label"
                            >First name<em class="required">*</em></label
                            >
                            <div class="col-4 mx-auto">
                                <input
                                    id="firstname"
                                    name="firstname"
                                    placeholder="Doe"
                                    type="text"
                                    required="required"
                                    class="form-control"
                                    v-model="jsonUser.firstName"
                                />
                            </div>
                        </div>

                        <div class="form-group row">
                            <label for="lastname" class="col-4 mx-auto col-form-label"
                            >Last name<em class="required">*</em></label
                            >
                            <div class="col-4 mx-auto">
                                <input
                                    id="lastname"
                                    name="lastname"
                                    placeholder="Jane"
                                    type="text"
                                    class="form-control"
                                    required="required"
                                    v-model="jsonUser.lastName"
                                />
                            </div>
                        </div>

                        <div class="form-group row">
                            <label for="immatriculationone" class="col-4 mx-auto col-form-label"
                            >First immatriculation<em class="required">*</em></label
                            >
                            <div class="col-4 mx-auto">
                                <input
                                    id="immatriculationone"
                                    name="immatriculationone"
                                    placeholder="AA123BB"
                                    type="text"
                                    class="form-control"
                                    required="required"
                                    v-model="jsonUser.ImmatriculationOne"
                                />
                            </div>
                        </div>

                        <div class="form-group row">
                            <label for="immatriculationtwo" class="col-4 mx-auto col-form-label"
                            >Second Immatriculation</label
                            >
                            <div class="col-4 mx-auto">
                                <input
                                    id="immatriculationtwo"
                                    name="immatriculationtwo"
                                    placeholder="AA123BB"
                                    type="text"
                                    class="form-control"
                                    v-model="jsonUser.ImmatriculationTwo"
                                />
                            </div>
                        </div>

                        <div class="form-group row">
                            <label for="AuthorizedUntil" class="col-4 mx-auto col-form-label"
                            >Authorized until<em class="required">*</em></label
                            >
                            <div class="col-4 mx-auto">
                                <div class="demo-date-picker">
                                    <div class="block">
                                        <el-date-picker
                                            v-model="jsonUser.AuthorizedUntil"
                                            type="date"
                                            placeholder="Pick a day"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="form-group row">
                            <label class="col-4 mx-auto"
                            >Disabled<em class="required">*</em></label
                            >
                            <div class="col-4 mx-auto">
                                <el-form-item>
                                    <el-switch
                                        v-model="jsonUser.isDisabled"
                                        size="large"
                                        active-text="Oui"
                                        inactive-text="Non"
                                        style="
                  --el-switch-on-color: var(--bs-primary);
                  --el-switch-off-color: var(--bs-gray-400);
                "
                                    />
                                </el-form-item>
                            </div>
                        </div>

                        <div class="form-group row">
                            <div class="col" v-for="(d, index) in daysOfWeek" :key="index">
                                <p>{{ d }}<em class="required">*</em></p>
                                <el-select v-model="jsonUser.days[d]" placeholder="Select" required>
                                    <el-option label="Building A" value="a"></el-option>
                                    <el-option label="Building B" value="b"></el-option>
                                    <el-option label="Building C" value="c"></el-option>
                                </el-select>

                            </div>
                        </div>

                        <div class="modal-footer">
                            <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
                            <button type="submit" class="btn btn-primary" data-bs-dismiss="modal">Save</button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    </div>

    <div class="modal fade" id="deleteUserModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="deleteUserModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="editUserModalLabel">Delete User</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p>Are you sure to delete toto ?</p>
                </div>
                <div class="modal-footer d-flex justify-content-center">
                    <button class="btn btn-danger" data-bs-dismiss="modal">Non</button>
                    <button @click="deleteUser(jsonUser.id)" class="btn btn-success" data-bs-dismiss="modal">Oui</button>
                </div>
            </div>
        </div>
    </div>

</template>

<style scoped>
button {
    margin: 0px 5px;
}

button.btn-danger,
button.btn-success{
    color: #ffffff;
}

div.form-group,
div.row {
    margin: 10px 0px;
}
</style>
