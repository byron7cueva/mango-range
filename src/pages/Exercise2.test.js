import React from 'react';
import renderer from 'react-test-renderer';

import { Exercise2 } from './Exercise2';

class ResizeObserver {
  observe() { }
  disconnect() {}
}
global.ResizeObserver = ResizeObserver;

global.fetch = jest.fn(() => Promise.resolve(
  {
    json: () => Promise.resolve([
      { "id": 1, "min": 5.99, "max": 70.99, "rangeValues": [1.99, 5.99, 10.99, 30.99, 50.99, 70.99]},
      { "id": 2, "min": 10, "max": 80, "rangeValues": [10, 20, 30, 40, 50, 60, 70, 80]},
    ])
  }
));

test('Render', () => {
  const component = renderer.create(
    <Exercise2 />
  );

  expect(component).toBeTruthy();
});