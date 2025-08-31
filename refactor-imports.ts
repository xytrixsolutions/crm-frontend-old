import { Project } from 'ts-morph';
import path from 'path';

const project = new Project({
  tsConfigFilePath: 'tsconfig.json',
});

const srcPath = path.resolve(__dirname, 'src');

const sourceFiles = project.getSourceFiles('src/**/*.ts');

for (const sourceFile of sourceFiles) {
  const imports = sourceFile.getImportDeclarations();

  for (const imp of imports) {
    const moduleSpecifier = imp.getModuleSpecifierValue();

    // Only handle imports starting with 'src/'
    if (moduleSpecifier.startsWith('src/')) {
      // Absolute path of imported file
      const absoluteImportPath = path.resolve(
        srcPath,
        moduleSpecifier.substring(4),
      ); // remove 'src/'

      // Current file absolute directory
      const currentFileDir = path.dirname(sourceFile.getFilePath());

      // Calculate relative path from current file to the imported file
      let relativePath = path.relative(currentFileDir, absoluteImportPath);

      // Make sure relative paths start with './' or '../'
      if (!relativePath.startsWith('.')) {
        relativePath = './' + relativePath;
      }

      // Replace Windows backslashes with forward slashes for cross-platform compatibility
      relativePath = relativePath.replace(/\\/g, '/');

      // Update import
      imp.setModuleSpecifier(relativePath);
    }
  }

  sourceFile.saveSync();
}

project.saveSync();
