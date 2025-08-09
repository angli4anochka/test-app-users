import { Routes, Route } from 'react-router-dom';
import  MainPage from './pages/MainPage.jsx';
import  DetailPage from './pages/DetailedPage.jsx';

export default function App() {
    return (

            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/users/:id" element={<DetailPage />} />
            </Routes>

    );
}
