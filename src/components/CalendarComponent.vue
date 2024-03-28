<template>
    <div>
        <VCalendar :attributes="attributes" id="calendar-content" ref="calendar">
            <template #footer>
                <div
                    style="display: flex; justify-content: center; margin-bottom: 10px; width: 100%"
                >
                    <div class="todolist-contain">
                        <t-collapse :borderless="true" style="width: 100%">
                            <t-collapse-panel value="0" header="今日待办">
                                <template #headerRightContent>
                                    <t-button
                                        shape="circle"
                                        variant="text"
                                        theme="default"
                                        size="medium"
                                        style="margin-left: 10px"
                                        @click="addNewTodayToDo"
                                    >
                                        <AddCircleIcon />
                                    </t-button>
                                </template>
                                <t-space direction="vertical">
                                    <t-checkbox
                                        v-for="todo in todayToDoList"
                                        :key="todo.description"
                                        v-model="todo.isComplete"
                                    >
                                        <span
                                            :style="{
                                                color: todo.color,
                                                textDecoration: todo.isComplete
                                                    ? 'line-through'
                                                    : 'none'
                                            }"
                                        >
                                            {{ todo.description }}
                                        </span>
                                        <t-button
                                            shape="circle"
                                            variant="text"
                                            theme="danger"
                                            size="small"
                                            style="margin-left: 10px"
                                            @click="deleteTodayToDoItem(todo)"
                                        >
                                            <CloseCircleIcon />
                                        </t-button>
                                    </t-checkbox>
                                </t-space>
                            </t-collapse-panel>

                            <t-collapse-panel value="1" header="长期目标">
                                <template #headerRightContent>
                                    <t-button
                                        shape="circle"
                                        variant="text"
                                        theme="default"
                                        size="medium"
                                        style="margin-left: 10px"
                                        @click="addNewDuringToDo"
                                    >
                                        <AddCircleIcon />
                                    </t-button>
                                </template>
                                <t-space direction="vertical">
                                    <t-checkbox
                                        v-for="todo in duringToDoList"
                                        :key="todo.description"
                                        v-model="todo.isComplete"
                                    >
                                        <span
                                            :style="{
                                                color: todo.color,
                                                textDecoration: todo.isComplete
                                                    ? 'line-through'
                                                    : 'none'
                                            }"
                                        >
                                            {{ todo.description }}
                                        </span>
                                        <t-button
                                            shape="circle"
                                            variant="text"
                                            theme="danger"
                                            size="medium"
                                            style="margin-left: 10px"
                                            @click="deleteDuringTodoItem(todo)"
                                        >
                                            <CloseCircleIcon />
                                        </t-button>
                                    </t-checkbox>
                                </t-space>
                            </t-collapse-panel>
                        </t-collapse>
                    </div>
                </div>
            </template>
        </VCalendar>
    </div>

    <t-dialog
        v-model:visible="visible1"
        header="添加一个 TODO 吧!"
        width="40%"
        :confirm-on-enter="true"
        :on-confirm="onConfirmAnother1"
    >
        <t-space direction="vertical" style="width: 100%">
            <div>
                <span>不积跬步无以至千里，不积小流无以成江海。</span>
            </div>
            <div style="display: flex">
                <t-select-input
                    :value="selectValue"
                    :popup-visible="popupVisible"
                    :popup-props="{ overlayInnerStyle: { padding: '6px' } }"
                    style="width: 90px"
                    placeholder="标签色"
                    clearable
                    :auto-width="true"
                    @popup-visible-change="onPopupVisibleChange"
                >
                    <template #panel>
                        <ul class="tdesign-demo__select-input-ul-single">
                            <li
                                v-for="item in options"
                                :key="item.value"
                                @click="() => onOptionClick(item)"
                            >
                                <div
                                    :style="{
                                        backgroundColor: item.label,
                                        height: '15px',
                                        width: '15px',
                                        borderRadius: '50%'
                                    }"
                                ></div>
                            </li>
                        </ul>
                    </template>
                    <template #suffixIcon>
                        <chevron-down-icon />
                    </template>
                </t-select-input>
                <t-input autofocus clearable v-model="newToDoDesc" />
            </div>
        </t-space>
    </t-dialog>
    <t-dialog
        v-model:visible="visible2"
        header="添加一个长期目标吧!"
        width="40%"
        :confirm-on-enter="true"
        :on-confirm="onConfirmAnother2"
    >
        <t-space direction="vertical" style="width: 100%">
            <div>
                <span>不积跬步无以至千里，不积小流无以成江海。</span>
            </div>
            <div style="display: flex">
                <t-select-input
                    :value="selectValue2"
                    :popup-visible="popupVisible2"
                    :popup-props="{ overlayInnerStyle: { padding: '6px' } }"
                    style="width: 90px"
                    placeholder="标签色"
                    clearable
                    :auto-width="true"
                    @popup-visible-change="onPopupVisibleChange2"
                >
                    <template #panel>
                        <ul class="tdesign-demo__select-input-ul-single">
                            <li
                                v-for="item in options2"
                                :key="item.value"
                                @click="() => onOptionClick2(item)"
                            >
                                <div
                                    :style="{
                                        backgroundColor: item.label,
                                        height: '15px',
                                        width: '15px',
                                        borderRadius: '50%'
                                    }"
                                ></div>
                            </li>
                        </ul>
                    </template>
                    <template #suffixIcon>
                        <chevron-down-icon />
                    </template>
                </t-select-input>
                <t-date-range-picker v-model="range" cancel-range-select-limit />
            </div>
            <t-input autofocus clearable v-model="newDuringTodoDesc" />
        </t-space>
    </t-dialog>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { CloseCircleIcon, AddCircleIcon, ChevronDownIcon } from 'tdesign-icons-vue-next'

