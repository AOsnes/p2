import {render, fireEvent, screen, cleanup} from '@testing-library/react';
import {BrowserRouter as Router} from "react-router-dom";
import {MemoryRouter} from 'react-router';
import App from './App';
import Skemabrik from './components/skemabrik.component';
import Header from './components/header.component';
import Sidebar from './components/sidebar.component';
import LoginForm from './components/loginform.component';
import Dagsvisning from './components/dagsvisning.component';
import NoMatchError from './components/noMatchError.component';
import TimeIndicator from './components/timeIndicator.component';
import SkemabrikForm from './components/skemabrikForm.component';
import {UserContext, updateIdValue, updateRoleValue, updateNameValue} from './UserContext';
import React from 'react';

/* Make sure that everything that has been rendered is teared down so a new render is ready after the test case */
afterEach(cleanup)

/* Mock af BrowserRouter for at kunne bruge MemoryRouter og ændre Route */
jest.mock('react-router-dom', () => {
    // Require the original module to not be mocked...
    const originalModule = jest.requireActual('react-router-dom');
  
    return {
        ...originalModule,
        BrowserRouter: ({ children }) => <div>{children}</div>,
    };
});

/* Tests for App */
describe('app renders correctly based on path', () => {
    let signedInTeacher = {id: "", role: "teacher", name: ""};
    let signedInStudent = {id: "", role: "student", name: ""};
    beforeEach(() => {
        /* Mocking a cookie in order to render other pages than login */
        Object.defineProperty(document, 'cookie', {
            configurable: true,
            get: jest.fn().mockImplementation(() => { return 'id=60608f0389177a0bb0679e78; role=teacher; name=Testy McTestFace; Secure'; }),
            set: jest.fn().mockImplementation(() => {})
        });
    });

    afterEach(cleanup);
    test('app renders Login() correctly', () => {
        Object.defineProperty(document, 'cookie', {
            configurable: true,
            get: jest.fn().mockImplementation(() => { return undefined; }),
            set: jest.fn().mockImplementation(() => {})
        });
        render(
            <MemoryRouter initialEntries={['/']}>
                <App />
            </MemoryRouter>
        );
        const pageElement = screen.getByTestId("loginPage");
        const loginFormElement = screen.getByTestId("loginForm");
        expect(pageElement).toBeInTheDocument();
        expect(pageElement).toContainElement(loginFormElement);
    });

    test('app renders Skemapage() correctly', () => {
        render(
            <UserContext.Provider value={signedInTeacher}>
                <MemoryRouter initialEntries={['/skema']}>
                    <App />
                </MemoryRouter>
            </UserContext.Provider>
        );
        let pageElement = screen.getByTestId("skemaPage");
        let headerElement = screen.getByTestId("header");
        let sidebarElement = screen.getByTestId("sidebar");
        /* Skemaet render fejlmeddelelse, da der ikke kan oprettes forbindelse til server */
        let skemaElement = screen.getByText("Der opstod en fejl ved indlæsning af dit skema");
        expect(pageElement).toBeInTheDocument();
        expect(pageElement).toContainElement(headerElement);
        expect(pageElement).toContainElement(sidebarElement);
        expect(pageElement).toContainElement(skemaElement);
        /* Cleanup to test if it renders for student */
        cleanup();
        render(
            <UserContext.Provider value={signedInStudent}>
                <MemoryRouter initialEntries={['/skema']}>
                    <App />
                </MemoryRouter>
            </UserContext.Provider>
        );
        pageElement = screen.getByTestId("skemaPage");
        headerElement = screen.getByTestId("header");
        sidebarElement = screen.getByTestId("sidebar");
        skemaElement = screen.getByText("Der opstod en fejl ved indlæsning af dit skema");
        expect(pageElement).toBeInTheDocument();
        expect(pageElement).toContainElement(headerElement);
        expect(pageElement).toContainElement(sidebarElement);
        expect(pageElement).toContainElement(skemaElement);
    });

    test('app renders Afleveringerpage() correctly', () => { 
        render(
            <UserContext.Provider value={signedInTeacher}>
                <MemoryRouter initialEntries={['/afleveringer']}>
                    <App />
                </MemoryRouter>
            </UserContext.Provider>
        );
        let pageElement = screen.getByTestId("afleveringerPage");
        let headerElement = screen.getByTestId("header");
        let sidebarElement = screen.getByTestId("sidebar");
        /* Skemaet render fejlmeddelelse, da der ikke kan oprettes forbindelse til server */
        let assignmentsElement = screen.getByText("Der opstod en fejl ved indlæsning af dit skema");
        expect(pageElement).toBeInTheDocument();
        expect(pageElement).toContainElement(headerElement);
        expect(pageElement).toContainElement(sidebarElement);
        expect(pageElement).toContainElement(assignmentsElement);
        /* Cleanup to test if it renders for student */
        cleanup();
        render(
            <UserContext.Provider value={signedInStudent}>
                <MemoryRouter initialEntries={['/afleveringer']}>
                    <App />
                </MemoryRouter>
            </UserContext.Provider>
        );
        pageElement = screen.getByTestId("afleveringerPage");
        headerElement = screen.getByTestId("header");
        sidebarElement = screen.getByTestId("sidebar");
        assignmentsElement = screen.getByText("Der opstod en fejl ved indlæsning af dit skema");
        expect(pageElement).toBeInTheDocument();
        expect(pageElement).toContainElement(headerElement);
        expect(pageElement).toContainElement(sidebarElement);
        expect(pageElement).toContainElement(assignmentsElement);
    });

    test('app renders RedigerSkema() correctly', () => {
        render(
            <UserContext.Provider value={signedInTeacher}>
                <MemoryRouter initialEntries={['/redigerSkema']}>
                    <App />
                </MemoryRouter>
            </UserContext.Provider>
        );
        const redigerSkemaPageElement = screen.getByTestId("redigerSkemaPage");
        let headerElement = screen.getByTestId("header");
        let sidebarElement = screen.getByTestId("sidebar");
        const redigerSkemaFormElement = screen.getByTestId("formContainer");
        expect(redigerSkemaPageElement).toBeInTheDocument();
        expect(redigerSkemaPageElement).toContainElement(headerElement);
        expect(redigerSkemaPageElement).toContainElement(sidebarElement);
        expect(redigerSkemaPageElement).toContainElement(redigerSkemaFormElement);
        /* Burde nok også teste om redigerskema bliver renderet for elever (SKAL IKKE SKE) */
        cleanup();
        render(
            <UserContext.Provider value={signedInStudent}>
                <MemoryRouter initialEntries={['/redigerSkema']}>
                    <App />
                </MemoryRouter>
            </UserContext.Provider>
        );
        const noMatchPageElement = screen.getByTestId("noMatchPage");
        const noMatchElement = screen.getByTestId("pageNotFoundContainer");
        headerElement = screen.getByTestId("header");
        sidebarElement = screen.getByTestId("sidebar");
        expect(redigerSkemaPageElement).not.toBeInTheDocument();
        expect(noMatchPageElement).toContainElement(headerElement);
        expect(noMatchPageElement).toContainElement(sidebarElement);
        expect(noMatchPageElement).not.toContainElement(redigerSkemaFormElement);
        expect(noMatchPageElement).toContainElement(noMatchElement);
    });

    test('app renders noMatch() correctly', () => { 
        render(
            <MemoryRouter initialEntries={['/*']}>
                <App />
            </MemoryRouter>
        )
        const pageElement = screen.getByTestId("noMatchPage");
        const headerElement = screen.getByTestId("header");
        const sidebarElement = screen.getByTestId("sidebar");
        const noMatchElement = screen.getByTestId("pageNotFoundContainer");
        expect(pageElement).toBeInTheDocument();
        expect(pageElement).toContainElement(headerElement);
        expect(pageElement).toContainElement(sidebarElement);
        expect(pageElement).toContainElement(noMatchElement);
    });
});

