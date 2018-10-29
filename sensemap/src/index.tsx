import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './containers/App';
import registerServiceWorker from './registerServiceWorker';
import 'semantic-ui-css/semantic.min.css';
import './index.css';

// initial the data layer for Google Tag Manager
// tslint:disable-next-line:no-any
const w: any = window;
if (w && !w.dataLayer) {
  w.dataLayer = [];
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
