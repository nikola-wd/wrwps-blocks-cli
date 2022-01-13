import chalk from 'chalk';
import { createBlock } from './main';

function parseArgumentsIntoOptions(rawArgs) {
  const new_block_name = process.argv[2];

  if (!new_block_name) {
    console.error(
      '%s Write a block name in this format: block-name-here',
      chalk.red.bold('ERROR')
    );
    return false;
  }

  // TODO: check if the block with the same name exists here and return if so

  return new_block_name;
}

export async function cli(args) {
  let block_name = parseArgumentsIntoOptions(args);

  if (block_name) {
    await createBlock(block_name);
  }
}
