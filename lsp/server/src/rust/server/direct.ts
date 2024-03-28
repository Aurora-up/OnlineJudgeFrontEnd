import { resolve } from 'path';
import { runRustServer } from './main.js';
import { getLocalDirectory } from '../../utils/fs-utils.js';

const baseDir = resolve(getLocalDirectory(import.meta.url));
const relativeDir = '../../resource/rust/';
runRustServer(baseDir, relativeDir);