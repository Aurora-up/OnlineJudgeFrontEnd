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
            <EditorComponent @on-dblclick="getCodeIsResize"></EditorComponent>
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
import { useRoute } from 'vue-router'

const route = useRoute();
provide("PId", route.params.PId);


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
/* 选项卡的位置设置 —— 拖拽某个盒子到极限时更改  Tabs 的显示方式来获得更好的页面布局响应性 */
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


/**
 * 根据右侧面板宽度调整 Tabs 的位置
 * @param rightPaneWith 右侧面板宽度
 */
const setRTabDir = (rightPaneWith:string) => {
  // 80px 是右侧面板的最小宽度
  if (parseInt(rightPaneWith, 10) <= 80) {  // <= 80px 让右侧面板的 Tabs 靠右排列
    editorTabsPlacement.value = 'right'
    TestRunTabsPlacement.value = 'right'
  } else {
    editorTabsPlacement.value = 'top'
    TestRunTabsPlacement.value = 'top'
  }
}

/**
 * 根据左侧面板宽度调整 Tabs 的位置
 * @param leftPaneWith 左侧面板宽度
 */
const setLTabDir = (leftPaneWith:string) => {
  // 108px 是左侧面板的最小宽度
  if (parseInt(leftPaneWith, 10) <= 108) questionTabsPlacement.value = 'left' // <= 80px 让左侧面板的 Tabs 靠左排列
  else questionTabsPlacement.value = 'top'
}

// 右侧面板拖拽至宽度很小时, 让 Code Config 隐藏掉
const isDisplayCodeConfig = ref<boolean>(true);
provide("isDisplayCodeConfig", isDisplayCodeConfig)


/**
 * 由于 Code mirror 组件的原因，其高度无法根据外层容器的变化而变化, 故需要在上下拖拽时同步修改 Code mirror 的高度
 */
const CodeHeightVH = ref<string>('54.5vh')
provide("CodeHeightVH", CodeHeightVH);
const codeWidthIsChange = ref<boolean>(false);
provide("codeWidthIsChange", codeWidthIsChange);

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
      leftPane.value.style.width = `${Math.min(Math.max(leftPaneWidth, 108), containerRect.width - 93)}px`
      setLTabDir(leftPane.value.style.width)

      // 设置右侧面板的宽度，同样限制在一定范围内
      rightPane.value.style.width = `${Math.min(Math.max(rightPaneWidth, 80), containerRect.width - 117)}px`
      setRTabDir(rightPane.value.style.width)

      codeWidthIsChange.value = !codeWidthIsChange.value;

      // 隐藏 Code Config
      if (rightPane.value.style.width == '80px') isDisplayCodeConfig.value = false
      else isDisplayCodeConfig.value = true
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

        /* 同步修改 CodeEditor 高度 */
        let vh = window.innerHeight * 0.01
        const rightTopBoxVH = parseInt(rightTopBox.value.style.height, 10) / vh
        // console.log(rightTopBoxVH)

        /* 同步修改 Code mirror 组件的高度来获得更好的页面响应性 */
        let codeVH = rightTopBoxVH - 8.5;
        if (codeVH <= 11) codeVH = 11
        if (codeVH > 77.5) codeVH = 77.5;
        // console.log(codeVH.toString() + "vh")
        CodeHeightVH.value = codeVH.toString() + "vh"
      }
    }
  }
}

/* 设定初始布局占比 */
const LRGrid = ref<string>("3.5fr auto 6.5fr")
const UDGrid = ref<string>("7fr auto 3fr")

/**
 * 双击 EditorComponent Tabs 时 "扩展" 该盒子尺寸 或 "重置" 为初始布局
 * @param isEditorResize 在 EditorComponent 组件 @dblclick="resize" 事件中传来的参数
 */
