/**
 * @jest-environment jsdom
 */

import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
// import { prettyDOM } from '@testing-library/dom';

import { Range } from './Range';

class ResizeObserver {
  observe() { }
  disconnect() {}
}
global.ResizeObserver = ResizeObserver;

describe('<Range /> Normal', () => {
	let component;
	const mockChangeMinHandler = jest.fn();
	const mockChangeMaxHandler = jest.fn();

	beforeEach(() => {
		component = render(
			<Range
				id={1}
				minLimit={0}
				maxLimit={100}
				min={10}
				max={70}
				onChangeMin={mockChangeMinHandler}
				onChangeMax={mockChangeMaxHandler}
			/>
		);
	});

	test('Should render', () => {
			expect(component.container).toHaveTextContent('70');
			expect(component.container).toHaveTextContent('10');
	});

	test('Should call change min event', () => {
		const labelMinValue = component.getByText('10');
		fireEvent.click(labelMinValue);
		const inputMin = component.container.querySelector('[name="min"]');
		expect(inputMin).toBeDefined();
		fireEvent.change(inputMin, {
			target: { value: 50}
		});
		fireEvent.keyDown(inputMin, { key: 'Enter', code: 'Enter' });
		//console.log(prettyDOM(component.container));
		expect(mockChangeMinHandler).toHaveBeenCalledTimes(1);
	});

	test('Should call change max event', () => {
		const labelMaxValue = component.getByText('70');
		fireEvent.click(labelMaxValue);
		const inputMax = component.container.querySelector('[name="max"]');
		expect(inputMax).toBeDefined();
		fireEvent.change(inputMax, {
			target: { value: 60}
		});
		fireEvent.keyDown(inputMax, { key: 'Enter', code: 'Enter' });
		expect(mockChangeMaxHandler).toHaveBeenCalledTimes(1);
	});

	test('Should dragging min bullet', () => {
		const minBullet = component.container.querySelector('.bullet-min');
		fireEvent.mouseDown(minBullet);
		expect(minBullet).toHaveClass('bullet--draggable');
	});

	test('Should dragging max bullet', () => {
		const maxBullet = component.container.querySelector('.bullet-max');
		fireEvent.mouseDown(maxBullet);
		expect(maxBullet).toHaveClass('bullet--draggable');
	});
});

describe('<Range /> Fixed', () => {
	let component;
	const mockChangeMinHandler = jest.fn();
	const mockChangeMaxHandler = jest.fn();

	beforeEach(() => {
		component = render(
			<Range
				id={1}
				rangeValues={[20, 40, 60, 80, 100, 120]}
				min={40}
				max={80}
				onChangeMin={mockChangeMinHandler}
				onChangeMax={mockChangeMaxHandler}
			/>
		);
	});

	test('Should render', () => {
			expect(component.container).toHaveTextContent('40');
			expect(component.container).toHaveTextContent('80');
		//componen.container.querySelector('input');
	});

	test('Should click min label not render input changable', () => {
		const labelMinValue = component.getByText('40');
		fireEvent.click(labelMinValue);
		const inputMin = component.container.querySelector('[name="min"]');
		expect(inputMin).toBeNull();
	});

	test('Should click max label not render input changable', () => {
		const labelMaxValue = component.getByText('80');
		fireEvent.click(labelMaxValue);
		const inputMax = component.container.querySelector('[name="max"]');
		expect(inputMax).toBeNull()
	});

	test('Should dragging min bullet', () => {
		const minBullet = component.container.querySelector('.bullet-min');
		fireEvent.mouseDown(minBullet);
		expect(minBullet).toHaveClass('bullet--draggable');
	});

	test('Should dragging max bullet', () => {
		const maxBullet = component.container.querySelector('.bullet-max');
		fireEvent.mouseDown(maxBullet);
		expect(maxBullet).toHaveClass('bullet--draggable');
	});
});
