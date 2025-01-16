export type PackageInfo = {
  name: string;
  current: string;
};

export type PackageInfoWithLatest = {
  name: string;
  current: string;
  latest: string;
};

export type Update = 'none' | 'major' | 'minor' | 'patch';

export type PackageInfoWithUpdate = {
  name: string;
  current: string;
  latest: string;
  update: Update;
};
