import React from 'react';
import * as moment from 'moment'
import DatePicker from './components/datepicker';

function App() {
  return (
    <div style={{ width: '100%', padding: '30px' }}>
      <DatePicker
        title={'帶Value 自訂日期'}
        value={moment(1575129600000)}
        onChange={(value, inputValue) => {
          console.log('value: ', value.valueOf());
          console.log('inputValue: ', inputValue);
        }}
      />
      <DatePicker
        title={'沒帶Value 預設今日'}
        placeholder={'請選擇日期'}
        onChange={(value, inputValue) => {
          console.log('value: ', value.valueOf());
          console.log('inputValue: ', inputValue);
        }}
      />
      <DatePicker
        title={'自訂format'}
        format={'DD-MM-YYYY HH:mm'}
      />
    </div>
  );
}

export default App;
