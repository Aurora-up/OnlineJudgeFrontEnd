import { defineStore } from 'pinia'

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
            count: <number> 0
        }
    },
    getters: {},
    actions: {
        increment() {
            this.count++
        },
        async tackleLogin() {
            this.count = await login()
        }
    }
})