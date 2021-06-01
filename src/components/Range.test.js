import React from 'react';
import render from 'react-test-renderer';

import { Range } from './Range';

class ResizeObserver {
  observe() { }
  disconnect() {}
}
global.ResizeObserver = ResizeObserver;

test('Render NormalRange', () => {
  const component = render.create(
    <Range />
  );

  expect(component).toBeTruthy();
});