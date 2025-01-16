import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// package.jsonの型定義
export type PackageJson = {
  name: string;
  version: string;
  private?: boolean;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  workspaces?: string[];
  [key: string]: unknown;
};

/**
 * 指定されたパスのpackage.jsonを読み込む
 * @param dirPath - package.jsonが存在するディレクトリパス
 * @returns Promise<PackageJson> - パースされたpackage.jsonの内容
 * @throws Error - ファイルが存在しない、または読み込みエラーの場合
 */
export const getPackageJson = async (dirPath: string): Promise<PackageJson> => {
  try {
    const packagePath = dirPath.endsWith('package.json') ? dirPath : join(dirPath, 'package.json');
    const content = await readFile(packagePath, 'utf-8');
    return JSON.parse(content) as PackageJson;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to read package.json: ${error.message}`);
    }
    throw error;
  }
};
