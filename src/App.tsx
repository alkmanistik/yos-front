import {Navigate, Route, Routes} from "react-router";
import AuthPage from "./ui/pages/AuthPage.tsx";
import LayoutPage from "./ui/pages/LayoutPage.tsx";
import HomePage from "./ui/pages/HomePage.tsx";
import AdvicePage from "./ui/pages/AdvicePage.tsx";
import WishPage from "./ui/pages/WishPage.tsx";
import UserPage from "./ui/pages/UserPage.tsx";
import UserUpdateModal from "./ui/components/UserUpdateModal.tsx";
import UserSearchPage from "./ui/pages/UserSearchPage.tsx";

export const App = () => {
    return (
        <Routes>
            <Route path="/auth" element={<AuthPage/>}>
                <Route path="login"/>
                <Route path="register"/>
            </Route>
            <Route path="/" element={<LayoutPage/>}>
                <Route index element={<HomePage/>}/>
                <Route path="advice" element={<AdvicePage/>}/>
                <Route path="wish" element={<WishPage/>}/>
                <Route path="user">
                    <Route index element={<UserPage/>} />
                    <Route path=":id" element={<UserPage/>} />
                    <Route path="search" element={<UserSearchPage/>}/>
                    <Route path="update" element={<UserUpdateModal/>}/>
                </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace/>}/>
        </Routes>
    )
}