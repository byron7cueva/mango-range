import React, { Component } from 'react';

/**
 * Normal range from min to max number
 * The component CAN'T be a HTML5 input range. It has to be a custom one
 */
export class Range extends Component {

  constructor(props) {
    super(props);
    this.state = {
      minEditable: false,
      maxEditable: false,
      positionsMin: [],
      positionsMax: []
    }
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
      if (this.props.rangeValues) {
        this.resizeObserverFixed();
      } else {
        this.resizeObserverNormal();
      }
    });
    this.resizeObserver.observe(this.rangeLineRef.current);
  }

  resizeObserverFixed() {
    const steps = this.props.rangeValues.length - 1;
    this.widthStep = this.width / steps;
    const stepsPosition = [];
    this.props.rangeValues.forEach((value, i) => {
      const position = i * this.widthStep;
      let max = position + this.widthStep / 2;
      let min = position - this.widthStep / 2;
      min = min < 0? 0 : min;
      max = max > this.width? this.width : max;
      stepsPosition.push({position, min, max});
    });
    // Given a range of values the user will only be able to select those values in range
    const positionsMin = stepsPosition.map((pos, i) => ({
      value: this.props.rangeValues[i], ...pos
    }));
    const positionsMax = stepsPosition.reverse().map((pos, i) => ({
      value: this.props.rangeValues[i], ...pos
    }));
    this.setState({positionsMin, positionsMax});
    this.calculatePositionPullet(); 
  }

  resizeObserverNormal() { 
    const steps = this.props.maxLimit - this.props.minLimit;
    this.widthStep = this.width / steps;
    this.calculatePositionPullet();
  }

  componentWillUnmount() {
    this.resizeObserver.disconnect();
  }

  onMouseDownHandler = (event) => {
    this.pulletToMove = event.target;
    // Dragging a bullet turns cursor to dragging
    this.pulletToMove.classList.add("bullet--draggable");
    this.rangeLineRef.current.parentElement.classList.add("range__content--dragable");
  }

  onMouseUpHandler = () => {
    if (this.pulletToMove !== null) {
      this.pulletToMove.classList.remove("bullet--draggable")
      this.rangeLineRef.current.parentElement.classList.remove("range__content--dragable");
      this.pulletToMove = null;
      if (this.props.rangeValues) {
        this.calculatePositionPullet();
      }
    }
  }

  onMouseMoveHandler = (event) => {
    if (this.pulletToMove !== null) {
      const rangeToMove = this.pulletToMove.parentElement;
      const { offsetLeft, clientWidth } = this.rangeLineRef.current;
      const { name } = rangeToMove.dataset;
      let widthRange;
      let value;
      if (name === "min") {
        widthRange = event.clientX - offsetLeft;
        widthRange = (widthRange > this.width? this.width : widthRange);
        value = this.calculateMin(widthRange);
        // Min value and max value can't be crossed in range
        if (value >= this.props.max) {
          return;
        }
        this.props.onChangeMin(value, this.props.id);
      } else {
        widthRange = offsetLeft + clientWidth - event.clientX;
        widthRange = (widthRange > this.width? this.width : widthRange);
        value = this.calculateMax(widthRange);
        // Min value and max value can't be crossed in range
        if (value <= this.props.min) {
          return;
        }
        this.props.onChangeMax(value, this.props.id);
      }
      rangeToMove.style.width = `${widthRange}px`;
      const input = this[`${name}InputRef`].current;
      if (input !== null) {
        input.value = value;
      }
    }
  }

  onKeyDownHandler = (event) => {
    if (event.key === 'Enter') {
      const { name, value } = event.target;
      const numberValue = parseInt(value);
      // The value will never be less than min or greater than max input values.
      if (numberValue < this.props.minLimit || numberValue > this.props.maxLimit
        || (name === 'min' && numberValue >= this.props.max )
        || (name === 'max' && numberValue <= this.props.min)) {
        event.target.value = this.props[name];
        return;
      }

      if (name === "min") {
        this.props.onChangeMin(value, this.props.id);
      } else {
        this.props.onChangeMax(value, this.props.id);
      }

      this.setState({
        [`${name}Editable`]: false
      }, () => {
        this.calculatePositionPullet();
      });
    }
  }

  onClickLabelHandler = (event) => {
    if (this.props.rangeValues !== undefined) {
      event.preventDefault();
      return false;
    }

    const { name } = event.target.dataset;
    this.setState({
      [`${name}Editable`]: true
    }, () => {
      const input = this[`${name}InputRef`].current;
      input.value = this.props[`${name}`];
      input.select();
    });
  }

  calculatePositionPullet() {
    let minWidth;
    let maxWidth;
    if (this.props.rangeValues) {
      minWidth = this.state.positionsMin.find(pos => pos.value === this.props.min).position;
      maxWidth = this.state.positionsMax.find(pos => pos.value === this.props.max).position;
    } else {
      minWidth = this.widthStep * (parseInt(this.props.min) - this.props.minLimit);
      maxWidth = this.width - (this.widthStep * (parseInt(this.props.max) - this.props.minLimit));
    }
    this.rangeAreaMinRef.current.style.width = `${minWidth}px`;
    this.rangeAreaMaxRef.current.style.width = `${maxWidth}px`;
  }

  calculateMin(widthRange) {
    if (this.props.rangeValues) {
      return this.state.positionsMin.find(pos => widthRange >= pos.min && widthRange <= pos.max).value;
    }
    const value = (widthRange / this.widthStep + this.props.minLimit).toFixed(2);
    return value < this.props.minLimit? this.props.minLimit : value;
  }

  calculateMax(widthRange)  {
    if (this.props.rangeValues) {
      return this.state.positionsMax.find(pos => widthRange >= pos.min && widthRange <= pos.max).value;
    }

    const value = (this.props.maxLimit - (widthRange / this.widthStep)).toFixed(2);
    return value > this.props.maxLimit? this.props.maxLimit : value;
  }

  render() {
    const { min, max, rangeValues } = this.props;
    const { minEditable, maxEditable } = this.state;
    return (
      <div className="range">
        <div className="range__value range__value-min">
          {/* The user can click on both currency number label values (min or max) and set a new value */}
          { rangeValues === undefined && minEditable
            ? <input
                type="number"
                name="min"
                ref={this.minInputRef}
                onKeyDown={this.onKeyDownHandler}
              />
            : <span data-name="min" onClick={this.onClickLabelHandler}>{min}</span>
          } €
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
          {/* The user can click on both currency number label values (min or max) and set a new value */}
          { rangeValues === undefined && maxEditable
            ? <input
              type="text"
              name="max"
              ref={this.maxInputRef}
              onKeyDown={this.onKeyDownHandler}
              />
            : <span data-name="max" onClick={this.onClickLabelHandler}>{max}</span>
          } €
        </div>
      </div>
    )
  } 
}