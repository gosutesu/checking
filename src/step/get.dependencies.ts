import { glob } from 'glob';
import { getPackageJson, PackageJson } from '../lib/package.js';
import { PackageInfo } from '../lib/types.js';

export const getDependenciesStep = async (rootDir: string): Promise<Array<PackageInfo>> => {
  const originPackages: Array<PackageInfo> = [];
  const selfPackage: Array<string> = [];

  const rootPackageJson = await getPackageJson(rootDir);
  selfPackage.push(rootPackageJson.name);
  originPackages.push(...getDependenciesAndDevDependencies(rootPackageJson));
  if (rootPackageJson.workspaces) {
    // workspaceのpackage.jsonのパスを一覧で取得しています
    const workspaces = (
      await Promise.all(rootPackageJson.workspaces.map((workspace) => glob(`${rootDir}/${workspace}/package.json`)))
    ).flat();

    for (const workspace of workspaces) {
      const packageJson = await getPackageJson(workspace);
      selfPackage.push(packageJson.name);
      originPackages.push(...getDependenciesAndDevDependencies(packageJson));
    }
  }
  const filteredPackages = originPackages
    .filter((i) => !selfPackage.includes(i.name)) // 自前のパッケージを除外
    .filter(
      (element, index, arr) =>
        arr.findIndex((item) => item.name === element.name && item.current === element.current) === index
    )
    .sort((a, b) => a.name.localeCompare(b.name));
  return filteredPackages;
};

const getDependenciesAndDevDependencies = (packageJson: PackageJson): Array<PackageInfo> => {
  const packages: Array<PackageInfo> = [];
  if (packageJson.dependencies) {
    for (const [key, value] of Object.entries(packageJson.dependencies)) {
      packages.push({
        name: key,
        current: value,
      });
    }
  }
  if (packageJson.devDependencies) {
    for (const [key, value] of Object.entries(packageJson.devDependencies)) {
      packages.push({
        name: key,
        current: value,
      });
    }
  }
  return packages;
};
