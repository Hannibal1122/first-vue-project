<template>
    <div class="q-pa-md">
        <div class="row justify-center">
            <div class="col-12 col-md-1"></div>
            <div class="col-12 col-md-2" style="margin-bottom: 10px;">
                 <q-date
                    v-model="date"
                    :events="events"
                    @update:model-value="getTaskByDate()"
                    style = "margin-left: calc((100% - 290px) / 2);"/>
            </div>
            <div class="col-12 col-md-7">
                <q-form
                    @submit="onSubmit"
                    class="q-gutter-md">
                    <q-input v-model="newTaskForm.description" label="Description" style = "max-width: 300px"/>
                    <q-input v-model="newTaskForm.date" mask="date" :rules="['date']" style = "max-width: 300px">
                        <template v-slot:append>
                            <q-icon name="event" class="cursor-pointer">
                                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                    <q-date v-model="newTaskForm.date">
                                        <div class="row items-center justify-end">
                                            <q-btn v-close-popup label="Close" color="primary" flat/>
                                        </div>
                                    </q-date>
                                </q-popup-proxy>
                            </q-icon>
                        </template>
                    </q-input>
                    <q-input v-model="newTaskForm.text" label="Text"/>
                    <div class="row justify-end">
                        <q-btn label="Append new task" type="submit" color="primary"/>
                    </div>
                </q-form>

                <h6 style="margin: 10px;">Tasks</h6>
                <q-list v-for="task in sortTasks" :key="task.id">
                    <q-item tag="label" v-ripple>
                        <q-item-section avatar>
                            <q-checkbox v-model="task.isDone" @update:model-value="updateTask(task)"/>
                        </q-item-section>
                        <q-item-section>
                            <div class="row items-center justify-between">
                                <q-item-label>{{ task.description }}</q-item-label>
                                <q-btn round icon="remove" color = "negative" @click="removeTask(task)" size = "xs"></q-btn>
                            </div>
                            <q-item-label caption>{{ task.text }}</q-item-label>
                        </q-item-section>
                    </q-item>
                </q-list>
                <div v-if = "!tasks.length">Append new task! Common!</div>
            </div>
            <div class="col-12 col-md-1"></div>
        </div>
        
    </div>
</template>
<script lang="ts">
    import { defineComponent, ref } from 'vue';
    import { date } from 'quasar';
    import { API, Task } from '../system/api';

    export default defineComponent({
        setup() {
            const taskModel = API.tasks;
            /** Список задач на сегодня */
            let tasks = ref<Task[]>([]);
            /** Список дней, в которых есть задачи */
            let events = ref([]);

            const currentDate = new Date().getTime();
            const currentDateString = date.formatDate(currentDate, "YYYY/MM/DD");
            let currentDateRef = ref(currentDateString);

            /** Значения формы для новой задачи */
            const newTaskForm = ref({
                description: "",
                text: "",
                date: currentDateString
            })

            return {
                date: currentDateRef,
                tasks,
                taskModel,
                events: events,
                newTaskForm
            }
        },
        methods: {
            async getTaskByDate()
            {
                this.tasks = await this.taskModel.getTaskByDate(new Date(this.date).getTime());
            },
            async getEventsForAll()
            {
                const data = await this.taskModel.getEventsForAll()
                this.events = data.map(
                    eventDate => date.formatDate(eventDate, "YYYY/MM/DD")
                );
            },
            async onSubmit()
            {
                await this.taskModel.newTask(
                    this.newTaskForm.description,
                    this.newTaskForm.text,
                    new Date(this.newTaskForm.date).getTime()
                );
                this.newTaskForm.text = "";
                this.newTaskForm.description = "";

                await this.getTaskByDate();
                await this.getEventsForAll();
            },
            async updateTask(task: Task)
            {
                await this.taskModel.updateTask(task.id, task.isDone);
            },
            async removeTask(task)
            {
                await this.taskModel.removeTask(task.id);
                await this.getTaskByDate();
                await this.getEventsForAll();
            }
        },
        async mounted()
        {
            await this.getTaskByDate();
            await this.getEventsForAll();
        },
        computed: {
            sortTasks()
            {
                const tempTasks = this["tasks"];
                tempTasks.sort((a, b) => Number(a.isDone) - Number(b.isDone));
                return tempTasks;
            }
        }
    })
</script>
