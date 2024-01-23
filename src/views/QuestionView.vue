<template>
  <!-- 做题界面背景容器 -->
  <div id="code-pane">
    <!--  做题界面主容器   -->
    <div id="container">
      <!--  做题界面-左侧布局(题目元信息区)   -->
      <div ref="leftPane" class="left-pane">
        <LeftLayout @on-l-dblclick="getLeftIsResize"></LeftLayout>
      </div>
      <!--   左右拖动条   -->
      <div class="separator" ref="separator" @mousedown="LRMove">
        <img src="../assets/lr.png" class="lrTag" alt="" draggable="false"/>
      </div>
      <!--  做题界面-右侧布局   -->
      <div ref="rightPane" class="right-pane">
        <!--   做题界面-右上布局(代码编辑区)    -->
        <div class="right-top-box" ref="rightTopBox">
          <div style="overflow: auto">
            <EditorComponent @on-dblclick="getCodeIsResize"></EditorComponent>
          </div>
        </div>
        <!--   上下拖动条   -->
        <div class="vertical-separator" ref="verticalSeparator" @mousedown="UDMove">
          <img src="../assets/ud.png" class="udTag" alt="" draggable="false" />
        </div>
        <!--   做题界面-右下布局(运行测试区)    -->
        <div class="right-bottom-box" ref="rightBottomBox">
          <CodeRunComponent @on-r-dblclick="getRunIsResize"></CodeRunComponent>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { provide, type Ref, ref } from 'vue'
import CodeRunComponent from '@/components/rightpane/CodeRunComponent.vue'
import LeftLayout from '@/components/leftpane/LeftLayout.vue'
import EditorComponent from '@/components/rightpane/EditorComponent.vue'

/* 获取两个拖拽条 */
const separator = ref<HTMLDivElement>()
const verticalSeparator = ref<HTMLDivElement>()
/* 获取 “拖拽” 会改变的 DIV 盒子  */
const leftPane = ref<HTMLDivElement>()
const rightPane = ref<HTMLDivElement>()
const rightTopBox = ref<HTMLDivElement>()
const rightBottomBox = ref<HTMLDivElement>()
/* 是否发生了的拖拽 */
const isResizing = ref(false)
const isVerticalResizing = ref(false)
/* 选项卡的位置设置 */
const questionTabsPlacement = ref<string>('top')
const editorTabsPlacement = ref<string>('top')
const TestRunTabsPlacement = ref<string>('top')

/* 传递 Tabs 位置给各个子组件 */
provide('questionTabsPlacement', questionTabsPlacement)
provide('editorTabsPlacement', editorTabsPlacement)
provide('TestRunTabsPlacement', TestRunTabsPlacement)

/* 监听鼠标按下 "左右拖动条" */
const LRMove = () => {
  // console.log("---------------鼠标按下, 开始左右拖拽---------------")
  // 开始左右拖拽
  isResizing.value = true
  // 监听鼠标按下并移动, 并利用 handleMouseMove 方法根据移动情况重置左右盒子尺寸
  document.addEventListener('mousemove', handleMouseMove)
  // 监听鼠标释放
  document.addEventListener('mouseup', () => {
    // 左右拖拽结束
    isResizing.value = false
    // console.log("---------------鼠标释放, 结束左右拖拽---------------")
  })
}

/* 监听鼠标按下 "上下拖动条" */
const UDMove = () => {
  isVerticalResizing.value = true
  document.addEventListener('mousemove', handleVerticalMouseMove)
  document.addEventListener('mouseup', () => {
    isVerticalResizing.value = false
  })
}


// 根据右侧面板宽度调整 Tabs 的位置
const setRTabDir = (rightPaneWith:string) => {
  if (parseInt(rightPaneWith, 10) <= 80) {
    editorTabsPlacement.value = 'right'
    TestRunTabsPlacement.value = 'right'
  } else {
    editorTabsPlacement.value = 'top'
    TestRunTabsPlacement.value = 'top'
  }
}

