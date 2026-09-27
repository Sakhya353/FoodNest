
import './App.css';
import Home from './screens/Home';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Login from './screens/Login';
import '../node_modules/bootstrap-dark-5/dist/css/bootstrap-dark.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
import Signup from './screens/Signup';
import { CartProvider } from './components/ContextReducer';
import MyOrder from './screens/MyOrder';
import { Shampoo } from './screens/Shampoo';
import { Chips } from './screens/Chips';
import { Chocolate } from './screens/Chocolate';

function App() {
  return (
    <CartProvider>
    <Router>
    <div >
      <Routes>
        <Route exact path="/" element={<Home/>} />
        <Route exact path="/login" element={<Login/>} />
        <Route exact path="/createuser" element={<Signup/>} />
        <Route exact path="/myOrder" element={<MyOrder/>} />
        <Route exact path='/Shampoo' element={<Shampoo/>}/>
        <Route exact path='/Chips' element={<Chips/>}/>
        <Route exact path='/Choclate' element={<Chocolate/>}/>

      </Routes>
    </div>
    </Router>
    </CartProvider>
  );
}

export default App;
