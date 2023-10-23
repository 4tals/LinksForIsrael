declare module "lunr-languages/lunr.*" {
  import lunr from "lunr";

  function register(l: typeof lunr): void;

  export = register;
}

declare module "lunr-languages/lunr.stemmer.support";

import { Builder } from "lunr";

declare module "lunr" {
  function multiLanguage(...lang: string[]): Builder.Plugin;
}
