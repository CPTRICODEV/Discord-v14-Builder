#!/usr/bin/env node


import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import { createSpinner } from 'nanospinner';
import * as fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import createDirectoryContents from './createDirectoryContents.js';
const CURR_DIR = process.cwd();
const __dirname = dirname(fileURLToPath(import.meta.url));

const CHOICES = fs.readdirSync(`${__dirname}/templates`);

const sleep = (ms = 900) => new Promise((r) => setTimeout(r, ms));
const sleeps = (ms = 1000) => new Promise((r) => setTimeout(r, ms));

async function welcome() {
  const rainbowTitle = chalkAnimation.rainbow('Welcome to CT-Builder! Your creations starts here. \n')

  await sleep();
  rainbowTitle.stop();
}

const QUESTIONS = [
  {
    name: 'project-choice',
    type: 'list',
    message: 'What template would you like to use?',
    choices: CHOICES,
  },
  {
    name: 'project-name',
    type: 'input',
    message: 'Project name:',
    validate: function (input) {
      if (/^([A-Za-z\-\\_\d])+$/.test(input)) return true;
      else return 'Project name may only include letters, numbers, underscores and hashes.';
    },
  },
];

console.clear();
await welcome()
await sleeps();
inquirer.prompt(QUESTIONS).then(answers => {
  const spinner = createSpinner('Creating Template...').start();

  const projectChoice = answers['project-choice'];
  const projectName = answers['project-name'];
  const templatePath = `${__dirname}/templates/${projectChoice}`;

  fs.mkdirSync(`${CURR_DIR}/${projectName}`);

  createDirectoryContents(templatePath, projectName);
  spinner.success({ text: `Thx for using CT-Builder. \nYour Template is done, just use the "npm run start" in your project to start!` });
});