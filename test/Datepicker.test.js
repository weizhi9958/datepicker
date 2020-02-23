import '@testing-library/jest-dom/extend-expect'
import '@babel/polyfill';
import React from 'react';
import { render, fireEvent } from "@testing-library/react";
import DatePicker from '../src/components/datepicker';

describe("Test TypeInInput", () => {
    test("render後，預設不顯示datepicker", () => {
        const { queryByTestId } = render(<DatePicker />); 
        expect(queryByTestId('datepicker')).toBeNull();
    });
    test("點擊輸入框後，顯示datepicker", () => {
        const { getByTestId ,queryByTestId } = render(<DatePicker />);
        fireEvent.click(getByTestId('textField'));
        expect(queryByTestId('datepicker')).toBeInTheDocument();
    });
    // test("沒帶value，預設顯示當前時間", () => {
    //     const { getByTestId , container } = render(<DatePicker />);
    //     fireEvent.click(getByTestId('textField'));
    //     const selectYear = container.querySelector('[data-testid="select-year"] select');
    //     console.log('selectYear: ', selectYear);
    //     console.log('selectYear: ', selectYear.value);
    // });
  });