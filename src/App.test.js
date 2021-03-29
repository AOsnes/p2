import { render, fireEvent, screen} from '@testing-library/react';
import App from './App';
import LoginForm from './components/loginform.component';

test('app renders navbar', () => {
  render(<App />);
  const linkElement = screen.getByTestId("Navbar");
  expect(linkElement).toBeInTheDocument();
});

test('app renders classform', () =>{
  render(<App />);
  const linkElement = screen.getByText("test");
  expect(linkElement).toBeInTheDocument();
});

test('app renders loginform correctly', () => {
  render(<App />);
  const linkElement = screen.getByTestId('loginForm');
  const h2element = screen.getByText("Velkommen");
  const brugernavnElement = screen.getByPlaceholderText("Brugernavn");
  const adgangskodeElement = screen.getByPlaceholderText("Adgangskode");
  const loginElement = screen.getByDisplayValue("Log ind");
  expect(linkElement).toBeInTheDocument();
  expect(linkElement).toContainElement(h2element);
  expect(linkElement).toContainElement(brugernavnElement);
  expect(linkElement).toContainElement(adgangskodeElement);
  expect(linkElement).toContainElement(loginElement);
});

test('form value changed when user types', () => {
  //TODO: check if the change is handled correctly by the component
  render(<LoginForm />);

  const usernameElement = screen.getByPlaceholderText("Brugernavn");
  const passwordElement = screen.getByPlaceholderText("Adgangskode");

  fireEvent.change(usernameElement, {target: {username: "Sigurd"}}); 
  fireEvent.change(passwordElement, {target: {password: "hacked"}}); 
});