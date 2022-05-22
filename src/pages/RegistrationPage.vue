<template>
    <div class="q-pa-md">
        <q-card class="my-card absolute-center" style = "width: 400px; padding: 20px;">
            <q-card-section>
                <q-input v-model="user.login" label="Login" />
                <q-input v-model="user.password" label="Password" />
                <q-btn color="primary float-right" label="Registration" style = "margin-top: 20px" @click="registration()"/>
            </q-card-section>
        </q-card>
    </div>
    <q-dialog
      v-model="registrationError.isOpen">
        <q-card style="width: 300px">
            <q-card-section>
                <div class="text-h6" style = "font-size: 1em; text-align: center;">{{ registrationError.message }}</div>
            </q-card-section>

            <q-card-actions align="right" class="bg-white text-teal">
                <q-btn flat label="OK" v-close-popup />
            </q-card-actions>
        </q-card>
    </q-dialog>

</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue';
    import { API } from '../system/api';

    export default defineComponent({
        name: 'RegistrationPage',
        data() {
            return {
                registrationError: {
                    message: "",
                    isOpen: false
                }
            }
        },
        setup() {
            const user = ref({
                login: "",
                password: ""
            });
            const registrationModel = API.registration;
            return { registrationModel, user }
        },
        methods: {
            async registration()
            {
                try {
                    await this.registrationModel.registration(
                        this.user.login,
                        this.user.password
                    );
                    this.user.login = "";
                    this.user.password = "";
                }
                catch(e: any)
                {
                    this.registrationError.isOpen = true;
                    this.registrationError.message = e.message;
                }
            }
        }
    });
</script>
