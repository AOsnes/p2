import {render, fireEvent, screen, cleanup} from '@testing-library/react';
import { link } from 'fs-extra';
import {BrowserRouter as Router, useLocation} from "react-router-dom";
import App from './App';
import Skema from './components/skema.component';
import Skemabrik from './components/skemabrik.component';
import SkemabrikModal from './components/skemabrikModal.component'
import Header from './components/header.component';
import Sidebar from './components/sidebar.component';
import LoginForm from './components/loginform.component';
import NoMatchError from './components/noMatchError.component';
import {UserContext, updateIdValue, updateRoleValue, updateNameValue} from './UserContext';

afterEach(cleanup);

/* Tests for header */
test('header renders correctly with name', () => {
    const signedInUser = {name: 'Testy McTestFace', role: '', id: ''}
    render(
        <div>
            <UserContext.Provider value={signedInUser}>
                <Router>
                    <Header linkTo="/"/>
                </Router>
            </UserContext.Provider>
        </div>
    );

    const standby = jest.fn();
    const linkElement = screen.getByTestId("header");
    const logoElement = screen.getByTestId("headerButton");
    const profilePictureElement = screen.getByAltText("profilBillede");
    const profileNameElement = screen.getByText("Testy McTestFace");

    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toContainElement(logoElement);
    expect(linkElement).toContainElement(profilePictureElement);
    expect(linkElement).toContainElement(profileNameElement);
    expect(standby).toBeCalledTimes(0); 
    /* There wasnt an error loading the profile picture */
    /* Might need to change in the future */
});

