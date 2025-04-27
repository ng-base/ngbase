import {
  Rule,
  apply,
  mergeWith,
  move,
  applyTemplates,
  url,
  chain,
  noop,
  Tree,
} from '@angular-devkit/schematics';
import { strings, normalize } from '@angular-devkit/core';
import { MyGeneratorSchema } from './schema';

function readConfigFile(tree: Tree): Partial<MyGeneratorSchema> {
  const configPath = 'ngbase.config.json';
  if (tree.exists(configPath)) {
    const buffer = tree.read(configPath);
    if (buffer) {
      try {
        const content = JSON.parse(buffer.toString());
        return content;
      } catch (error) {
        console.warn(`⚠️ Failed to parse ${configPath}:`, error);
      }
    }
  }
  return {};
}

export function myGenerator(options: MyGeneratorSchema): Rule {
  return (tree: Tree) => {
    const config = readConfigFile(tree);
    const finalOptions = { ...config, ...options };

    if (!options.component || options.component.length === 0) {
      return noop();
    }

    const rules: Rule[] = options.component.map(comp => {
      const sourceTemplates = url(`./files/${comp}`);

      const targetPath = options.path || '';

      const sourceParametrizedTemplates = apply(sourceTemplates, [
        applyTemplates({
          ...strings,
          ...finalOptions,
          component: comp,
        }),
        move(normalize(`/${targetPath}/${comp}`)),
      ]);

      return mergeWith(sourceParametrizedTemplates);
    });

    return chain(rules);
  };
}
