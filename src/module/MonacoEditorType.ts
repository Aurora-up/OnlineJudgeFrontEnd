import { type PropType } from 'vue'

// monaco-editor 主题枚举
export enum EditorThemeEnum {
    LIGHT = 'Default Light Modern',
    DARK = 'Default Dark Modern',
    LIGHT_HIGH_CONTRAST = 'Default High Contrast Light',
    DARK_HIGH_CONTRAST = 'Default High Contrast'
}
// monaco-editor 支持的语言类型枚举
export enum LangEnum {
    C = 'c',
    CPP = 'cpp',
    RUST = 'rust',
    JAVA = 'java',
    PYTHON = 'python'
}

export type Theme =
    | 'Default Light Modern'
    | 'Default Dark Modern'
    | 'Default High Contrast Light'
    | 'Default High Contrast'
export type Lang = 'cpp' | 'c' | 'java' | 'rust' | 'python'

// monaco-editor 配置选项
export interface Options {
    fontSize: number
    tabSize: number
    theme: string
}

export const editorProps = {
    htmlElementId: {
        type: String as PropType<string>,
        default: 'codeEditor'
    },
    codeValue: {
        type: String as PropType<string>,
        default: null
    },
    width: {
        type: [String, Number] as PropType<string | number>,
        default: '100%'
    },
    height: {
        type: [String, Number] as PropType<string | number>,
        default: '100%'
    },
    lang: {
        type: String as PropType<string>,
        validator(value: string): boolean {
            return ['c', 'cpp', 'rust', 'python', 'java'].includes(value)
        },
        default: 'cpp'
    },
    options: {
        type: Object as PropType<Options>,
        default() {
            return {
                fontSize: 14,
                tabSize: 4,
                theme: 'Default Light Modern'
            }
        }
    }
}
