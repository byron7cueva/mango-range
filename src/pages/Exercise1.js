import React, { Component } from 'react';

import { NormalRange } from '../components/NormalRange';
import { Api } from '../api';

export class Exercise1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    this.fetchData();
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

  async fetchData () {
    const data = await Api.getAllRanges();
    this.setState({data});
  }

  render() {
    const { data } = this.state;
    return ( 
      <ul>
        {
          data.map(range => (
            <li key={range.id}>
              <NormalRange
                minLimit={range.minLimit}
                maxLimit={range.maxLimit}
                min={range.min}
                max={range.max}
                onChangeMin={this.onChangeMin}
                onChangeMax={this.onChangeMax}
            />
            </li>
          ))
        } 
      </ul>
    );
  }
}