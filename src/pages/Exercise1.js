import React, { Component } from 'react';

import { NormalRange } from '../components/NormalRange';

export class Exercise1 extends Component {
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
      <NormalRange
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