import React, { Component } from 'react';

export class FixedRange extends Component {

  constructor(props) {
    super(props);
    this.state = {
      positionsMin: [],
      positionsMax: []
    };
    this.rangeLineRef = React.createRef();
    this.rangeAreaMinRef = React.createRef();
    this.rangeAreaMaxRef = React.createRef();
    this.minInputRef = React.createRef();
    this.maxInputRef = React.createRef();
    this.width = 0;
    this.widthStep = 0;
    this.pulletToMove = null;
    this.resizeObserver = null;
  }

  componentDidMount() {
   this.resizeObserver = new ResizeObserver(resizeEntity => {
      this.width = resizeEntity[0].target.clientWidth;
      this.steps = this.props.rangeValues.length;
      this.widthStep = this.width / this.steps; 
      const stepsPosition = [];
      this.props.rangeValues.forEach((value, i) => {
        const position = i * this.widthStep;
        let max = position + this.widthStep / 2;
        let min = position - this.widthStep / 2;
        min = min < 0? 0 : min;
        max = max > this.width? this.width : max;
        stepsPosition.push({position, min, max});
      });
      const positionsMin = stepsPosition.map((pos, i) => ({
        value: this.props.rangeValues[i], ...pos
      }));
      const positionsMax = stepsPosition.reverse().map((pos, i) => ({
        value: this.props.rangeValues[i], ...pos
      }));
      this.setState({positionsMin, positionsMax});
      this.calculatePositionPullet();
    });
    this.resizeObserver.observe(this.rangeLineRef.current);
  }

  componentWillUnmount() {
    this.resizeObserver.disconnect();
  }

  onMouseDownHandler = (event) => {
    this.pulletToMove = event.target;
    this.pulletToMove.classList.toggle("bullet--draggable");
    this.rangeLineRef.current.parentElement.classList.toggle("range__content--dragable");
  }

  onMouseUpHandler = () => {
    if (this.pulletToMove !== null) {
      this.calculatePositionPullet();
      this.pulletToMove.classList.toggle("bullet--draggable")
      this.rangeLineRef.current.parentElement.classList.toggle("range__content--dragable");
      this.pulletToMove = null;
    }
  }

  onMouseMoveHandler = (event) => {
    if (this.pulletToMove !== null) {
      const rangeToMove = this.pulletToMove.parentElement;
      const { offsetLeft, clientWidth } = this.rangeLineRef.current;
      let widthRange;
      const { name } = rangeToMove.dataset;
      const { clientWidth: posX } = rangeToMove;
      if (name === "min") {
        widthRange = event.clientX - offsetLeft;
        widthRange = (widthRange > this.width? this.width : widthRange);
        const position = this.state.positionsMin.find(pos => posX >= pos.min && posX <= pos.max);
        if (position && position.value < this.props.max) {
          this.props.onChangeMin(position.value, this.props.id);
        }
      } else {
        widthRange = offsetLeft + clientWidth - event.clientX;
        widthRange = (widthRange > this.width? this.width : widthRange);
        const position = this.state.positionsMax.find(pos => posX >= pos.min && posX <= pos.max);
        if (position && position.value > this.props.min) {
          this.props.onChangeMax(position.value, this.props.id);
        }
      }
      rangeToMove.style.width = `${widthRange}px`;  
    }
  }

  calculatePositionPullet() {
    const min = this.state.positionsMin.find(pos => pos.value === this.props.min);
    this.rangeAreaMinRef.current.style.width = `${min.position}px`;
    const max = this.state.positionsMax.find(pos => pos.value === this.props.max);
    this.rangeAreaMaxRef.current.style.width = `${max.position}px`;
  }

  render() {
    const { min, max } = this.props;
    return (
      <div className="range">
        <div className="range__value range__value-min">
          {/* For this type of range, currency values are not input changable. They have to be only a label */}
          <span data-name="min">{min}</span> $
        </div>
        { /* The component CAN'T be a HTML5 input range. It has to be a custom one */ }
        <div className="range__content" onMouseUp={this.onMouseUpHandler} onMouseLeave={this.onMouseUpHandler} onMouseMove={this.onMouseMoveHandler}>
          <div className="range__line" ref={this.rangeLineRef}>
            <div className="range__area range__area-min" ref={this.rangeAreaMinRef} data-name="min">
              {/* The user can drag two bullets through the range line */}
              <div
                className="bullet bullet-min"
                onMouseDown={this.onMouseDownHandler}
                >
              </div>
            </div>
            <div className="range__area range__area-max" ref={this.rangeAreaMaxRef} data-name="max">
              {/* The user can drag two bullets through the range line */}
              <div className="bullet bullet-max"
              onMouseDown={this.onMouseDownHandler}></div>
            </div>
          </div>
        </div>
        <div className="range__value range__value-max">
          {/* For this type of range, currency values are not input changable. They have to be only a label */}
          <span data-name="max">{max}</span> $
        </div>
      </div>
    )
  } 
}