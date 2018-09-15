declare module 'react-google-tag-manager' {
  import * as React from 'react';

  interface GTMArgs {
    id: string;
    dataLayerName?: string;
    // tslint:disable-next-line:no-any
    additionalEvents?: any;
    scheme?: string;
    previewVariables?: boolean;
  }

  interface RenderResults {
    noScriptAsReact(): React.ReactNode;
    noScriptAsHTML(): string;
    scriptAsReact(): React.ReactNode;
    scriptAsHTML(): string;
  }

  function GTMParts(args: GTMArgs): RenderResults;

  export default GTMParts;
}
