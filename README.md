[Demo](https://github.com/facebook/create-react-app).

## Example

```javascript
import DatePicker from './components/datepicker';

<DatePicker
  title={'標題文字'}
  value={moment(1575129600000)}
  onChange={(value, inputValue) => { // value為moment實例, inputValue為實際字串
    console.log('value: ', value.valueOf()); // 1575129600000
    console.log('inputValue: ', inputValue); // 2019/12/01 00:00
  }}
/>
```

## Props
name        | type   | default  | desc
----------- | ------ | -------- | ---- 
title       | string | ''       | 標題
format      | string | ''       | 格式化文字<br>用於顯示至input上
placeholder | string | ''       | 佔位符
value       | moment | moment() | 值，需帶moment物件<br>沒帶預設今日
onChange    | func   | ()=>{}   | (value, inputValue)=>{}<br>選擇日期或時間時觸發<br>value:當前moment物件<br>inputValue實際顯示文字