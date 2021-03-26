import './App.css';

import Navbar from "./components/navbar.component";
import ClassForm from "./components/classform.component";
import LoginForm from "./components/loginform.component";

function App() {
  return (
    <div className="App">
      <Navbar></Navbar>
      <ClassForm></ClassForm>
      <LoginForm></LoginForm>
    </div>
  );
}

export default App;
