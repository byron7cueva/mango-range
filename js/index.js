'use strict'

class Range extends React.Component {
  render() {
    return (
      <div className="range">
        <div className="range__value range__value-min">0$</div>
        <div className="slider">
          <div className="slider__bar">
            <div className="range__area range__area-min">
              <div className="bullet"></div>
            </div>
            <div className="range__area range__area-max">
              <div className="bullet"></div>
            </div>
          </div>
        </div>
        <div className="range__value range__value-max">100$</div>
      </div>
    )
  }
}

ReactDOM.render(
  <Range />,
  document.getElementById('root')
);