import React from 'react';
import renderer from 'react-test-renderer';
import DoneTaskScreen from '../screens/handler/DoneTaskScreen';
// const DoneTaskScreen = require('../screens/handler/DoneTaskScreen')

test('renders correctly', () => {
  const tree = renderer.create(<Actions />).toJSON();
  expect(tree).toMatchSnapshot();
}); 