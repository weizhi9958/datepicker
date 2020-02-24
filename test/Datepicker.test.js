import '@testing-library/jest-dom/extend-expect'
import '@babel/polyfill';
import React from 'react';
import moment from 'moment'
import { render, fireEvent, screen } from "@testing-library/react";
import { within } from '@testing-library/dom'
import DatePicker from '../src/components/datepicker';

describe("測試datepicker", () => {
    test("render後，預設不顯示datepicker", () => {
        const { queryByTestId } = render(<DatePicker />);
        expect(queryByTestId('datepicker')).not.toBeInTheDocument();
    });
    test("點擊輸入框後，顯示datepicker", () => {
        const { getByTestId, queryByTestId } = render(<DatePicker />);
        fireEvent.click(getByTestId('textField'));
        expect(queryByTestId('datepicker')).toBeInTheDocument();
    });
    test("沒帶value，預設選擇當前時間", () => {
        const { getByTestId, container } = render(<DatePicker />),
            nowTime = moment();
        fireEvent.click(getByTestId('textField'));
        const selectYear = container.querySelector('[data-testid="select-year"] select'),
            selectMonth = container.querySelector('[data-testid="select-month"] select'),
            selectHour = container.querySelector('[data-testid="select-hour"] select'),
            selectMinute = container.querySelector('[data-testid="select-minute"] select'),
            divDate = within(container.querySelector('.dates')),
            date = divDate.queryByText(nowTime.date().toString());
        expect(selectYear.value).toBe(nowTime.year().toString());
        expect(selectMonth.value).toBe(nowTime.month().toString());
        expect(selectHour.value).toBe(nowTime.hour().toString());
        expect(selectMinute.value).toBe(nowTime.minute().toString());
        expect(date).toHaveStyle({ color: 'white' });
    });
    // test("點擊日期後，輸入框顯示選擇日期", () => {
    //     const { getByText, getByTestId, container } = render(<DatePicker />);
    //     fireEvent.click(getByTestId('textField'));
    //     const divDate = within(container.querySelector('.dates'));
    //     // nowDate = within(divDate.);
    //     fireEvent.click(screen.getByText(
    //         null,
    //         '1',
    //         { selector: '[data-testid="whichMonth0"]' }
    //         ))
    //     // expect(queryByTestId('datepicker')).toBeInTheDocument();
    // });
});