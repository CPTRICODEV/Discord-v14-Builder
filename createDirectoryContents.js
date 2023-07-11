import * as fs from "fs";
import { join } from "path";

const createDirectoryContents = (templatePath, newProjectPath, currDir) => {
  const filesToCreate = fs.readdirSync(templatePath);

  filesToCreate.forEach((file) => {
    const origFilePath = join(templatePath, file);

    // get stats about the current file
    const stats = fs.statSync(origFilePath);

    if (stats.isFile()) {
      const contents = fs.readFileSync(origFilePath, "utf8");

      // Rename
      if (file === ".npmignore") {
        file = ".gitignore";
      }

      const writePath = join(currDir, newProjectPath, file);

      try {
        fs.writeFileSync(writePath, contents, "utf8");
      } catch (error) {
        throw new Error(`Error writing file '${file}': ${error.message}`);
      }
    } else if (stats.isDirectory()) {
      const newDirectoryPath = join(currDir, newProjectPath, file);

      try {
        fs.mkdirSync(newDirectoryPath);
        createDirectoryContents(
          join(templatePath, file),
          join(newProjectPath, file),
          currDir
        );
      } catch (error) {
        throw new Error(`Error creating directory '${file}': ${error.message}`);
      }
    }
  });
};

export default createDirectoryContents;
