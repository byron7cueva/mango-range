import { BaseRange, rangeLogicHoc } from './BaseRange';

/**
 * Fixed number of options range
 * The component CAN'T be a HTML5 input range. It has to be a custom one
 */
export const FixedRange = rangeLogicHoc(BaseRange, {
  onResizeObserver(self) {
    const steps = self.props.rangeValues.length - 1;
    self.widthStep = self.width / steps;
    const stepsPosition = [];
    self.props.rangeValues.forEach((value, i) => {
      const position = i * self.widthStep;
      let max = position + self.widthStep / 2;
      let min = position - self.widthStep / 2;
      min = min < 0? 0 : min;
      max = max > self.width? self.width : max;
      stepsPosition.push({position, min, max});
    });
    // Given a range of values the user will only be able to select those values in range
    const positionsMin = stepsPosition.map((pos, i) => ({
      value: self.props.rangeValues[i], ...pos
    }));
    const positionsMax = stepsPosition.reverse().map((pos, i) => ({
      value: self.props.rangeValues[i], ...pos
    }));
    self.setState({positionsMin, positionsMax});
    self.calculatePositionPullet(); 
  }, 
  onCalculatePositionPullet(self) {
    const min = self.state.positionsMin.find(pos => pos.value === self.props.min);
    self.rangeAreaMinRef.current.style.width = `${min.position}px`;
    const max = self.state.positionsMax.find(pos => pos.value === self.props.max);
    self.rangeAreaMaxRef.current.style.width = `${max.position}px`; 
  },
  calculateMin(self, posX) {
    const position = self.state.positionsMin.find(pos => posX >= pos.min && posX <= pos.max);
    return position.value;
  },
  calculateMax(self, posX)  {
    const position = self.state.positionsMax.find(pos => posX >= pos.min && posX <= pos.max);
    return position.value;
  },
  onMouseUp(self) {
    self.calculatePositionPullet();
  }
});