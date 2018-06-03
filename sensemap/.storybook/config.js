import { configure, addDecorator } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import 'semantic-ui-css/semantic.min.css';

// automatically import all files ending in *.stories.js
const req = require.context('../src', true, /.stories.tsx$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}
addDecorator((story, context) => withInfo('')(story)(context));
configure(loadStories, module);
