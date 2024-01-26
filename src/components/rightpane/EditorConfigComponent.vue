<template>
  <div class="codeConfig" v-show="isDisplayCodeConfig && isDisplay">
    <div style="flex-grow: 1"></div>
    <t-select-input
      :value="currentLang"
      :popup-visible="popupVisible"
      placeholder="lang"
      auto-width
      borderless
      @popup-visible-change="onPopupVisibleChange"
      class="langSelect"
    >
      <template #panel>
        <ul class="tdesign-demo__select-input-ul-auto-width">
          <li
            v-for="(item, index) in langOptions"
            :key="index"
            @click="() => onLangOptionClick(String(item))"
          >
            {{ item }}
          </li>
        </ul>
      </template>
      <template #suffixIcon>
        <chevron-down-icon />
      </template>
    </t-select-input>
    <div>
      <t-space>
        <t-popup content="编辑器设置" placement="bottom" trigger="hover">
          <t-button theme="default" variant="base" @click="visibleCenter = true">
            <Setting1Icon />
          </t-button>
        </t-popup>
      </t-space>

      <t-dialog
        placement="center"
        header="代码编辑器设置"
        :visible="visibleCenter"
        :on-confirm="configConfirm"
        :on-close="configNo"
      >
        <t-select-input
          label="字体大小"
          :value="currentFontSize"
          :popup-visible="FSVisible"
          placeholder="lang"
          auto-width
          borderless
          @popup-visible-change="FSonPopupVisibleChange"
        >
          <template #panel>
            <ul class="tdesign-demo__select-input-ul-auto-width">
              <li
                v-for="(item, index) in fontSizeOptions"
                :key="index"
                @click="() => FSonOptionClick(String(item))"
              >
                {{ item }}
              </li>
            </ul>
          </template>
          <template #suffixIcon>
            <chevron-down-icon />
          </template>
        </t-select-input>

        <t-select-input
          label="Tab长度"
          suffix="个空格"
          :value="currentTabSize"
          :popup-visible="TSVisible"
          placeholder="lang"
          auto-width
          borderless
          @popup-visible-change="TSonPopupVisibleChange"
          style="margin-top: 10px"
        >
          <template #panel>
            <ul class="tdesign-demo__select-input-ul-auto-width">
              <li
                v-for="(item, index) in tabSizeOptions"
                :key="index"
                @click="() => TSonOptionClick(item)"
              >
                {{ item }}
              </li>
            </ul>
          </template>
          <template #suffixIcon>
            <chevron-down-icon />
          </template>
        </t-select-input>
      </t-dialog>
    </div>
    <div style="margin-left: 5px; margin-right: 5px">
      <t-popup content="还原到默认的代码模版" placement="bottom" trigger="hover">
        <t-button theme="default" variant="base" @click="recover">
          <RollfrontIcon />
        </t-button>
      </t-popup>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, getCurrentInstance, onMounted, inject, type Ref } from 'vue'
import { ChevronDownIcon, Setting1Icon, RollfrontIcon } from 'tdesign-icons-vue-next'

// 设置当前使用语言
const langOptions: string[] = ['java', 'cpp', 'rust']
const currentLang = ref<string>('java')
const popupVisible = ref(false)
const onLangOptionClick = (item: string) => {
  currentLang.value = item
  emit() // 选择不同语言时, 传送当前信息给 CodeEditor 组件
  // 选中后立即关闭浮层
  popupVisible.value = false
  // console.log(currentLang.value)
}
const onPopupVisibleChange = (val: boolean) => {
  popupVisible.value = val
}
const visibleCenter = ref(false)

/* 设置当前字体 */
const fontSizeOptions: string[] = ['14px', '16px', '18px', '20px']
const currentFontSize = ref<string>('16px')
const FSVisible = ref(false)
const FSonOptionClick = (item: string) => {
  currentFontSize.value = item
  // 选中后立即关闭浮层
  FSVisible.value = false
}
const FSonPopupVisibleChange = (val: boolean) => {
  FSVisible.value = val
}

/* 设置当前 Tab 所占空格数 */
const tabSizeOptions: number[] = [2, 4]
const currentTabSize = ref<number>(2)
const TSVisible = ref(false)
const TSonOptionClick = (item: number) => {
  currentTabSize.value = item
  // 选中后立即关闭浮层
  TSVisible.value = false
}
const TSonPopupVisibleChange = (val: boolean) => {
  TSVisible.value = val
}

/* 弹出的对话框的确实和取消 */
const configConfirm = () => {
  // 确认
  visibleCenter.value = false
  emit() // 发送给 CodeEditor 组件相关设置信息
}
const configNo = () => {
  // 取消
  visibleCenter.value = false
}

/* 重置当前代码模版设置 */
const isRecoverCodeTemplate = ref<boolean>(false)
const recover = () => {
  isRecoverCodeTemplate.value = true
  emit()
}

/* 将 Code Config 传给 CodeEditor 组件 */
const currentComponentInstance = getCurrentInstance()
const emit = () => {
  currentComponentInstance?.proxy?.$Bus.emit('on-editor-config', [
    currentLang,
    currentFontSize,
    currentTabSize,
    isRecoverCodeTemplate
  ])
}

/* 初始时加载 Local Store 中的数据 ———— 防止刷新后的数据丢失 */
onMounted(() => {
  const codeConfig = localStorage.getItem('code-config')
  if (codeConfig != null) {
    const configData = JSON.parse(codeConfig)
    currentLang.value = configData.lang
    currentFontSize.value = configData.fontSize
    currentTabSize.value = configData.tabSize
  }
})

/* 控制左右拖拽时是否显示 Code Config ———— 接收 QuestionView 组件传来的信息 */
const isDisplayCodeConfig = inject<Ref<boolean>>('isDisplayCodeConfig')

/* 控制切换选项卡时是否显示 Code Config ———— 接收 EditorComponent 组件传来的信号 */
const props = defineProps<{ isDisplay: boolean }>()
</script>
<style scoped>
.tdesign-demo__select-input-ul-auto-width {
  padding: 2px 0;
  margin: 0 -2px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tdesign-demo__select-input-ul-auto-width > li {
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

.tdesign-demo__select-input-ul-auto-width > li:hover {
  background-color: var(--td-bg-color-container-hover);
}

.codeConfig {
  margin-top: 1px;
  width: 100%;
  height: 3.5vh;
  display: flex;
  flex-wrap: wrap;
  border-bottom: #4b4b4b;
}

.langSelect {
  width: 50px;
  margin-right: 25px;
}
</style>
