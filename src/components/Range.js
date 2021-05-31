import React from 'react';

import { NormalRange } from './NormalRange';
import { FixedRange } from './FixedRange';

export const Range = (props) => {
  const {id, minLimit, maxLimit, min, max, rangeValues} = props;
  return (
    <>
      { props.rangeValues
        ? <FixedRange
            id={id}
            min={min}
            max={max}
            rangeValues={rangeValues}
            onChangeMin={props.onChangeMin}
            onChangeMax={props.onChangeMax}/>
        : <NormalRange
            id={id}
            minLimit={minLimit}
            maxLimit={maxLimit}
            min={min}
            max={max}
            onChangeMin={props.onChangeMin}
            onChangeMax={props.onChangeMax}
            isEditable={true}
        />
      }
    </>
  );
} 
