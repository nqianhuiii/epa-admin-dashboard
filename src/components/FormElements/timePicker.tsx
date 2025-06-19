'use client'; // if in an `app/` directory and you're using App Router

import React, { ReactNode } from 'react';
import { TimePicker } from 'rsuite';

type RowProps = {
  children: ReactNode;
  title: string;
};

const Row = ({ children, title }: RowProps) => {
  return (
    <div>
      <label style={{ width: 80, display: 'inline-block', marginTop: 10 }}>{title}</label>
      {children}
    </div>
  );
};

const TimePickerPage = () => (
  <>
    <Row title="24 hours">
      <TimePicker format="HH:mm" />
    </Row>

    <Row title="12 hours">
      <TimePicker format="hh:mm aa" showMeridiem />
    </Row>
  </>
);

export default TimePickerPage;
