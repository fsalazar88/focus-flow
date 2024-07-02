import { Routes, Route } from 'react-router-dom';
import History from './History';
import Timer from './Timer';

function Pomodoro() {
    return (
            <Routes>
                <Route path="/" element={<Timer key={location.pathname} />} />
                <Route path="/timer/history" element={<History key={location.pathname} />} />
            </Routes>
    );
}

export default Pomodoro;
