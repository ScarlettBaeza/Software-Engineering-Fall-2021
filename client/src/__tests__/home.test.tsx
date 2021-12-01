import React from 'react';
import renderer from 'react-test-renderer';
import {Home} from '../pages/home/home';
import '@testing-library/jest-dom';

it(' home renders correctly', () => {
    const tree = renderer
      .create(<Home/>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
