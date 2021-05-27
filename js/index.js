'use strict'

class Range extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      minValue: props.min,
      maxValue:props.max
    }
    this.rangeLineRef = React.createRef();
    this.rangeAreaMinRef = React.createRef();
    this.rangeAreaMaxRef = React.createRef();
    this.minValueInputRef = React.createRef();
    this.maxValueInputRef = React.createRef();
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
      if (name === "minValue") {
        widthRange = this.rangeToMove.clientWidth + event.movementX;
        widthRange = (widthRange > this.width? this.width : widthRange);
        value = Math.trunc(widthRange / this.widthStep) + this.props.min;
        if (value >= this.state.maxValue) {
          return;
        }
      } else {
        widthRange = this.rangeToMove.clientWidth - event.movementX;
        widthRange = (widthRange > this.width? this.width : widthRange);
        value = this.props.max - (Math.trunc(widthRange / this.widthStep));
        if (value <= this.state.minValue) {
          return;
        }
      }
      this.rangeToMove.style.width = `${widthRange}px`;
      this.setState({
        [name]: value
      });
      this[`${name}InputRef`].current.value = value;
    }
  }

  onKeyDownHandler = (event) => {
    if (event.key === 'Enter') {
      const { name, value } = event.target;
      const numberValue = parseInt(value);
      if (numberValue < this.props.min || numberValue > this.props.max
        || (name === 'minValue' && numberValue >= this.state.maxValue )
        || (name === 'maxValue' && numberValue <= this.state.minValue)) {
        event.target.value = this.state[name];
        return;
      }
      this.setState({
        [name]: value
      }, () => {
        this.calculatePositionPullet();
      });
    }
  }

  calculatePositionPullet() {
    this.rangeAreaMinRef.current.style.width = `${this.widthStep * (parseInt(this.state.minValue) - this.props.min)}px`;
    this.rangeAreaMaxRef.current.style.width = `${this.width - (this.widthStep * (parseInt(this.state.maxValue) - this.props.min))}px`;
  }

  render() {
    return (
      <div className="range">
        <div className="range__value range__value-min">
          <input type="number" name="minValue" ref={this.minValueInputRef} onKeyDown={this.onKeyDownHandler} />
        </div>
        <div className="range__content">
          <div className="range__line" ref={this.rangeLineRef}>
            <div className="range__area range__area-min" ref={this.rangeAreaMinRef} data-name="minValue">
              <div
                className="bullet bullet-min"
                onMouseDown={this.onMouseDownHandler}
                onMouseUp={this.onMouseUpHandler}
                onMouseMove={this.onMouseMoveHandler}
                onMouseLeave={this.onMouseUpHandler}>
              </div>
            </div>
            <div className="range__area range__area-max" ref={this.rangeAreaMaxRef} data-name="maxValue">
              <div className="bullet bullet-max"
              onMouseDown={this.onMouseDownHandler}
              onMouseUp={this.onMouseUpHandler}
              onMouseMove={this.onMouseMoveHandler}
              onMouseLeave={this.onMouseUpHandler}></div>
            </div>
          </div>
        </div>
        <div className="range__value range__value-max">
          <input type="text" name="maxValue" ref={this.maxValueInputRef} onKeyDown={this.onKeyDownHandler} />
        </div>
      </div>
    )
  }

  componentDidMount() {
    new ResizeObserver(resizeEntity => {
      this.width = resizeEntity[0].target.clientWidth;
      this.steps = this.props.max - this.props.min;
      this.widthStep = this.width / this.steps;
      this.calculatePositionPullet();
    }).observe(this.rangeLineRef.current);
    this.minValueInputRef.current.value = this.state.minValue;
    this.maxValueInputRef.current.value = this.state.maxValue;
  }
}

ReactDOM.render(
  <Range min={30} max={80} />,
  document.getElementById('root')
);