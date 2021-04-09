import './App.css';

import Navbar from "./components/navbar.component";
import ClassForm from "./components/classform.component";
import LoginForm from "./components/loginform.component";
import Sidebar from "./components/sidebar.component";

function App() {
  return (
    <div className="App">
      <Navbar></Navbar>
      <Sidebar></Sidebar>
      <LoginForm></LoginForm>
      <ClassForm></ClassForm>
    </div>
  );
}

export default App;
