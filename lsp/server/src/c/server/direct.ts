import { resolve } from 'path';
import { runCServer } from './main.js';
import { getLocalDirectory } from '../../utils/fs-utils.js';

const baseDir = resolve(getLocalDirectory(import.meta.url));
const relativeDir = '../../resource/cpp/';
runCServer(baseDir, relativeDir);