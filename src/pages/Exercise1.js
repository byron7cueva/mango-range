'use strict'

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