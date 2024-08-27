import { VueCompilerSFCInstance as VueCompilerSFC } from "../../vue3/compiler-sfc.global.js";
const generateTemplate = (id, source, hasScoped, dataVId) => {
  const template = VueCompilerSFC.compileTemplate({
    id: id,
    source: source,
    scoped: hasScoped,
    compilerOptions: {
      scopeId: hasScoped ? dataVId : undefined,
    },
  });
  return template;
};

export { generateTemplate };
