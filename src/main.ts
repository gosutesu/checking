import { Command } from 'commander';
import * as v from 'valibot';
import { execute } from './action/action.js';
import { Config, ConfigSchema } from './lib/schema.js';

const program = new Command();
program
  .name('main')
  .description('packageのlatest versionを取得して、一致しなければslackに通知します')
  .requiredOption('--target-dir <path>', 'target dir')
  .requiredOption('--webhook-url <url>', 'Slack Incoming Webhook URL')
  .action(async (options) => {
    console.debug(`action start`);
    try {
      const config = v.parse(ConfigSchema, options);
      await main(config);
    } catch (e) {
      console.error(e);
    }
    console.debug(`action end`);
  });

const main = async (config: Config): Promise<void> => {
  try {
    await execute(config);
  } catch (e) {
    console.log(e);
  }
};

program.parse();
