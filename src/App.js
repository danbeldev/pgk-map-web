import './App.css';
import FieldsPage from "./pages/FieldsPage";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import MapComponent from "./pages/map/Map";
import CreateFieldPage from "./pages/CreateFieldPage";
import EditFieldPage from "./pages/EditFieldPage";

function App() {
  return (
      <BrowserRouter>
          <div className="App">
              <Routes>
                  <Route path="/" element={<FieldsPage/>} />
                  <Route path="/map" element={<MapComponent/>} />
                  <Route path="/create" element={<CreateFieldPage/>} />
                  <Route path='/fields/:id/edit' element={<EditFieldPage/>}/>
              </Routes>
          </div>
      </BrowserRouter>
  );
}

export default App;
