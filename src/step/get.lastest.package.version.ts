import { fetchLatestPackageVersion } from '../lib/registry.js';
import { PackageInfo, PackageInfoWithLatest } from '../lib/types.js';

/**
 * npm registryにpackageの最新のバージョンを問い合わせます
 * @param packageInfoList 問い合わせるパッケージ一覧
 */
export const getLatestPackageVersionStep = async (
  packageInfoList: Array<PackageInfo>
): Promise<Array<PackageInfoWithLatest>> => {
  const records: Array<PackageInfoWithLatest> = [];

  for (const packageInfo of packageInfoList) {
    const latest = await fetchLatestPackageVersion(packageInfo.name);
    records.push({
      name: packageInfo.name,
      current: packageInfo.current,
      latest,
    });
  }

  return records;
};