const calendar = ref(null)

type todayTodo = {
    description: string
    isComplete: boolean
    dates: Date
    color: string // red, blue, orange, purple, yellow
}
type duringTodo = {
    description: string
    isComplete: boolean
    dates: {
        start: Date
        end: Date
    }
    color: string // red, blue, orange, purple, yellow
}

// 今日待办列表
const todayToDoList = ref<Array<todayTodo>>([])

// 长期目标
const duringToDoList = ref<Array<duringTodo>>([])

const attributes = computed(() => {
    const newTodayToDoList: Array<any> = []
    if (todayToDoList.value != null) {
        todayToDoList.value.map((todo) => {
            if (!todo.isComplete) {
                newTodayToDoList.push({
                    dates: todo.dates,
                    dot: todo.color
                })
            }
        })
    }
    if (todayToDoList.value.length != 0) {
        localStorage.setItem('todayToDoList', JSON.stringify(todayToDoList.value))
    }
    const newDuringToDoList: Array<any> = []
    if (duringToDoList.value != null) {
        duringToDoList.value.map((todo) => {
            if (!todo.isComplete) {
                newDuringToDoList.push({
                    dates: todo.dates,
                    highlight: {
                        start: { fillMode: 'outline', color: todo.color },
                        base: { fillMode: 'light', color: todo.color },
                        end: { fillMode: 'outline', color: todo.color }
                    }
                })
            }
        })
    }
    if (duringToDoList.value.length != 0) {
        localStorage.setItem('duringToDoList', JSON.stringify(duringToDoList.value))
    }
    return newTodayToDoList.concat(newDuringToDoList, [
        {
            popover: { label: '今天也要加油刷题欧!' },
            dates: new Date(),
            highlight: 'green'
        }
    ])
})

const deleteTodayToDoItem = (todo: any) => {
    const index = todayToDoList.value.indexOf(todo)
    if (index !== -1) {
        todayToDoList.value.splice(index, 1)
    }
    localStorage.setItem('todayToDoList', JSON.stringify(todayToDoList.value))
}
const deleteDuringTodoItem = (todo: any) => {
    const index = duringToDoList.value.indexOf(todo)
    if (index !== -1) {
        duringToDoList.value.splice(index, 1)
    }
    localStorage.setItem('duringToDoList', JSON.stringify(todayToDoList.value))
}

