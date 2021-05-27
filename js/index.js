'use strict'

class Range extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      minEditable: false,
      maxEditable: false
    }
    this.rangeLineRef = React.createRef();
    this.rangeAreaMinRef = React.createRef();
    this.rangeAreaMaxRef = React.createRef();
    this.minInputRef = React.createRef();
    this.maxInputRef = React.createRef();
    this.width = 0;
    this.widthStep = 0;
    this.rangeToMove = null;
  }

  onMouseDownHandler = (event) => {
    this.rangeToMove = event.target.parentElement;
  }

  onMouseUpHandler = () => {
    this.rangeToMove = null;
  }

  onMouseMoveHandler = (event) => {
    if (this.rangeToMove !== null) {
      let widthRange;
      let value;
      const { name } = this.rangeToMove.dataset;
      if (name === "min") {
        widthRange = this.rangeToMove.clientWidth + event.movementX;
        widthRange = (widthRange > this.width? this.width : widthRange);
        value = Math.trunc(widthRange / this.widthStep) + this.props.minLimit;
        // Min value and max value can't be crossed in range
        if (value >= this.props.max) {
          return;
        }
        this.props.onChangeMin(value);
      } else {
        widthRange = this.rangeToMove.clientWidth - event.movementX;
        widthRange = (widthRange > this.width? this.width : widthRange);
        value = this.props.maxLimit - (Math.trunc(widthRange / this.widthStep));
        // Min value and max value can't be crossed in range
        if (value <= this.props.min) {
          return;
        }
        this.props.onChangeMax(value);
      }
      this.rangeToMove.style.width = `${widthRange}px`;

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
        this.props.onChangeMin(value);
      } else {
        this.props.onChangeMax(value);
      }

      this.setState({
        [`${name}Editable`]: false
      }, () => {
        this.calculatePositionPullet();
      });
    }
  }

  onClickLabelHandler = (event) => {
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
    this.rangeAreaMinRef.current.style.width = `${this.widthStep * (parseInt(this.props.min) - this.props.minLimit)}px`;
    this.rangeAreaMaxRef.current.style.width = `${this.width - (this.widthStep * (parseInt(this.props.max) - this.props.minLimit))}px`;
  }

  render() {
    const { min, max } = this.props;
    const { minEditable, maxEditable } = this.state;
    return (
      <div className="range">
        <div className="range__value range__value-min">
          {/* The user can click on both currency number label values (min or max) and set a new value */}
          { minEditable
            ? <input
                type="number"
                name="min"
                ref={this.minInputRef}
                onKeyDown={this.onKeyDownHandler}
              />
            : <span data-name="min" onClick={this.onClickLabelHandler}>{min}</span>
          } $
        </div>
        { /* The component CAN'T be a HTML5 input range. It has to be a custom one */ }
        <div className="range__content">
          <div className="range__line" ref={this.rangeLineRef}>
            <div className="range__area range__area-min" ref={this.rangeAreaMinRef} data-name="min">
              {/* The user can drag two bullets through the range line */}
              <div
                className="bullet bullet-min"
                onMouseDown={this.onMouseDownHandler}
                onMouseUp={this.onMouseUpHandler}
                onMouseMove={this.onMouseMoveHandler}
                onMouseLeave={this.onMouseUpHandler}>
              </div>
            </div>
            <div className="range__area range__area-max" ref={this.rangeAreaMaxRef} data-name="max">
              {/* The user can drag two bullets through the range line */}
              <div className="bullet bullet-max"
              onMouseDown={this.onMouseDownHandler}
              onMouseUp={this.onMouseUpHandler}
              onMouseMove={this.onMouseMoveHandler}
              onMouseLeave={this.onMouseUpHandler}></div>
            </div>
          </div>
        </div>
        <div className="range__value range__value-max">
          {/* The user can click on both currency number label values (min or max) and set a new value */}
          { maxEditable
            ? <input
              type="text"
              name="max"
              ref={this.maxInputRef}
              onKeyDown={this.onKeyDownHandler}
              />
            : <span data-name="max" onClick={this.onClickLabelHandler}>{max}</span>
          } $
        </div>
      </div>
    )
  }

  componentDidMount() {
    new ResizeObserver(resizeEntity => {
      this.width = resizeEntity[0].target.clientWidth;
      this.steps = this.props.maxLimit - this.props.minLimit;
      this.widthStep = this.width / this.steps;
      this.calculatePositionPullet();
    }).observe(this.rangeLineRef.current);
  }
}

class Exercise1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mi: 45,
      mx: 70
    };
  }

  onChangeMin = (value) => {
    this.setState({
      mi: value
    });
  }

  onChangeMax = (value) => {
    this.setState({
      mx: value
    });
  }

  render() {
    return (
      <Range
        minLimit={30}
        maxLimit={80}
        min={this.state.mi}
        max={this.state.mx}
        onChangeMin={this.onChangeMin}
        onChangeMax={this.onChangeMax}
      />
    );
  }
}

ReactDOM.render(
  <Exercise1 />,
  document.getElementById('root')
);