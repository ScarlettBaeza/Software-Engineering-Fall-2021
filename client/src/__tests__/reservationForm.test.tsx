import React from 'react';
import renderer from 'react-test-renderer';
import { ReservationForm } from '../pages/reservationForm/reservationForm';
import '@testing-library/jest-dom';

it('renders correctly', () => {
    const tree = renderer
      .create(<ReservationForm/>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });