import React from 'react';
import render from 'react-test-renderer';

import { NormalRange } from './NormalRange';

class ResizeObserver {
  observe() { }
  disconnect() {}
}
global.ResizeObserver = ResizeObserver;

test('Render NormalRange', () => {
  const component = render.create(
    <NormalRange />
  );

  expect(component).toBeTruthy();
});