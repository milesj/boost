/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

// import fs from 'fs';
// import chalk from 'chalk';
// import Vorpal from 'vorpal';
// import Pipeline from './Pipeline';
//
// export default class CLI {
//   package: Object;
//   pipeline: Pipeline;
//
//   constructor(packagePath: string) {
//     if (!packagePath) {
//       throw new Error('Path to local `package.json` is required.');
//     }
//
//     const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
//     const { name, version, description } = pkg;
//
//     this.app = new Command(name);
//     this.package = pkg;
//     this.pipeline = new Pipeline(name);
//
//     // Auto-setup commander
//     this.app
//       .version(version)
//       .description(description);
//   }
// }
