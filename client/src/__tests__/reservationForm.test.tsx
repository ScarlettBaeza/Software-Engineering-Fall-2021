import React from 'react';
import renderer from 'react-test-renderer';
import TestRenderer from 'react-test-renderer';
import { render, screen,fireEvent } from '@testing-library/react';
import { ReservationForm } from '../pages/reservationForm/reservationForm';
import '@testing-library/jest-dom';
import user from '@testing-library/user-event'
import { RegisterModal } from '../components/registerModal/registerModal';

it('Reservation form renders correctly', () => {
    const tree = renderer
      .create(<ReservationForm/>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

it('Check Phone Number Input', () => {
  const tree = renderer.create(<ReservationForm/>);
  
})