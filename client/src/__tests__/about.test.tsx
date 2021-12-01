import React from 'react';
import renderer from 'react-test-renderer';
import { About} from '../pages/about/about';
import '@testing-library/jest-dom';

it('about page renders correctly', () => {
    const tree = renderer
      .create(<About/>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });