#!/usr/bin/env node

import chalk from "chalk";
import inquirer from "inquirer";
import chalkAnimation from "chalk-animation";
import fs from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import createDirectoryContents from "./createDirectoryContents.js";
import ora from "ora";
import fsExtra from "fs-extra";

const CURR_DIR = process.cwd();
const __dirname = dirname(fileURLToPath(import.meta.url));
const CHOICES = fs.readdirSync(`${__dirname}/templates`);
const COMPONENTS_DIR = `${__dirname}/components`;

const sleep = (ms = 900) => new Promise((resolve) => setTimeout(resolve, ms));
const sleepSeconds = (seconds = 1) =>
  new Promise((resolve) => setTimeout(resolve, seconds * 1000));

async function welcome() {
  const rainbowTitle = chalkAnimation.pulse(
    "Welcome to pjtoolkit! Let your creations start here.\n"
  );

  await sleep();
  rainbowTitle.stop();
}

const QUESTIONS = [
  {
    name: "creation-choice",
    type: "list",
    message: "What would you like to create?",
    choices: ["Template", "Commands"],
  },
  {
    name: "project-choice",
    type: "list",
    message: "What template would you like to use?",
    choices: CHOICES,
    when: (answers) => answers["creation-choice"] === "Template",
  },
  {
    name: "project-name",
    type: "input",
    message: "Project name:",
    validate: function (input) {
      if (/^([A-Za-z\-\\_\d])+$/.test(input)) return true;
      else
        return "Project name may only include letters, numbers, underscores, and dashes.";
    },
    when: (answers) => answers["creation-choice"] === "Template",
  },
  {
    name: "add-component",
    type: "confirm",
    message: "Would you like to add a command to your project?",
    default: true,
    when: (answers) => answers["creation-choice"] === "Commands",
  },
  {
    name: "component-choice",
    type: "list",
    message: "Select a command to add:",
    choices: fs.readdirSync(COMPONENTS_DIR),
    when: (answers) => answers["add-component"],
  },
  {
    name: "component-folder",
    type: "list",
    message: "Select the folder for the command:",
    choices: ["default", "admin", "developer"],
    when: (answers) => answers["add-component"],
  },
];

console.clear();
await welcome();
await sleepSeconds();

inquirer.prompt(QUESTIONS).then(async (answers) => {
  if (answers["creation-choice"] === "Template") {
    const spinner = ora("Creating Template...").start();

    const projectChoice = answers["project-choice"];
    const projectName = answers["project-name"];
    const templatePath = `${__dirname}/templates/${projectChoice}`;
    const projectPath = `${CURR_DIR}/${projectName}`;

    try {
      fs.mkdirSync(projectPath);
      createDirectoryContents(templatePath, projectName, CURR_DIR);
      await sleepSeconds(2);
      spinner.succeed("Template created successfully!");
      console.log(chalk.yellow(`Project path: ${projectPath}`));
    } catch (error) {
      handleError(error, projectName, "Template");
      spinner.stop();
    }
  } else if (answers["creation-choice"] === "Commands") {
    if (answers["add-component"]) {
      const spinner = ora("Adding Command...").start();
      const componentChoice = answers["component-choice"];
      const componentFolderPath = join(
        CURR_DIR,
        "commands",
        answers["component-folder"]
      );
      const componentFilePath = join(componentFolderPath, `${componentChoice}`);

      try {
        fsExtra.copySync(
          `${COMPONENTS_DIR}/${componentChoice}`,
          componentFilePath
        );
        spinner.succeed("Command added successfully!");
      } catch (error) {
        handleError(error, componentChoice, "Components");
        spinner.stop();
      }
    } else {
      console.log("No command added.");
    }
  }
});

function handleError(error, projectName, FunctionName) {
  if (error.code === "EEXIST") {
    console.error(
      chalk.red(
        `\ Error: The file or directory '${projectName}' already exists.`
      )
    );
  } else {
    console.error(
      chalk.red(
        ` An error occurred while creating the ${FunctionName}: ${error.message}`
      )
    );
  }
}
