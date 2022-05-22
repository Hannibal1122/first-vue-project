<template>
    <q-layout view="hHh lpR fFf">
        <q-header elevated class="bg-primary text-white">
            <div class="q-gutter-y-md">
                <q-tabs>
                    <template v-if="isLoggedIn">
                        <q-route-tab name="tab0" label="Tasks" to="/task"/>
                        <q-tab name="tab1" label="Logout" @click="logout"/>
                    </template>
                    <template v-else>
                        <q-route-tab name="tab2" label="Registration" to="/registration"/>
                        <q-route-tab name="tab3" label="Login" to="/login"/>
                    </template>
                </q-tabs>
            </div>
        </q-header>

        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>
<script lang="ts">
    import { defineComponent, ref } from 'vue';
    import { API } from '../system/api';

    export default defineComponent({
        setup() {
            const authorizationModel = API.authorization;
            return { authorizationModel }
        },
        computed: {
            isLoggedIn: function() {
                return this["authorizationModel"].isLoggedIn
            }
        },
        methods: {
            async logout () {
                await this.authorizationModel.logout();
                this.$router.push("/login");
            }
        },
    })
</script>
