import * as React from 'react';
import * as ReactGA from 'react-ga';
import { Location } from 'history';
import { RouteComponentProps } from 'react-router-dom';

interface OwnProps {
  trackingId: string;
}

type Props = OwnProps & RouteComponentProps<{}>;

/**
 * This component is inspired by ianarundale's `Analytics` component.
 *
 * @see https://github.com/react-ga/react-ga/issues/122#issuecomment-320436578
 */
class Analytics extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    const { trackingId } = this.props;

    ReactGA.initialize(trackingId, { debug: process.env.NODE_ENV !== 'production' });
    this.sendPageview(props.location);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (
      this.props.location.pathname !== nextProps.location.pathname ||
      this.props.location.search !== nextProps.location.search
    ) {
      this.sendPageview(nextProps.location);
    }
  }

  sendPageview({ pathname, search = ''}: Location) {
    const page = pathname + search;

    ReactGA.set({ page });
    ReactGA.pageview(page);
  }

  render() {
    return null;
  }
}

export default Analytics;