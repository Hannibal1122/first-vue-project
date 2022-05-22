<template>
    <div class="q-pa-md">
        <q-card class="my-card absolute-center" style = "width: 400px; padding: 20px;">
            <q-card-section>
                <q-input v-model="user.login" label="Login"/>
                <q-input v-model="user.password" :type="isPwd ? 'password' : 'text'" label="Password">
                    <template v-slot:append>
                        <q-icon
                            :name="isPwd ? 'visibility_off' : 'visibility'"
                            class="cursor-pointer"
                            @click="isPwd = !isPwd"/>
                    </template>
                </q-input>
                <q-btn color="primary float-right" label="Login" style = "margin-top: 20px" @click="login()"/>
            </q-card-section>
        </q-card>
    </div>
    <q-dialog
        v-model="loginError.isOpen">
            <q-card style="width: 300px">
                <q-card-section>
                    <div class="text-h6" style = "font-size: 1em; text-align: center;">{{ loginError.message }}</div>
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
        name: 'LoginPage',
        components: { },
        data() {
            return {
                user: {
                    login: "",
                    password: "",
                },
                isPwd: true,
                loginError: {
                    message: "",
                    isOpen: false
                }
            }
        },
        setup() {
            const authorizationModel = API.authorization;
            return { authorizationModel }
        },
        methods: {
            async login()
            {
                try
                {
                    await this.authorizationModel.authorization(this.user.login, this.user.password);
                    this.$router.push("/task");
                }
                catch(e: any)
                {
                    this.loginError.isOpen = true;
                    this.loginError.message = e.message;
                }
            }
        }
        /* computed: {
            isLoggedIn: function() {
                return this["authorizationModel"].isLoggedIn
            }
        } */
    });
</script>
