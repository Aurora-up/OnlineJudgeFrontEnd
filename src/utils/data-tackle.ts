export const tackleMemory = (mem: number): string => {
    if (isNaN(mem) || mem == -1) {
        return "N/A"
    }
    if (mem >= 0 && mem < 1024) {
        return `${mem} B`;
    } else if (mem >= 1024 && mem < (1024 * 1024)) {
        return `${Math.floor(mem / 1024)} KB`;
    } else {
        return `${Math.floor(mem / (1024 * 1024))} MB`;
    }
};

export const tackleTime = (time: number) => {
    if (isNaN(time) || time == -1) {
        return "N/A"
    }
    if (time >= 0  && time < 1000) {
        return `${time} ms`
    }
    else {
        return `${(time / 1000).toFixed(3)} s`
    }
}

export const tackleFileUrlPrefix = (suffix: string) => {
    return `http://localhost:3000${suffix}`
}

export const utf8ToBase64 = (str: string) => {
    // 第一步：将字符串编码为 UTF-8
    const utf8Array = new TextEncoder().encode(str);

    // 第二步：将 Uint8Array 转换为二进制字符串
    let binaryString = '';
    for (const byte of utf8Array) {
        binaryString += String.fromCharCode(byte);
    }

    // 第三步：使用 btoa 将二进制字符串编码为 Base64
    return btoa(binaryString);
}

export const base64ToUtf8 = (base64Str: string) => {
    // 第一步：使用 atob 解码 Base64 编码的字符串
    const binaryString = atob(base64Str);

    // 第二步：将二进制字符串转换为 Uint8Array
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    // 第三步：使用 TextDecoder 将 Uint8Array 转换为 UTF-8 字符串
    const utf8Str = new TextDecoder().decode(bytes);
    return utf8Str;
}
