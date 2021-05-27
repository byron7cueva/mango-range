class Exercise2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mi: 1.99,
      mx: 50.99
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
        min={this.state.mi}
        max={this.state.mx}
        rangeValues={[1.99, 5.99, 10.99, 30.99, 50.99, 70.99]}
        onChangeMin={this.onChangeMin}
        onChangeMax={this.onChangeMax}
      />
    );
  }
}

ReactDOM.render(
  <Exercise2 />,
  document.getElementById('root')
);