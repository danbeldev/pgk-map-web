import './App.css';
import FieldsPage from "./pages/FieldsPage";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import MapComponent from "./pages/map/Map";
import CreateFieldPage from "./pages/CreateFieldPage";
import EditFieldPage from "./pages/EditFieldPage";
import AuthPage from "./pages/AuthPage";
import RegisterForm from "./pages/RegisterForm";

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    {localStorage.getItem("authToken") !== null ?
                        <>
                            <Route path="/" element={<FieldsPage/>}/>
                            <Route path="/map" element={<MapComponent/>}/>

                            { localStorage.getItem("isAdmin") === "true" &&
                                <>
                                    <Route path="/create" element={<CreateFieldPage/>}/>
                                    <Route path='/fields/:id/edit' element={<EditFieldPage/>}/>
                                </>
                            }
                        </>
                        :
                        <>
                            <Route path='/login' element={<AuthPage/>}/>
                        </>
                    }

                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
