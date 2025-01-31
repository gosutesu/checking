import { getPackageJson } from '../lib/package.js';
import { Config } from '../lib/schema.js';
import { findWorkspaceRootPath } from '../lib/workspace.js';
import { filterPackagesStep } from '../step/filter.packages.js';
import { getDependenciesStep } from '../step/get.dependencies.js';
import { getLatestPackageVersionStep } from '../step/get.lastest.package.version.js';
import { notifySlackStep } from '../step/notify.slack.js';

export const execute = async (config: Config) => {
  const root = await findWorkspaceRootPath(config.targetDir);
  const rootPackageJson = await getPackageJson(root);
  const list = await getDependenciesStep(root, rootPackageJson);
  const listWithLatest = await getLatestPackageVersionStep(list);
  const listWithUpdate = await filterPackagesStep(listWithLatest);
  await notifySlackStep(config, rootPackageJson.name, listWithUpdate);
};
