import { createRoot } from 'react-dom/client'
import {BrowserRouter, Route, Routes} from "react-router";
import './index.css';
import AuthPage from "./ui/AuthPage.tsx";

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={null} />
            <Route path="/home" element={null} />
            <Route path="/auth">
                <Route path="login" element={<AuthPage />} />
                <Route path="register" element={<AuthPage />} />
            </Route>
            <Route path="/advice" element={null} />
            <Route path="/wish" element={null} />
            <Route path="/user" element={null} />
        </Routes>
    </BrowserRouter>,
)
