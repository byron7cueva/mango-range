import { BaseRange, rangeLogicHoc } from './BaseRange';

/**
 * Normal range from min to max number
 * The component CAN'T be a HTML5 input range. It has to be a custom one
 */
export const NormalRange = rangeLogicHoc(BaseRange, {
  onResizeObserver(self) { 
    const steps = self.props.maxLimit - self.props.minLimit;
    self.widthStep = self.width / steps;
    self.calculatePositionPullet();
  },
  onCalculatePositionPullet(self) {
    self.rangeAreaMinRef.current.style.width = `${self.widthStep * (parseInt(self.props.min) - self.props.minLimit)}px`;
    self.rangeAreaMaxRef.current.style.width = `${self.width - (self.widthStep * (parseInt(self.props.max) - self.props.minLimit))}px`;
  },
  calculateMin(self, widthRange) {
    const value = (widthRange / self.widthStep + self.props.minLimit).toFixed(2);
    return value < self.props.minLimit? self.props.minLimit : value; 
  },
  calculateMax(self, widthRange) {
    const value = (self.props.maxLimit - (widthRange / self.widthStep)).toFixed(2);
    return value > self.props.maxLimit? self.props.maxLimit : value; 
  },
  onMouseUp() {}
});