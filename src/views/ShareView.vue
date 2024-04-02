<template>

</template>

<script setup lang="ts">
import prettier from "prettier";
import * as javaPlugin from "prettier-plugin-java"
import * as rustPlugin from "prettier-plugin-rust";

const javaText = `
public class HelloWorldExample{
  public static void main(String args[]){
    System.out.println("Hello World !");
  }
}
`;

const formattedText = prettier.format(javaText, {
    parser: "java",
    tabWidth: 2
});

const code = `
fn main() { println!("Hello World");
}
`;

prettier.format(code, { plugins: [rustPlugin, javaPlugin] });

</script>

<style scoped>

</style>
