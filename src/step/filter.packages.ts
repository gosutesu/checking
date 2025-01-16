import { PackageInfoWithLatest, PackageInfoWithUpdate, Update } from '../lib/types.js';

const parseVersion = (version: string): { major: number; minor: number; patch: number } => {
  const [major = 0, minor = 0, patch = 0] = version
    .replace(/^[v^~]/, '') // 先頭のv, ^, ~を除去
    .split('.')
    .map(Number);
  return { major, minor, patch };
};

const compareVersions = (current: string, latest: string): Update => {
  const currentVersion = parseVersion(current);
  const latestVersion = parseVersion(latest);

  if (currentVersion.major < latestVersion.major) {
    return 'major';
  }
  if (currentVersion.major === latestVersion.major && currentVersion.minor < latestVersion.minor) {
    return 'minor';
  }
  if (
    currentVersion.major === latestVersion.major &&
    currentVersion.minor === latestVersion.minor &&
    currentVersion.patch < latestVersion.patch
  ) {
    return 'patch';
  }
  return 'none';
};

export const filterPackagesStep = async (
  latestPackageList: Array<PackageInfoWithLatest>
): Promise<Array<PackageInfoWithUpdate>> => {
  const results: Array<PackageInfoWithUpdate> = [];
  for (const record of latestPackageList) {
    const update = compareVersions(record.current, record.latest);
    if (update !== 'none') {
      results.push({
        name: record.name,
        current: record.current,
        latest: record.latest,
        update,
      });
    }
  }
  return results;
};
