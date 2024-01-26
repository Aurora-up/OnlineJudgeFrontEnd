<template>
  <t-collapse >
    <t-collapse-panel
      :key="index"
      v-for="(item, index) in submitData"
      :header="`提交时间: ${item.time}`">
      <template #headerRightContent>
        <t-space size="small">
          <t-tag :theme="item.state" variant="light" size="large">{{item.desc}}</t-tag>
        </t-space>
      </template>
      <div style="overflow: auto">
<!--        <n-code :code="item.code" show-line-numbers />-->
        <MdPreview  previewTheme="github" editorId="preview-only" :modelValue="prefix + item.lang + '\n' + item.code + postfix" />
      </div>
    </t-collapse-panel>



  </t-collapse>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { NCode } from 'naive-ui'
import { MdPreview } from 'md-editor-v3'

const prefix = "```"
const postfix = "\n```"

/* 模拟数据 */
const submitData = [
  {
    time: '2024.1.25 15:12:44',
    lang: 'java',
    state: "success",
    desc: 'AC',
    code: `import java.io.*;
public class Main{
  public void static main(String arg) {
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
    state: "warning",
    desc: 'TimeOut',
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
`,
  },
  {
    time: '2024.1.25 15:00:01',
    lang: 'java',
    state: "danger",
    desc: "Error",
    code: `public class Main{
  public void static main(String arg) {

  }
}`,
  }
]


// todo 从后端请求来 提交记录

// todo 将提交记录存到 localstore

// todo 每提交一次, 先存到 localstore


</script>
