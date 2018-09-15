import * as React from 'react';
import gtmParts from 'react-google-tag-manager';

interface Props {
  gtmId?: string;
  dataLayerName?: string;
  scriptId?: string;
  // tslint:disable-next-line:no-any
  additionalEvents?: any;
  previewVariables?: boolean;
  scheme?: string;
}

interface DefaultProps {
  gtmId: string;
  dataLayerName: string;
  scriptId: string;
  // tslint:disable-next-line:no-any
  additionalEvents: any;
  previewVariables: boolean;
  scheme: string;
}

type PropsWithDefaults = Props & DefaultProps;

class GoogleTagManager extends React.Component<Props> {
  static defaultProps: DefaultProps = {
    gtmId: '',
    dataLayerName: 'dataLayer',
    scriptId: 'react-google-tag-manager-gtm',
    additionalEvents: {},
    previewVariables: false,
    scheme: 'https:',
  };

  componentDidMount() {
    if (!this.props.gtmId) { return; }

    const { dataLayerName, scriptId } = this.props as PropsWithDefaults;

    if (!window[dataLayerName]) {
      const gtmScriptNode = document.getElementById(scriptId);
      if (gtmScriptNode && gtmScriptNode.textContent) {
        // tslint:disable-next-line:no-eval
        eval(gtmScriptNode.textContent);
      }
    }
  }

  render() {
    const {
      gtmId: id,
      dataLayerName,
      scriptId,
      additionalEvents,
      previewVariables,
      scheme
    } = this.props as PropsWithDefaults;

    // failed silently
    if (!id) { return null; }

    const gtm = gtmParts({ id, dataLayerName, additionalEvents, previewVariables, scheme });

    return (
      <div>
        <div>{gtm.noScriptAsReact()}</div>
        <div id={scriptId}>{gtm.scriptAsReact()}</div>
      </div>
    );
  }
}

export default GoogleTagManager;