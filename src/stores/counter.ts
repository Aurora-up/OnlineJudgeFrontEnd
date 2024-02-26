import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// export const useCounterStore =
//   defineStore('counter', () => {
//
//   const count = ref(0)
//   const doubleCount = computed(() => count.value * 2)
//   function increment() {
//     count.value++
//   }
//
//   return { count, doubleCount, increment }
// })

const login = (): Promise<number> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(999)
    }, 2000)
  })
}


export const useCounterStore = defineStore('count', {
  state: () => {
    return {
      count: <number> 0,
    }
  },
  getters: {

  },
  actions: {
    increment() {
      this.count ++
    },
    async tackleLogion() {
      this.count = await login()
    }
  }
})