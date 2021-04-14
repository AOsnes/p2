import {render, fireEvent, screen, cleanup} from '@testing-library/react';
import {BrowserRouter as Router} from "react-router-dom";
import App from './App';
import LoginForm from './components/loginform.component';
import Sidebar from './components/sidebar.component';
import {UserContext} from './UserContext';

afterEach(cleanup);

test('app renders header', () => {
    render(<App />);
    const linkElement = screen.getByTestId("header");
    expect(linkElement).toBeInTheDocument();
});

test('app renders sidebar', ()=>{
    let signedInUser = 'student';
    render(
        <div>
            <UserContext.Provider value={signedInUser}>
                <Router>
                    <Sidebar/>
                </Router>
            </UserContext.Provider>
        </div>
    );
    const linkElement = screen.getByTestId("sidebar");
    const skemaElement = screen.getByText("Skema");
    const afleveringerElement = screen.getByText("Afleveringer");

    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toContainElement(skemaElement);
    expect(linkElement).toContainElement(afleveringerElement);
    expect(linkElement).not.toContain(screen.queryByText("Rediger Skema"));
    /* Remove rendered screen and render a new screen with a new context */
    cleanup(); 
    signedInUser = 'teacher';
    render(
        <div>
            <UserContext.Provider value={signedInUser}>
                <Router>
                    <Sidebar/>
                </Router>
            </UserContext.Provider>
        </div>
    );
    const teacherLinkElement = screen.getByTestId("sidebar");
    const teacherSkemaElement = screen.getByTestId("redigerSkema")
    expect(teacherLinkElement).toBeInTheDocument();
    expect(teacherLinkElement).toContainElement(teacherSkemaElement);
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
    expect(screen.getByTestId('loginForm')).toHaveFormValues({
        username: '',
        password: '',
    });
    const usernameElement = screen.getByPlaceholderText("Brugernavn");
    const passwordElement = screen.getByPlaceholderText("Adgangskode");
    fireEvent.change(usernameElement, {target: {value: "Sigurd"}});
    fireEvent.change(passwordElement, {target: {value: "hacked"}});
    expect(screen.getByTestId('loginForm')).toHaveFormValues({
        username: 'Sigurd',
        password: 'hacked',
    });
});

test('submits data when user presses submit', async () => {
    window.HTMLFormElement.prototype.submit = () => {};

    /* global.fetch = jest.fn(() => {
        Promise.resolve({
            json: () => Promise.resolve({id: "60608f0389177a0bb0679e78"})
        })
    }); */
    render(<LoginForm />); 
    const usernameElement = screen.getByPlaceholderText("Brugernavn");
    const passwordElement = screen.getByPlaceholderText("Adgangskode");
    const submitElement = screen.getByDisplayValue("Log ind");
    fireEvent.change(usernameElement, {target: {value: "sigurd"}});
    fireEvent.change(passwordElement, {target: {value: "password"}});
    //TODO:: FIX THIS KEK:
    fireEvent.click(submitElement);
});