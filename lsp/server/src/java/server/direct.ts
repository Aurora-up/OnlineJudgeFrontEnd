import { resolve } from 'path';
import { runJavaServer } from './main.js';
import { getLocalDirectory } from '../../utils/fs-utils.js';

const baseDir = resolve(getLocalDirectory(import.meta.url));
const relativeDir = '../../resource/java';
runJavaServer(baseDir, relativeDir);