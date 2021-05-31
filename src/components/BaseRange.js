import React, { Component } from 'react';

/**
 * Normal range from min to max number
 * The component CAN'T be a HTML5 input range. It has to be a custom one
 */
export class BaseRange extends Component {

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
      this.props.onResizeObserver(this);
    });
    this.resizeObserver.observe(this.rangeLineRef.current);
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
      this.props.onMouseUp(this);
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
        value = this.props.calculateMin(this, widthRange);
        // Min value and max value can't be crossed in range
        if (value >= this.props.max) {
          return;
        }
        this.props.onChangeMin(value, this.props.id);
      } else {
        widthRange = offsetLeft + clientWidth - event.clientX;
        widthRange = (widthRange > this.width? this.width : widthRange);
        value = this.props.calculateMax(this, widthRange);
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
    if (!this.props.isEditable) {
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
    this.props.onCalculatePositionPullet(this);
  }

  render() {
    const { min, max, isEditable } = this.props;
    const { minEditable, maxEditable } = this.state;
    return (
      <div className="range">
        <div className="range__value range__value-min">
          {/* The user can click on both currency number label values (min or max) and set a new value */}
          { isEditable && minEditable
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
          { isEditable && maxEditable
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

export function rangeLogicHoc(WrapperComponent, actions) {
  return (props) => (
    <WrapperComponent
      {...props} 
      onResizeObserver={actions.onResizeObserver}
      calculateMin={actions.calculateMin}
      calculateMax={actions.calculateMax}
      onCalculatePositionPullet={actions.onCalculatePositionPullet}
      onMouseUp={actions.onMouseUp}
    />
  );
}