import React from 'react';
import renderer from 'react-test-renderer';

import { Exercise1 } from './Exercise1';

class ResizeObserver {
  observe() { }
  disconnect() {}
}
global.ResizeObserver = ResizeObserver;

global.fetch = jest.fn(() => Promise.resolve(
  {
    json: () => Promise.resolve([
      { "id": 1, "minLimit": 0, "maxLimit": 100, "min": 20, "max": 50},
      { "id": 2, "minLimit": 50, "maxLimit": 80, "min": 55, "max": 70}
    ])
  }
));

test('Render', () => {
  const component = renderer.create(
    <Exercise1 />
  );

  expect(component).toBeTruthy();
});