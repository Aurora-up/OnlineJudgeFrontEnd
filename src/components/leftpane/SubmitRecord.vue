<template>
    <t-collapse @dblclick="stopPropagationEvent">
        <t-collapse-panel
            :key="index"
            v-for="(item, index) in submitData"
            :header="`提交时间: ${item.time}`"
        >
            <template #headerRightContent>
                <t-space size="small">
                    <t-tag :theme="item.state" variant="light" size="large">{{ item.desc }}</t-tag>
                </t-space>
            </template>
            <div style="overflow: auto" class="submit-code-contain">
                <t-space style="margin-bottom: 15px">
                    通过了: {{ item.acceptData }}/10 个数据
                    <t-divider layout="vertical" />
                    运行总时间: {{ item.runningTime }}
                    <t-divider layout="vertical" />
                    峰值内存占用: {{ item.runningSpace }}
                </t-space>
                <!--          <n-code :code="item.code" show-line-numbers  />-->
                <MdPreview
                    previewTheme="github"
                    editorId="preview-only"
                    :modelValue="prefix + item.lang + '\n' + item.code + postfix"
                />
            </div>
        </t-collapse-panel>
    </t-collapse>
</template>

<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import { MdPreview } from 'md-editor-v3'

const PID = ref<number>(0)
const PId = inject<number>('PId')
onMounted(() => {
    PID.value = PId ?? 0
})

const prefix = '```'
const postfix = '\n```'

/* 模拟数据 */
const submitData = [
    {
        time: '2024.1.25 15:12:44',
        runningTime: '13ms',
        runningSpace: '216KB',
        acceptData: 10,
        lang: 'java',
        state: 'success',
        desc: 'Accept',
        code: `import java.io.*;
public class Main{
  public static void main(String[] args) throws IOException{
    var in = new BufferedReader(new InputStreamReader(System.in));
    var out = new PrintWriter(new OutputStreamWriter(System.out));
    String[] str1 = in.readLine().split(" ");
    int a = Integer.parseInt(str1[0]);
    int b = Integer.parseInt(str1[1]);
    out.print(a + b);
    out.flush();
    out.close();
    in.close();
  }
}`
    },
    {
        time: '2024.1.25 15:02:32',
        lang: 'java',
        runningTime: '1400ms',
        runningSpace: '2MB',
        acceptData: 7,
        state: 'warning',
        desc: 'Time Limit Exceeded',
        code: `import java.util.Scanner;
public class Main {
  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    int A = scanner.nextInt();
    int B = scanner.nextInt();
    int sum = A + B;
    System.out.println(sum);
    scanner.close();
  }
}
`
    },
    {
        time: '2024.1.25 15:02:32',
        lang: 'java',
        runningTime: '1400ms',
        runningSpace: '2MB',
        acceptData: 7,
        state: 'warning',
        desc: 'Memory Limit Exceeded',
        code: `import java.util.Scanner;
import java.util.ArrayList;
import java.util.List;

public class Main {
  public static void main(String[] args) {
    List<byte[]> memoryList = new ArrayList<>();
    // 无限分配
      while (true) {
        byte[] memoryChunk = new byte[1024 * 1024];
        memoryList.add(memoryChunk);
      }
  }
}
`
    },
    {
        time: '2024.1.25 15:21:44',
        runningTime: '13ms',
        runningSpace: '216KB',
        acceptData: 10,
        lang: 'java',
        state: 'warning',
        desc: 'Presentation Error',
        code: `import java.io.*;
public class Main{
  public static void main(String[] args) throws IOException{
    var in = new BufferedReader(new InputStreamReader(System.in));
    var out = new PrintWriter(new OutputStreamWriter(System.out));
    String[] str1 = in.readLine().split(" ");
    int a = Integer.parseInt(str1[0]);
    int b = Integer.parseInt(str1[1]);
    out.print(a + '\n' + b);
    out.flush();
    out.close();
    in.close();
  }
}`
    },
    {
        time: '2024.1.25 15:19:44',
        runningTime: '13ms',
        runningSpace: '216KB',
        acceptData: 10,
        lang: 'java',
        state: 'danger',
        desc: 'Wrong Answer',
        code: `import java.io.*;
public class Main{
  public static void main(String[] args) throws IOException{
    var in = new BufferedReader(new InputStreamReader(System.in));
    var out = new PrintWriter(new OutputStreamWriter(System.out));
    String[] str1 = in.readLine().split(" ");
    int a = Integer.parseInt(str1[0]);
    int b = Integer.parseInt(str1[1]);
    out.print(a - b);
    out.flush();
    out.close();
    in.close();
  }
}`
    },
    {
        time: '2024.1.25 15:00:01',
        lang: 'java',
        runningTime: 'N/A',
        runningSpace: 'N/A',
        acceptData: 0,
        state: 'danger',
        desc: 'Runtime Error',
        code: `public class Main{
  public static void main(String[] args) {
    int i = 5 / 0 ;
  }
}`
    },
    {
        time: '2024.1.25 15:11:01',
        lang: 'java',
        runningTime: 'N/A',
        runningSpace: 'N/A',
        acceptData: 0,
        state: 'danger',
        desc: 'Compile Error',
        code: `public class Test{
  public static void main(String[] args) {

  }
}`
    }
]
const stopPropagationEvent = (event: Event) => {
    event.stopPropagation();
}

// todo 从后端请求来 提交记录

// todo 将提交记录存到 localstore

// todo 每提交一次, 先存到 localstore
</script>

<style scoped>
.submit-code-contain {
    background-color: #f2f2f2;
}
</style>
