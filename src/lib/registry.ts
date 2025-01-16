// TODO 環境変数にしてPrivate registry対応とかしてもいいかも
const REGISTRY_URL = 'https://registry.npmjs.org';

const fetchRegistry = async (url: string): Promise<any> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch from npm registry: ${error.message}`);
    }
    throw new Error('Failed to fetch from npm registry');
  }
};

export const fetchLatestPackageVersion = async (name: string): Promise<string> => {
  const result = await fetchRegistry(`${REGISTRY_URL}/${name}/latest`);
  return result.version;
};
