import { configure } from '@testing-library/dom';
import '@testing-library/jest-dom';

configure({ testIdAttribute: 'data-test' });
jest.mock('next/font/google', () => ({
  Leckerli_One: jest
    .fn()
    .mockImplementation(() => ({ className: '' })),
}));