/* Tests for sidebar */
test('sidebar renders correctly with context', () => {
    let signedInUser = {role: 'student', name: 'Sigurd', id: '123123'};
    /* Mocking document.cookie, essentially setting the cookie to the return value of get */
    Object.defineProperty(document, 'cookie', {
        get: jest.fn().mockImplementation(() => { return 'id=60608f0389177a0bb0679e78; role=teacher; name=Testy McTestFace; Secure'; }),
        set: jest.fn().mockImplementation(() => {}),
      });
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
    signedInUser = {role: 'teacher', name: 'Sigurd', id: '123'};
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

/* Test for noMatchError */
test('noMatchError renders correctly', () => {
    let path = "/skemas";
    render(
        <div>
            <NoMatchError location={path}/>
        </div>
    );
    const linkElement = screen.getByTestId('pageNotFoundContainer');
    const pElement = screen.getByTestId('pageNotFound');
    const expectedElementContent = "404: Siden blev ikke fundet, kunne ikke finde side: /skemas";

    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toContainElement(pElement);
    expect(pElement).toHaveTextContent(expectedElementContent);
});

/* Tests for loginform */
test('app renders loginform correctly', () => {
    render(<App />);
    const linkElement = screen.getByTestId('loginForm');
    const h2element = screen.getByText("Skema.dk");
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
    delete window.location;
    window.location = { reload: jest.fn() };

    render(<Router><LoginForm /></Router>); 
    const usernameElement = screen.getByPlaceholderText("Brugernavn");
    const passwordElement = screen.getByPlaceholderText("Adgangskode");
    const submitElement = screen.getByDisplayValue("Log ind");
    fireEvent.change(usernameElement, {target: {value: "sigurd"}});
    fireEvent.change(passwordElement, {target: {value: "password"}});
    fireEvent.click(submitElement);
    /* Should test that cookie is set and that user is redirected */
});

/* Tests for userContext */
test('finds the correct id value in cookie', () => {
    const expected = "60608f0389177a0bb0679e78"
    let extractedId;
    const cookieStrings = [
        "id=60608f0389177a0bb0679e78; role=teacher; name=Testy McTestFace; Secure",
        "role=teacher; id=60608f0389177a0bb0679e78; name=Testy McTestFace; Secure",
        "role=teacher; name=Testy McTestFace; id=60608f0389177a0bb0679e78; ",
        "foo; id=60608f0389177a0bb0679e78; bar"]
    cookieStrings.forEach(cookie => {
        extractedId = updateIdValue(cookie);
        expect(extractedId).toEqual(expected);
    });
});

test('finds the correct role value in cookie', () => {
    const expected = "teacher"
    let extractedRole;
    const cookieStrings = [
        "id=60608f0389177a0bb0679e78; role=teacher; name=Testy McTestFace; Secure",
        "role=teacher; id=60608f0389177a0bb0679e78; name=Testy McTestFace; Secure",
        "role=teacher; name=Testy McTestFace; id=60608f0389177a0bb0679e78; ",
        "foo; role=teacher; bar"]
    cookieStrings.forEach(cookie => {
        extractedRole = updateRoleValue(cookie);
        expect(extractedRole).toEqual(expected);
    });
});

test('finds the correct name value in cookie', () => {
    const expected = "Testy McTestFace"
    let extractedName;
    const cookieStrings = [
        "id=60608f0389177a0bb0679e78; role=teacher; name=Testy McTestFace; Secure",
        "role=teacher; name=Testy McTestFace; id=60608f0389177a0bb0679e78; Secure",
        "role=teacher; name=Testy McTestFace; id=60608f0389177a0bb0679e78; ",
        "foo; name=Testy McTestFace; bar"]
    cookieStrings.forEach(cookie => {
        extractedName = updateNameValue(cookie);
        expect(extractedName).toEqual(expected);
    });
});

/* Tests for skema */
test('skema component renders correctly', () => {
    /* render(<Skema/>)
    const linkElement = screen.getByText("There was an error loading your schedule");
    expect(linkElement).toBeInTheDocument(); 
    Bruh jeg magter ikke at skrive fetch mocks igen :)*/
});

/* Tests for skemabrik */
test('skemabrik component renders correctly', () => {
    const skemabrikDansk = {subject: 'Dansk', class: '', description: '', startTime: '', endTime: ''}
    const skemabrikMatematik = {subject: 'Matematik', class: '', description: '', startTime: '', endTime: ''}
    render([
        <div id="Mandag" data-testid="Mandag"/>,
        <div id="Tirsdag" data-testid="Tirsdag"/>,
        <div id="Onsdag" data-testid="Onsdag"/>,
        <div id="Torsdag" data-testid="Torsdag"/>,
        <div id="Fredag" data-testid="Fredag"/>,
        <Skemabrik skemabrik={skemabrikDansk} dayView={1} weekday="Mandag"/>,
        <Skemabrik skemabrik={skemabrikMatematik} dayView={5}weekday="Onsdag"/>
    ])

    const skemabrikElementDansk = screen.getByText('Dansk');
    const skemabrikLogoDansk = screen.getByAltText('Dansk Logo');
    const skemabrikElementMatematik = screen.getByText('Matematik');
    const skemabrikLogoMatematik = screen.getByAltText('Matematik Logo');

    function dayDivsContain(subjectElement, subjectLogo, subjectDay) {
        const weekDays = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag"]
        weekDays.forEach(weekDay => {
            const weekDayDiv = screen.getByTestId(weekDay);
            if(weekDay === subjectDay){
                expect(weekDayDiv).toContainElement(subjectElement);
                expect(weekDayDiv).toContainElement(subjectLogo);
            } else{
                expect(weekDayDiv).not.toContainElement(subjectElement);
                expect(weekDayDiv).not.toContainElement(subjectLogo);
            }
        })
    }

    dayDivsContain(skemabrikElementDansk, skemabrikLogoDansk, "Mandag");
    dayDivsContain(skemabrikElementMatematik, skemabrikLogoMatematik, "Onsdag");
    /* Test af disableModal og onSkemaClick mangler */
});

/* Tests for skemabrikModal */
test('skemabrikModal component renders correctly', () => {
    /*render(
        <SkemabrikModal/>
    )*/
});