// 根据左侧面板宽度调整 Tabs 的位置
const setLTabDir = (leftPaneWith:string) => {
  if (parseInt(leftPaneWith, 10) <= 108) questionTabsPlacement.value = 'left'
  else questionTabsPlacement.value = 'top'
}

/**
 * 左右拖拽逻辑
 * 该方法用于处理左右拖拽的逻辑，根据拖拽的位置调整左右两个面板的宽度，并根据宽度调整相关布局。
 * @param event 是 MouseEvent , 含有当前鼠标的相关信息, 可用来获取鼠标的位置
 */
const handleMouseMove = (event: MouseEvent) => {
  // 判断是否正在进行拖拽，并且确保相关 DOM 元素存在
  if (isResizing.value && separator.value && leftPane.value && rightPane.value) {
    // 获取总容器尺寸和分隔条尺寸
    const containerRect = document.getElementById('container')?.getBoundingClientRect()
    const separatorRect = separator.value.getBoundingClientRect()

    if (containerRect) {
      // 计算左侧面板和右侧面板的宽度
      const leftPaneWidth = event.clientX - containerRect.left - separatorRect.width / 2
      const totalWidth = containerRect.width
      const rightPaneWidth = totalWidth - leftPaneWidth - separatorRect.width

      // 设置左侧面板的宽度，限制在一定范围内
      leftPane.value.style.width = `${Math.min(Math.max(leftPaneWidth, 108), containerRect.width - 108)}px`
      setLTabDir(leftPane.value.style.width)

      // 设置右侧面板的宽度，同样限制在一定范围内
      rightPane.value.style.width = `${Math.min(Math.max(rightPaneWidth, 80), containerRect.width - 80)}px`
      setRTabDir(rightPane.value.style.width)
    }
  }
}




/**
 * 上下拖拽逻辑
 * 该方法用于处理上下拖拽的逻辑，根据拖拽的位置调整右侧容器中两个盒子的高度，并根据高度调整相关布局。
 * @param event 是 MouseEvent , 含有当前鼠标的相关信息, 可用来获取鼠标的位置
 */
const handleVerticalMouseMove = (event: MouseEvent) => {
  if (isVerticalResizing.value && verticalSeparator.value) {
    const containerRect = rightPane.value?.getBoundingClientRect()
    const separatorRect = verticalSeparator.value.getBoundingClientRect()
    if (containerRect) {
      const topBoxHeight = event.clientY - containerRect.top - separatorRect.height / 2
      const totalHeight = containerRect.height
      const bottomBoxHeight = totalHeight - topBoxHeight - separatorRect.height
      if (rightTopBox.value && rightBottomBox.value) {
        rightTopBox.value.style.height = `${Math.max(topBoxHeight, 48)}px`
        rightBottomBox.value.style.height = `${Math.max(bottomBoxHeight, 48)}px`
      }
    }
  }
}
/* 设定初始布局占比 */
const LRGrid = ref<string>("3.5fr auto 6.5fr")
const UDGrid = ref<string>("7fr auto 3fr")
// 双击 Editor Tabs 时扩展该盒子尺寸
const getCodeIsResize = (isEditorResize: Ref<boolean>) => {
  console.log("接受到 CodeEditor 传来的参数: " + isEditorResize.value)
  if (isEditorResize.value) {
    LRGrid.value = "1fr auto 15fr"
    if (leftPane.value && rightPane.value) {
      leftPane.value.style.width = "108px"
      rightPane.value.style.width = "92vw"
      setLTabDir("108px")
    }
    UDGrid.value = "17fr auto 1fr"
  }else {
    if (leftPane.value && rightPane.value) {
      rightPane.value.style.width = "66vw"
      leftPane.value.style.width = "34vw"
    }
    LRGrid.value = "3.5fr auto 6.5fr"
    setLTabDir("109px")
    UDGrid.value = "7fr auto 3fr"
  }
}
// 双击 LeftPane Tabs 时扩展该盒子尺寸
const getLeftIsResize = (isLeftResize: Ref<boolean>) => {
  console.log("接受到 LeftLayout 传来的参数: " + isLeftResize.value)
  if (isLeftResize.value) {
    LRGrid.value = "20fr auto 1fr"
    if (rightPane.value && leftPane.value) {
      rightPane.value.style.width = "80px"
      leftPane.value.style.width = "93vw"
      setRTabDir("80px")
    }
    UDGrid.value = "17fr auto 1fr"
  }else {
    LRGrid.value = "3.5fr auto 6.5fr"
    if (rightPane.value && leftPane.value) {
      rightPane.value.style.width = "66vw"
      leftPane.value.style.width = "34vw"
    }
    setRTabDir("81px")
    UDGrid.value = "7fr auto 3fr"
  }
}

