import React from 'react';
import render from 'react-test-renderer';

import { FixedRange } from './FixedRange';

class ResizeObserver {
  observe() { }
  disconnect() {}
}
global.ResizeObserver = ResizeObserver;

test('Render FixedRange', () => {
  const component = render.create(
    <FixedRange />
  );

  expect(component).toBeTruthy();
});