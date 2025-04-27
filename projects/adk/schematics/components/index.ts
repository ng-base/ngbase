import {
  Rule,
  apply,
  mergeWith,
  move,
  applyTemplates,
  url,
  chain,
  noop,
} from '@angular-devkit/schematics';
import { strings, normalize } from '@angular-devkit/core';
import { MyGeneratorSchema } from './schema';

export function myGenerator(options: MyGeneratorSchema): Rule {
  return () => {
    if (!options.component || options.component.length === 0) {
      return noop();
    }

    const rules: Rule[] = options.component.map(comp => {
      const sourceTemplates = url(`./files/${comp}`);

      const targetPath = options.path || '';

      const sourceParametrizedTemplates = apply(sourceTemplates, [
        applyTemplates({
          ...strings,
          ...options,
          component: comp,
        }),
        move(normalize(`/${targetPath}/${comp}`)),
      ]);

      return mergeWith(sourceParametrizedTemplates);
    });

    return chain(rules);
  };
}
