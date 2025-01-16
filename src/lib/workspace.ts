import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

// TODO yarn,pnpmなどの他のパッケージマネージャー対応
const LOCK_FILE = 'package-lock.json';

/**
 * workspaceのrootを取得します
 * lock fileが存在する階層をrootと見なします
 * @param startPath - 探索を始めるパス
 * @returns Promise<string> - workspace root
 * @throws Error - 見つけられなかった場合、エラーとなります
 */
export const findWorkspaceRootPath = async (startPath: string = process.cwd()): Promise<string> => {
  let currentPath = startPath;
  while (currentPath !== '/') {
    const lockFilePath = join(currentPath, LOCK_FILE);

    if (existsSync(lockFilePath)) {
      return currentPath;
    }

    // 上位ディレクトリへ
    currentPath = dirname(currentPath);
  }

  throw new Error('Workspace root not found');
};
