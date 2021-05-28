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

  async fetchData () {
    const data = await Api.getAllRanges();
    this.setState({data});
  }

  findById(id) {
    return this.state.data.find(rage => rage.id === id);
  }

  render() {
    const { data } = this.state;
    return ( 
      <ul className="list-ranges">
        {
          data.map(range => (
            <li key={range.id}>
              <NormalRange
                id={range.id}
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