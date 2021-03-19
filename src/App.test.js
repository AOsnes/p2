import { render, screen } from '@testing-library/react';
import App from './App';

test('app renders navbar', () => {
  render(<App />);
  const linkElement = screen.getByTestId("Navbar");
  expect(linkElement).toBeInTheDocument();
});

test('app renders classform', () =>{
  render(<App />);
  const linkElement = screen.getByText("test");
  expect(linkElement).toBeInTheDocument();
})