const addNewTodayToDo = () => {
    visible1.value = true
    newToDoDesc.value = ''
    selectValue.value = { label: '', value: 1 }
}

const addNewDuringToDo = () => {
    visible2.value = true
    newDuringTodoDesc.value = ''
    range.value = ['', '']
}

/* 新增今日待办对话框数据 */
const visible1 = ref(false)
const newToDoDesc = ref('')
const options = [
    { label: 'blue', value: 1 },
    { label: 'red', value: 2 },
    { label: 'orange', value: 3 },
    { label: 'purple', value: 4 },
    { label: 'green', value: 5 }
]
const selectValue = ref({ label: '', value: 1 })
const popupVisible = ref(false)
const onOptionClick = (item: any) => {
    selectValue.value = item
    popupVisible.value = false
}

const onPopupVisibleChange = (val: any, context: any) => {
    console.log(context)
    popupVisible.value = val
}
const onConfirmAnother1 = () => {
    if (newToDoDesc.value === '') {
        visible1.value = false
        return
    }
    todayToDoList.value.push({
        description: newToDoDesc.value,
        isComplete: false,
        dates: new Date(),
        color: selectValue.value.label // red, blue, orange, purple, yellow
    })
    localStorage.setItem('todayToDoList', JSON.stringify(todayToDoList.value))
    visible1.value = false
}

/* 新增长期目标数据 */
const visible2 = ref(false)
const newDuringTodoDesc = ref('')
const range = ref(['', ''])

const options2 = [
    { label: 'blue', value: 1 },
    { label: 'red', value: 2 },
    { label: 'orange', value: 3 },
    { label: 'purple', value: 4 },
    { label: 'green', value: 5 }
]
const selectValue2 = ref({ label: '', value: 1 })
const popupVisible2 = ref(false)
const onOptionClick2 = (item: any) => {
    selectValue2.value = item
    popupVisible2.value = false
}

const onPopupVisibleChange2 = (val: any) => {
    popupVisible2.value = val
}
const onConfirmAnother2 = () => {
    if (newDuringTodoDesc.value === '' || range.value[0] === '' || range.value[1] === '') {
        visible2.value = false
        return
    }
    duringToDoList.value.push({
        description: newDuringTodoDesc.value,
        isComplete: false,
        dates: {
            start: new Date(range.value[0]),
            end: new Date(range.value[1])
        },
        color: selectValue2.value.label // red, blue, orange, purple, yellow
    })
    localStorage.setItem('duringToDoList', JSON.stringify(duringToDoList.value))
    visible2.value = false
}

onMounted(() => {
    todayToDoList.value = JSON.parse(localStorage.getItem('todayToDoList') ?? '[]')
    duringToDoList.value = JSON.parse(localStorage.getItem('duringToDoList') ?? '[]')
})
</script>

<style>
#calendar-content {
    border: none;
    box-shadow: 0px 0px 15px 5px rgba(0, 0, 0, 0.1);
}

.todolist-contain {
    width: 100%;
    display: flex;
    justify-content: center;
}

.todoItem {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
}
.tdesign-demo__select-input-ul-single {
    display: flex;
    flex-direction: column;
    padding: 0;
    gap: 2px;
}
.tdesign-demo__select-input-ul-single > li {
    display: block;
    border-radius: 3px;
    line-height: 22px;
    cursor: pointer;
    padding: 3px 8px;
    color: var(--td-text-color-primary);
    transition: background-color 0.2s linear;
    white-space: nowrap;
    word-wrap: normal;
    overflow: hidden;
    text-overflow: ellipsis;
}

.tdesign-demo__select-input-ul-single > li:hover {
    background-color: var(--td-bg-color-container-hover);
}
</style>
