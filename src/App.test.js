import {render, fireEvent, screen, cleanup} from '@testing-library/react';
import {BrowserRouter as Router} from "react-router-dom";
import App from './App';
import LoginForm from './components/loginform.component';
import Sidebar from './components/sidebar.component';
import {UserContext, updateIdValue, updateRoleValue} from './UserContext';

afterEach(cleanup);

test('app renders header', () => {
    render(<App />);
    const standby = jest.fn();
    const linkElement = screen.getByTestId("header");
    const logoElement = screen.getByTestId("headerButton");
    const profilBilledeElement = screen.getByAltText("profilBillede");
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toContainElement(logoElement);
    expect(linkElement).toContainElement(profilBilledeElement);
    expect(standby).toBeCalledTimes(0); 
    /* There wasnt an error loading the profile picture */
    /* Might need to change in the future */
});

test('sidebar renders correctly with context', ()=>{
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
    const loginElement = screen.getByDisplayValue("Log ind");
    expect(loginElement).toHaveAttribute("disabled");
    fireEvent.change(usernameElement, {target: {value: "Sigurd"}});
    fireEvent.change(passwordElement, {target: {value: "hacked"}});
    expect(screen.getByTestId('loginForm')).toHaveFormValues({
        username: 'Sigurd',
        password: 'hacked',
    });
    expect(loginElement).not.toHaveAttribute("disabled");
});

test('submits data when user presses submit', async () => {
    window.HTMLFormElement.prototype.submit = () => {};
    global.fetch = jest.fn(() => {
        return( 
        Promise.resolve({
            json: () => Promise.resolve({id: "60608f0389177a0bb0679e78"})
        })
    )});

    render(<Router><LoginForm /></Router>); 
    const usernameElement = screen.getByPlaceholderText("Brugernavn");
    const passwordElement = screen.getByPlaceholderText("Adgangskode");
    const submitElement = screen.getByDisplayValue("Log ind");
    fireEvent.change(usernameElement, {target: {value: "sigurd"}});
    fireEvent.change(passwordElement, {target: {value: "password"}});
    fireEvent.click(submitElement);
    /* Should test that cookie is set and that user is redirected */
});

test('finds the correct _id value in cookie', () => {
    const cookie = "id=60608f0389177a0bb0679e78; role=teacher";
    const extractedId = updateIdValue(cookie);
    const expected = "60608f0389177a0bb0679e78"
    expect(extractedId).toEqual(expect.stringMatching(expected));
});

test('finds the correct role value in cookie', () => {
    const cookie = "id=60608f0389177a0bb0679e78; role=teacher";
    const extractedId = updateRoleValue(cookie);
    const expected = "teacher"
    expect(extractedId).toEqual(expect.stringMatching(expected));
});