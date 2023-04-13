<script setup>

import {onMounted, reactive} from "vue";
import dayjs from "dayjs";
import 'dayjs/locale/en';
import localedata from 'dayjs/plugin/localeData';

dayjs.extend(localedata);
dayjs.locale('en');


const daysOfWeek = [...Array(7).keys()].map(day =>
    dayjs().locale('en').day(day + 1).format('dddd')
);

const form = reactive({
    firstName : "",
    lastName : "",
    ImmatriculationOne : "",
    ImmatriculationTwo : "",
    AuthorizedUntil : "",
    isDisabled : false,
    days : {}
})

const registerVehicule = async () => {
    form.AuthorizedUntil = dayjs(form.AuthorizedUntil).format('YYYY-MM-DD');
    console.log(form);
            const settings = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                first_name: form.firstName,
                last_name: form.lastName,
                license_1: form.ImmatriculationOne,
                license_2: form.ImmatriculationTwo,
                disabled: form.isDisabled,
                days: JSON.stringify(form.days),
                until: form.AuthorizedUntil,
            })
        }
        try {
            const fetchResponse = await fetch("http://localhost:3300/users", settings);
            const data = await fetchResponse.json();
            
        } catch (e) {
            console.log(e);
        }
}

onMounted(async () => {

});
</script>

<template class="text-center">
    <div class="col-8 text-center mx-auto d-flex align-items-center" id="form">
        <main class="form-signin w-100">
            <h1 class="h3 mb-3 fw-normal">Parking registration</h1>
            <form @submit.prevent="registerVehicule()">
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
                            v-model="form.firstName"
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
                            v-model="form.lastName"
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
                            v-model="form.ImmatriculationOne"
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
                            v-model="form.ImmatriculationTwo"
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
                                    v-model="form.AuthorizedUntil"
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
                                v-model="form.isDisabled"
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
                        <el-select v-model="form.days[d]" placeholder="Select" required>
                            <el-option label="Building A" value="a"></el-option>
                            <el-option label="Building B" value="b"></el-option>
                            <el-option label="Building C" value="c"></el-option>
                        </el-select>

                    </div>
                </div>

                <div class="col-4 mx-auto">
                    <button class="w-100 btn btn-lg btn-primary" type="submit" id="register">
                        Register
                    </button>
                </div>
            </form>
        </main>
    </div>
</template>

<style scoped>

h1 {
    margin-bottom: 30px !important;
}
.form-group {
    margin-bottom: 15px;
}

em.required {
    color: var(--bs-danger);
}

#register {
    margin-top: 30px;
}

#form {
    vertical-align: center !important;
}
</style>