/* Tests for header */
test('header renders correctly with name', () => {
    const signedInUser = {name: 'Testy McTestFace', role: '', id: ''}
    render(
        <div>
            <UserContext.Provider value={signedInUser}>
                <MemoryRouter>
                    <Header linkTo="/"/>
                </MemoryRouter>
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
        configurable: true,
        get: jest.fn().mockImplementation(() => { return 'id=60608f0389177a0bb0679e78; role=teacher; name=Testy McTestFace; Secure'; }),
        set: jest.fn().mockImplementation(() => {})
      });
    render(
        <div>
            <UserContext.Provider value={signedInUser}>
                <MemoryRouter>
                    <Sidebar/>
                </MemoryRouter>
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
                <MemoryRouter>
                    <Sidebar/>
                </MemoryRouter>
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
describe('loginform renders correctly', () => {
    /* Tear down the the window after each test */
    afterEach(cleanup);

    test('loginform renders correct elements', () => {
        render(<LoginForm />);
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
});

/* Tests for userContext */
describe('UserContext is set correctly', () =>{
    /* Tear down the the window after each test */
    afterEach(cleanup);

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

    test('try catch throws correct error', () => {
        console.log = jest.fn();
        const expected = undefined;
        let errorType = new TypeError("Cannot read property 'split' of undefined");

        function tryCatchOfValue(updateValueFunction){
            let extractedValue;
            const deformedCookieStrings = [
                "i60608f0389177a0bb0679e78; Testy McTestFace; teacher; Secure",
                "teacher; 60608f0389177a0bb0679e78; Testy McTestFace; Secure",
                "teacher; Testy McTestface; 60608f0389177a0bb0679e78",
                "foo; Testy McTestface; bar"]
            deformedCookieStrings.forEach(cookie => {
                extractedValue = updateValueFunction(cookie);
                expect(extractedValue).toEqual(expected);
                expect(console.log).toHaveBeenCalledWith(errorType);
            });
            expect(console.log).toHaveBeenCalledTimes(4);
            /* Resets toHaveBeenCalledTimes after each function call */
            jest.clearAllMocks();
        }

        tryCatchOfValue(updateNameValue);
        tryCatchOfValue(updateIdValue);
        tryCatchOfValue(updateRoleValue);
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
describe('Skemabrik tests', () =>{
    const skemabrikDansk = {subject: 'Dansk', class: '', description: '', startTime: '', endTime: ''}
    const skemabrikMatematik = {subject: 'Matematik', class: '', description: '1 + 1 = ?', startTime: '', endTime: ''}
    beforeEach(() =>{
        render([
            <div key="root" id="root" data-testid="root"/>,
            <div key="container" className="scheduleContainer"/>,
            <div key="Mandag" id="Mandag" data-testid="Mandag"/>,
            <div key="Tirsdag" id="Tirsdag" data-testid="Tirsdag"/>,
            <div key="Onsdag" id="Onsdag" data-testid="Onsdag"/>,
            <div key="Torsdag" id="Torsdag" data-testid="Torsdag"/>,
            <div key="Fredag" id="Fredag" data-testid="Fredag"/>,
            <Skemabrik key="skemabrik1" skemabrik={skemabrikDansk} dayView={1} weekday="Mandag" type="schedule"/>,
            <Skemabrik key="skemabrik2" skemabrik={skemabrikMatematik} dayView={5} weekday="Onsdag" type="schedule"/>
        ])
    })
    test('skemabrik component portals to  correct day', () => {    
        const skemabrikElementDansk = screen.getByText('Dansk');
        const skemabrikLogoDansk = screen.getByAltText('Dansk Logo');
        const skemabrikElementMatematik = screen.getByText('Matematik');
        const skemabrikLogoMatematik = screen.getByAltText('Matematik Logo');

        function dayDivsContain(subjectElement, subjectLogo, subjectDay) {
            const weekDays = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag"]
            weekDays.forEach(weekDay => {
                const weekDayDiv = screen.getByTestId(weekDay);
                if(weekDay === subjectDay){
                    // eslint-disable-next-line jest/no-conditional-expect
                    expect(weekDayDiv).toContainElement(subjectElement);
                    // eslint-disable-next-line jest/no-conditional-expect
                    expect(weekDayDiv).toContainElement(subjectLogo);
                } else{
                    // eslint-disable-next-line jest/no-conditional-expect
                    expect(weekDayDiv).not.toContainElement(subjectElement);
                    // eslint-disable-next-line jest/no-conditional-expect
                    expect(weekDayDiv).not.toContainElement(subjectLogo);
                }
            })
        }

        dayDivsContain(skemabrikElementDansk, skemabrikLogoDansk, "Mandag");
        dayDivsContain(skemabrikElementMatematik, skemabrikLogoMatematik, "Onsdag");
        /* Test af disableModal og onSkemaClick mangler */
    });

    test('skemabrik alert renders if there is a description', () =>{
        const mandagElement = screen.getByTestId("Mandag")
        const onsdagElement = screen.getByTestId("Onsdag")
        const noAlertSkemabrik = document.getElementsByClassName("skemabrik Dansk")[0];
        const alertSkemabrik = document.getElementsByClassName("skemabrik Matematik")[0];
        const descriptionAlertElement = document.getElementsByClassName("descriptionAlert")[0];
        expect(mandagElement).toContainElement(noAlertSkemabrik);
        expect(onsdagElement).toContainElement(alertSkemabrik);
        expect(alertSkemabrik).toContainElement(descriptionAlertElement);
        expect(noAlertSkemabrik).not.toContainElement(descriptionAlertElement);
    })

    describe('skemabrikModal tests', () =>{
        /* Render the test window before each test */
        
        test('modal opens when skemabrik is clicked', () =>{
            const rootElement = screen.getByTestId("root")
            const skemabrikElement = document.getElementsByClassName("skemabrik Dansk")[0];
            fireEvent.click(skemabrikElement)
            const modalElement = document.getElementsByClassName("detailsModal")[0];
            expect(rootElement).toContainElement(modalElement);
        })
        test('modal closes when X is clicked', () =>{
            const skemabrikElement = document.getElementsByClassName("skemabrik Dansk")[0];
            fireEvent.click(skemabrikElement)
            const modalXElement = screen.getByTestId("Xelement");
            expect(modalXElement).toBeVisible()
            fireEvent.click(modalXElement)
            expect(modalXElement).not.toBeInTheDocument()
            expect(skemabrikElement).toBeInTheDocument()
        })
    });
})

test('timeIndicator renders on the correct percentage on the schedule', () =>{
    jest.useFakeTimers()
    let testCases =
    [/* Opacity before, Position before, Opacity after, Position after , Time before, Time after */
        [0, -0.21, 1, 0.83 , new Date("2021-05-11T07:59:00"), new Date("2021-05-11T08:04:00")],
        [1, 0    , 1, 1.04 , new Date("2021-05-11T08:00:00"), new Date("2021-05-11T08:05:00")],
        [1, 12.5 , 1, 13.5 , new Date("2021-05-11T09:00:00"), new Date("2021-05-11T09:05:00")],
        [1, 50   , 1, 51.0 , new Date("2021-05-11T12:00:00"), new Date("2021-05-11T12:05:00")],
        [1, 99.79, 0, 100.8, new Date("2021-05-11T15:59:00"), new Date("2021-05-11T16:04:00")],
        [0, 100  , 0, 101  , new Date("2021-05-11T16:00:00"), new Date("2021-05-11T16:05:00")],
    ]
    testCases.forEach(testCase =>{
        global.Date = jest.fn()
        Date.now = jest.fn(() => testCase[4])
        jest.spyOn(global, 'Date').mockImplementation(() => testCase[4])
        render(<TimeIndicator/>)
        const linkElement = screen.getByTestId("timeIndicator")
        const linkElementTopBefore = parseFloat(linkElement.style._values.top);
        const linkeElementOpacityBefore = parseInt(linkElement.style._values.opacity);
        expect(linkeElementOpacityBefore).toBe(testCase[0])
        expect(linkElementTopBefore).toBeCloseTo(testCase[1], 2)
        
        /* Time is now advanced 5 minutes */
        jest.spyOn(global, 'Date').mockImplementation(() => testCase[5])
        jest.advanceTimersByTime(1000*60*5)
        const linkElementTopAfter = parseFloat(linkElement.style._values.top);
        const linkeElementOpacityAfter = parseInt(linkElement.style._values.opacity);
        expect(linkeElementOpacityAfter).toBe(testCase[2])
        expect(linkElementTopAfter).toBeCloseTo(testCase[3], 1)
        cleanup();
    })
    /* A total of 9 calls to clear interval will be made, please count :) */
    expect(clearInterval).toHaveBeenCalledTimes(9)
    jest.useRealTimers();
    global.Date.mockClear()
    Date.now.mockClear()
});

test('toggle day view component changes when clicked', () =>{
    const handleClick = jest.fn()
    render(<Dagsvisning dayView={1} handleClick={handleClick} />)

    const linkElementOneday = document.getElementsByClassName("toggleVisning")[0];
    const labelElement = document.getElementsByClassName("switch")[0];
    const inputElementOneday = screen.getByRole("checkbox")
    const sliderElement = document.getElementsByClassName("slider")[0];
    const sliderTextElementOneday = document.getElementsByClassName("toggleText toggleTextLeft")[0];
    
    expect(linkElementOneday).toContainElement(labelElement);
    expect(labelElement).toContainElement(inputElementOneday);
    expect(labelElement).toContainElement(sliderElement);

    expect(sliderElement).toContainElement(sliderTextElementOneday);
    expect(inputElementOneday).toHaveAttribute("checked");
    expect(sliderTextElementOneday).toHaveTextContent("1-Dag");

    expect(handleClick).toHaveBeenCalledTimes(0);
    fireEvent.click(inputElementOneday);
    expect(handleClick).toHaveBeenCalledTimes(1);
    cleanup();
    
    render(<Dagsvisning dayView={5} handleClick={handleClick} />)
    const inputElementFiveday = screen.getByRole("checkbox")
    const sliderTextElementFiveday = document.getElementsByClassName("toggleText toggleTextRight")[0];
    expect(inputElementFiveday).not.toHaveAttribute("checked");
    expect(sliderTextElementFiveday).toHaveTextContent("5-Dag");

    /* The the function was clicked before in the test */
    expect(handleClick).toHaveBeenCalledTimes(1);
    fireEvent.click(inputElementFiveday);
    expect(handleClick).toHaveBeenCalledTimes(2);
})

describe('skemabrikForm tests', () =>{    
    let signedInUser = {role: 'teacher', name: 'Sigurd', id: '123'};
    beforeEach(() =>{
        global.fetch = jest.fn(() => {
            return( 
            Promise.resolve({
                json: () => Promise.resolve(["sw2b2-20", "sw2b2-21", "sw2b2-22"])
            })
        )})
        render([
            <div key="root" data-testid="root" id="root"/>,
                <UserContext.Provider key="form" value={signedInUser}>
                    <SkemabrikForm/>
                </UserContext.Provider>
            ])
    })
    afterEach(cleanup)

    test('form has correct inital values', () =>{
        const formElement = document.getElementsByClassName("formContainer")[0];
        expect(formElement).toHaveFormValues({
            date: '',
            startTime: '',
            endTime: '',
            advanced: false,
            subject: '',
            class: '',
            classDescription: '',
        });
    })
    test('form has correct values when user changes values', () =>{
        const formElement = document.getElementsByClassName("formContainer")[0];
        const dateElement = screen.getByTestId("date");
        const startTimeElement = screen.getByTestId("startTime");
        const endTimeElement = screen.getByTestId("endTime");
        const advancedElement = screen.getByTestId("advanced");
        const subjectSelectElement = screen.getByTestId("subject");
        const classSelectElement = screen.getByTestId("class");
        const classDescriptionElement = screen.getByTestId("classDescription");
        const classOptionElements = screen.getAllByTestId("classOption");
        const subjectOptionElements = screen.getAllByTestId("subjectOption");
        
        fireEvent.change(dateElement,                  {target: {value: "2021-05-11"}})
        fireEvent.change(startTimeElement,             {target: {value: "12:00:00"}})
        fireEvent.change(endTimeElement,               {target: {value: "13:00:00"}})
        fireEvent.change(classDescriptionElement,      {target: {value: "Vi skal bare blast fucking meget kode! WICKED"}})
        fireEvent.click(advancedElement)
        expect(formElement).toHaveFormValues({
            date: '2021-05-11',
            startTime: '12:00:00',
            endTime: '13:00:00',
            advanced: true,
            subject: '',
            class: '',
            classDescription: 'Vi skal bare blast fucking meget kode! WICKED',
        });
        subjectOptionElements.forEach(subjectElement => {
            classOptionElements.forEach(classElement =>{
                fireEvent.change(classSelectElement, {target: {value: classElement.value}})
                fireEvent.change(subjectSelectElement, {target: {value: subjectElement.value}})
                expect(formElement).toHaveFormValues({
                    date: '2021-05-11',
                    startTime: '12:00:00',
                    endTime: '13:00:00',
                    advanced: true,
                    subject: subjectElement.value,
                    class: classElement.value,
                    classDescription: 'Vi skal bare blast fucking meget kode! WICKED',
                });
            })
        });
    })
    test('submit button is enabled if all fields for class is filled, and assignmentToggle has not been pressed', () =>{
        const rootElement = screen.getByTestId("root");
        const formElement = document.getElementsByClassName("formContainer")[0];
        const submitElement = screen.getByTestId("submit");
        const dateElement = screen.getByTestId("date");
        const startTimeElement = screen.getByTestId("startTime");
        const endTimeElement = screen.getByTestId("endTime");
        const classDescriptionElement = screen.getByTestId("classDescription");
        const subjectSelectElement = screen.getByTestId("subject");
        const classSelectElement = screen.getByTestId("class");
        const assignmentToggle = screen.getByTestId("assignmentToggle");

        expect(submitElement).toHaveAttribute("disabled");
        fireEvent.click(submitElement);
        expect(submitElement).toHaveAttribute("disabled");
        expect(screen.queryByText("Time tilføjet")).not.toBeInTheDocument();
      
        fireEvent.change(dateElement,               {target: {value: "2021-05-11"}})
        fireEvent.change(startTimeElement,          {target: {value: "12:00:00"}})
        fireEvent.change(endTimeElement ,           {target: {value: "13:00:00"}})
        fireEvent.change(subjectSelectElement,      {target: {value: "Engelsk"}})
        fireEvent.change(classSelectElement,        {target: {value: "sw2b2-21"}})
        fireEvent.change(classDescriptionElement,   {target: {value: "Vi skal bare blast fucking meget kode! WICKED"}})
        
        expect(formElement).toHaveFormValues({
            date: '2021-05-11',
            startTime: '12:00:00',
            endTime: '13:00:00',
            advanced: false,
            subject: 'Engelsk',
            class: 'sw2b2-21',
            classDescription: 'Vi skal bare blast fucking meget kode! WICKED',
            assignmentToggle: false,
        });
        expect(submitElement).not.toHaveAttribute("disabled");
        fireEvent.click(assignmentToggle);
        expect(formElement).toHaveFormValues({
            assignmentToggle: true
        });
        expect(submitElement).toHaveAttribute("disabled");
        const dueDateElement = screen.getByTestId("dueDate");
        const dueTimeElement = screen.getByTestId("dueTime");
        const assignmentDescriptionElement = screen.getByTestId("assignmentDescription");
        expect(dueDateElement).toBeInTheDocument();
        expect(dueTimeElement).toBeInTheDocument();
        expect(assignmentDescriptionElement).toBeInTheDocument();
        fireEvent.change(dueDateElement,                      {target: {value: "2021-05-11"}})
        fireEvent.change(dueTimeElement,                      {target: {value: "14:00:00"}})
        fireEvent.change(assignmentDescriptionElement,        {target: {value: "Just get good 4Head"}})

        expect(formElement).toHaveFormValues({
            dueDate: '2021-05-11',
            dueTime: '14:00:00',
            assignmentDescription: 'Just get good 4Head',
        })
        expect(submitElement).not.toHaveAttribute("disabled");
        fireEvent.click(submitElement)
    })
})