const getCodeIsResize = (isEditorResize: Ref<boolean>) => {
  // console.log("接受到 EditorComponent 传来的参数: " + isEditorResize.value)
  if (isEditorResize.value) {
    // 若未 "拖拽" 直接设置 grip 布局即可 ———— 双击初始布局时触发
    LRGrid.value = "1fr auto 15fr"
    // 拖拽后无法使用 grid 布局去设置, 故直接设置各自宽高 ———— 双击拖拽后布局触发
    if (leftPane.value && rightPane.value) {
      leftPane.value.style.width = "108px"
      rightPane.value.style.width = "92vw"
      setLTabDir("108px")
    }
    /* 逻辑同上, 设置右侧上下盒子的布局 */
    UDGrid.value = "17fr auto 1fr"
    if (rightTopBox.value && rightBottomBox.value) {
      rightTopBox.value.style.height = '86vh';
      CodeHeightVH.value = '77.5vh'                // 同步设置 Code 的尺寸
      rightBottomBox.value.style.height = '48px'
    }
  }
  // 再次双击重置为 初始布局
  else {
    LRGrid.value = "3.5fr auto 6.5fr"
    if (leftPane.value && rightPane.value) {
      rightPane.value.style.width = "65.5vw"
      leftPane.value.style.width = "33vw"
    }
    setLTabDir("109px")
    UDGrid.value = "7fr auto 3fr"
    if (rightTopBox.value && rightBottomBox.value) {
      rightTopBox.value.style.height = "64.5vh"
      CodeHeightVH.value = '54.5vh'                 // 同步设置 Code 的尺寸
      rightBottomBox.value.style.height = "27.5vh"
    }
  }
}


/**
 *  双击 LeftLayout Tabs 时 "扩展" 该盒子尺寸 或 "重置" 为初始布局
 * @param isLeftResize 在 LeftLayout 组件 @dblclick="resize" 事件中传来的参数
 */
const getLeftIsResize = (isLeftResize: Ref<boolean>) => {
  // console.log("接受到 LeftLayout 传来的参数: " + isLeftResize.value)
  if (isLeftResize.value) {
    LRGrid.value = "20fr auto 1fr"
    if (rightPane.value && leftPane.value) {
      rightPane.value.style.width = "80px"
      codeWidthIsChange.value = !codeWidthIsChange.value;
      // console.log(rightPane.value.style.width)
      if (rightPane.value.style.width == '80px') isDisplayCodeConfig.value = false   // 同步控制 Code Config 的显隐
      else isDisplayCodeConfig.value = true
      leftPane.value.style.width = "94vw"
      setRTabDir("80px")
    }
    UDGrid.value = "17fr auto 1fr"
  }else {
    LRGrid.value = "3.5fr auto 6.5fr"
    if (rightPane.value && leftPane.value && rightTopBox.value) {
      codeWidthIsChange.value = !codeWidthIsChange.value;
      rightPane.value.style.width = "65vw"
      leftPane.value.style.width = "34vw"
      if (rightPane.value.style.width == '65vw') isDisplayCodeConfig.value = true   // 同步控制 Code Config 的显隐
    }
    setRTabDir("81px")
    UDGrid.value = "7fr auto 3fr"
  }
}

/**
 * 双击 CodeRunComponent Tabs 时 "扩展" 该盒子尺寸 或 "重置" 为初始布局
 * @param isRunResize 在 CodeRunComponent 组件 @dblclick="resize" 事件中传来的参数
 */
const getRunIsResize = (isRunResize: Ref<string>) => {
  // console.log("接受到 CodeRunComponent 传来的参数: " + isRunResize.value)
  if (isRunResize.value) {
    UDGrid.value = "1fr auto 17fr"
    if (rightTopBox.value && rightBottomBox.value) {
      rightTopBox.value.style.height = "48px"
      CodeHeightVH.value = '11vh'  // 设置 Code 的尺寸
      rightBottomBox.value.style.height = "86vh"
    }
  }else {
    UDGrid.value = "7fr auto 3fr"
    if (rightTopBox.value && rightBottomBox.value) {
      rightTopBox.value.style.height = "64.5vh"
      CodeHeightVH.value = '54.5vh'  // 设置 Code 的尺寸
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
  background-color: #F0F0F0; /* 页面背景色为浅灰色 */
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
  max-height: 94vh;
  min-width: 108px; /* 最小宽度 */
}

.right-pane {
  overflow: hidden; /* 禁止盒子内部内容滚动 */
  height: 100%;
  display: grid;
  grid-template-rows: v-bind(UDGrid); /* 初始 右侧上下面板 grid 布局比例 */
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
  height: 100%;
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