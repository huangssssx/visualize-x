import { VueCompilerSFCInstance as VueCompilerSFC } from "../../vue3/compiler-sfc.global.js";
const generateScript = (id, descriptor, hasScoped, dataVId) => {
  var script = VueCompilerSFC.compileScript(descriptor, {
    id: id,
    templateOptions: {
      scoped: hasScoped,
      compilerOptions: {
        scopeId: hasScoped ? dataVId : undefined,
      },
    },
  });

  return script;
};

export { generateScript };
