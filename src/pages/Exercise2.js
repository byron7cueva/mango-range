import React, { Component } from 'react';

import { Range } from '../components/Range';
import { Api } from '../api';

export class Exercise2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  onChangeMin = (value, id) => {
    const store = [ ...this.state.data ];
    const index = store.findIndex(range => range.id === id);
    store[index].min = value;
    this.setState({
      data: store
    });
  }

  onChangeMax = (value, id) => {
    const store = [ ...this.state.data ];
    const index = store.findIndex(range => range.id === id);
    store[index].max = value;
    this.setState({
      data: store
    });
  }

  async fetchData() {
    const data = await Api.getAllFixedRanges();
    this.setState({data});
  }

  render() {
    const { data } = this.state;
    return (
      <ul className="list-ranges">
        {
          data.map(range => (
            <li key={range.id}>
              <Range
                id={range.id}
                min={range.min}
                max={range.max}
                rangeValues={range.rangeValues}
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