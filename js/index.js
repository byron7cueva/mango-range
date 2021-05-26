'use strict'

class Range extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      minValue: 0,
      maxValue:0
    }
    this.rangeLineRef = React.createRef();
    this.rangeAreaMinRef = React.createRef();
    this.rangeAreaMaxRef = React.createRef();
    this.width = 0;
    this.step = 0;
  }

  onMouseDownHandler = (event) => {
    console.log("Hizo clic", event);
  }

  onMouseUpHandler = () => {
    console.log("Solto");
  }

  onChangeHandler = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    }, () => {
      this.calculatePositionPullet();
    });
  }

  calculatePositionPullet() {
    this.rangeAreaMinRef.current.style.width = `${this.step * parseInt(this.state.minValue)}px`;
    this.rangeAreaMaxRef.current.style.width = `${this.width - (this.step * parseInt(this.state.maxValue))}px`;
  }

  render() {
    return (
      <div className="range">
        <div className="range__value range__value-min">
          <input type="text" name="minValue" value={this.state.minValue} onChange={this.onChangeHandler} />
        </div>
        <div className="range__content">
          <div className="range__line" ref={this.rangeLineRef}>
            <div className="range__area range__area-min" ref={this.rangeAreaMinRef}>
              <div className="bullet bullet-min" onMouseDown={this.onMouseDownHandler} onMouseUp={this.onMouseUpHandler}></div>
            </div>
            <div className="range__area range__area-max" ref={this.rangeAreaMaxRef}>
              <div className="bullet bullet-max"></div>
            </div>
          </div>
        </div>
        <div className="range__value range__value-max">
          <input type="text" name="maxValue" value={this.state.maxValue} onChange={this.onChangeHandler} />
        </div>
      </div>
    )
  }

  componentDidMount() {
    new ResizeObserver(resizeEntity => {
      this.width = resizeEntity[0].target.clientWidth;
      this.step = this.width / (this.props.max - this.props.min);
      this.calculatePositionPullet();
    }).observe(this.rangeLineRef.current);
  }
}

ReactDOM.render(
  <Range min={0} max={100} />,
  document.getElementById('root')
);