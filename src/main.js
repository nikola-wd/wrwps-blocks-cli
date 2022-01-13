import chalk from 'chalk';
import fs from 'fs';
import ncp from 'ncp';
import path from 'path';
import { promisify } from 'util';

const copy = promisify(ncp);

async function copyTemplateFiles(options) {
  return copy(options.templateDirectory, options.targetDirectory, {
    clobber: false,
  });
}

export async function createBlock(block_name) {
  const theme_root_dir = process.cwd();

  const block_template = path.resolve(
    new URL(theme_root_dir).pathname,
    'blocks_framework/src/blocks',
    'new-block-setup'
  );

  const new_block_dir = path.resolve(
    new URL(theme_root_dir).pathname,
    'blocks_framework/src/blocks',
    block_name
  );

  const options = {
    templateDirectory: block_template,
    targetDirectory: new_block_dir,
  };

  console.log('Creating a new block...');

  // Copying the dir
  await copyTemplateFiles(options);

  // RENAMING THE CLASSNAME IN THE SCSS FILE
  const scss_file_content = `
.editor-styles-wrapper {
  .wp-block-quanterix-${block_name} {
    background: #f2edf5;
  }
}
  `;
  const data = new Uint8Array(Buffer.from(scss_file_content));
  fs.writeFile(new_block_dir + '/editor.scss', data, (err) => {
    if (err) throw err;
  });

  // ADJUSTING THE model.json
  const modelFile = new_block_dir + '/model.json';
  const model_obj = require(modelFile);
  model_obj.block_meta.BLOCK_REGISTER_NAME = block_name;
  const block_readable_name = block_name
    .split('-')
    .map((word) => {
      const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1);
      return capitalizedWord;
    })
    .join(' ');
  model_obj.block_meta.BLOCK_TITLE = block_readable_name;

  // replace stuff in model.json
  fs.writeFile(
    modelFile,
    JSON.stringify(model_obj, null, 2),
    function writeJSON(err) {
      if (err) return console.log(err);
    }
  );

  console.log('%s New Block Ready', chalk.green.bold('DONE'));
  return true;
}