// 双击 CodeRun Tabs 时扩展该盒子尺寸
const getRunIsResize = (isRunResize: Ref<string>) => {
  console.log("接受到 CodeRun 传来的参数: " + isRunResize.value)
  if (isRunResize.value) {
    UDGrid.value = "1fr auto 17fr"
    if (rightTopBox.value && rightBottomBox.value) {
      rightTopBox.value.style.height = "48px"
      rightBottomBox.value.style.height = "86vh"
    }
  }else {
    UDGrid.value = "7fr auto 3fr"
    if (rightTopBox.value && rightBottomBox.value) {
      rightTopBox.value.style.height = "63vh"
      rightBottomBox.value.style.height = "27.5vh"
    }
  }
}

</script>

<style scoped>
#code-pane {
  height: 100%;
  margin: 0;
  overflow: hidden;
  background-color: #f0f0f0; /* 页面背景色为浅灰色 */
}

#container {
  display: grid;
  grid-template-columns: v-bind(LRGrid); /* 初始 左右盒子 grid 布局比例 */
  margin: 10px;
  height: 92vh;
}

.left-pane {
  overflow: hidden; /* 禁止盒子内部内容滚动 */
  position: relative;
  background-color: #ffffff;
  border-radius: 8px;
  margin: 0;
  min-width: 108px; /* 最小宽度 */
}

.right-pane {
  overflow: hidden; /* 禁止盒子内部内容滚动 */
  height: 100%;
  display: grid;
  grid-template-rows: v-bind(UDGrid); /* 初始 右侧上下面板 grid 布局比例 */
  z-index: 2;

  min-width: 80px;
  max-height: 92vh;
}

.right-top-box {
  overflow: hidden; /* 禁止盒子内部内容滚动 */
  position: relative;
  background-color: #ffffff;
  border-radius: 10px;
  margin: 0;

  min-height: 48px;
  max-height: 86vh;
}

.right-bottom-box {
  overflow: hidden; /* 禁止盒子内部内容滚动 */
  position: relative;
  background-color: #ffffff;
  border-radius: 10px;
  margin: 0;

  min-height: 48px;
}

.separator {
  width: 10px;
  cursor: ew-resize; /* 可左右拖动 */
  background-color: transparent; /* 透明拖动条 */
  transition: background-color 0.3s; /* 添加过渡效果 */
  z-index: 1;

  display: flex;
  justify-content: center;
  align-items: center;
}

.vertical-separator {
  height: 10px;
  position: relative;
  cursor: ns-resize; /* 可上下拖动 */
  background-color: transparent; /* 透明拖动条 */
  transition: background-color 0.3s; /* 添加过渡效果 */
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.separator:hover,
.vertical-separator:hover {
  background-color: #a6c8ff; /* 鼠标悬停时高亮为浅蓝色 */
}

.lrTag {
  height: 35px;
  width: 20px;
  user-select: none;
  -webkit-user-drag: none; /* 禁止 “选择或拖动” 分隔图标 */
}
.udTag {
  width: 30px;
  height: 20px;
  user-select: none;
  -webkit-user-drag: none; /* 禁止 “选择或拖动” 分隔图标 */
}
</style>