import { IncomingWebhook } from '@slack/webhook';
import { Config } from '../lib/schema.js';
import { PackageInfoWithUpdate } from '../lib/types.js';

const createHeaderBlock = (name: string) => ({
  type: 'header',
  text: {
    type: 'plain_text',
    text: `📦 ${name} パッケージアップデート通知`,
    emoji: true,
  },
});

const createContextBlock = (totalCount: number) => ({
  type: 'context',
  elements: [
    {
      type: 'mrkdwn',
      text: `更新が必要なパッケージ: ${totalCount}個`,
    },
  ],
});

const createDividerBlock = () => ({
  type: 'divider',
});

const createUpdateTypeSection = (type: string, emoji: string) => ({
  type: 'section',
  text: {
    type: 'mrkdwn',
    text: `${emoji} *${type}* アップデート`,
  },
});

const createPackageSection = (pkg: PackageInfoWithUpdate) => ({
  type: 'section',
  text: {
    type: 'mrkdwn',
    text: `*${pkg.name}*\n\`${pkg.current}\` → \`${pkg.latest}\``,
  },
  accessory: {
    type: 'button',
    text: {
      type: 'plain_text',
      text: 'npmjs.com',
      emoji: true,
    },
    url: `https://www.npmjs.com/package/${pkg.name}`,
    action_id: 'button-action',
  },
});

export const notifySlackStep = async (
  config: Config,
  name: string,
  packages: Array<PackageInfoWithUpdate>,
): Promise<void> => {
  const webhook = new IncomingWebhook(config.webhookUrl);

  if (packages.length === 0) {
    await webhook.send({
      blocks: [
        createHeaderBlock(name),
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '✨ アップデートが必要なパッケージはありません',
          },
        },
      ],
    });
    return;
  }

  const majorUpdates = packages.filter((pkg) => pkg.update === 'major');
  const minorUpdates = packages.filter((pkg) => pkg.update === 'minor');
  const patchUpdates = packages.filter((pkg) => pkg.update === 'patch');

  const blocks = [createHeaderBlock(name), createContextBlock(packages.length), createDividerBlock()];

  if (majorUpdates.length > 0) {
    blocks.push(
      createUpdateTypeSection('MAJOR', '🔴'),
      ...majorUpdates.map(createPackageSection),
      createDividerBlock(),
    );
  }

  if (minorUpdates.length > 0) {
    blocks.push(
      createUpdateTypeSection('MINOR', '🟡'),
      ...minorUpdates.map(createPackageSection),
      createDividerBlock(),
    );
  }

  if (patchUpdates.length > 0) {
    blocks.push(
      createUpdateTypeSection('PATCH', '🟢'),
      ...patchUpdates.map(createPackageSection),
      createDividerBlock(),
    );
  }

  await webhook.send({
    blocks,
  });
};
