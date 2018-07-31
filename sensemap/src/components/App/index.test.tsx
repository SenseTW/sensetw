import * as React from 'react';
import { configure, shallow } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import App from './index';

configure({ adapter: new Adapter() });

function setup() {
  const enzymeWrapper = shallow(<App checked={true} authenticated={false} user={{}} />);
  return { enzymeWrapper };
}

describe('components', () => {
  describe('App', () => {
    it('should render self without any error', () => {
      const { enzymeWrapper } = setup();

      expect(enzymeWrapper.find('div').hasClass('App')).toBe(true);
    });
  });
});
