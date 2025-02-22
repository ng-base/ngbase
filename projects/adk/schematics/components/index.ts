import {
  Rule,
  apply,
  mergeWith,
  move,
  applyTemplates,
  url,
  chain,
} from '@angular-devkit/schematics';
import { strings, normalize } from '@angular-devkit/core';
import { MyGeneratorSchema } from './schema';

export function myGenerator(options: MyGeneratorSchema): Rule {
  return () => {
    const sourceTemplates = url(`./files/${options.component}`);

    const targetPath = options.path || '';

    const sourceParametrizedTemplates = apply(sourceTemplates, [
      applyTemplates({
        ...strings,
        ...options,
      }),
      move(normalize(`/${targetPath}/${options.component}`)),
    ]);

    return chain([mergeWith(sourceParametrizedTemplates)]);
  };
}
