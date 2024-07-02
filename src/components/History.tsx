import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './History.css';

interface Task {
    description: string,
    timeSpent: number,
    date: string,
}

function History () {

    const [taskHistory, setTaskHistory] = useState<Task[]>([])
    const navigate = useNavigate();

    useEffect(() => {
        console.log('History: initial render fired')
        const savedHistory = localStorage.getItem('history');
        if(savedHistory !== null){
            try{
                const parsedHistory: Task[] = JSON.parse(savedHistory);
                setTaskHistory(parsedHistory)
            } catch(error) {
                console.error('Failed to parse task history from local storage: ', error);
            }
        }
    }, [])

    function handleClick() {
        navigate('/')
    }

    return (
        <div className="history-container">
            <h2>Task History</h2>
            <button onClick={handleClick}>{'x'}</button>
            {taskHistory.length === 0 ? (
                <p>No completed tasks yet.</p>
            ) : (
                <ul className="history-list">
                    {taskHistory.map((task, index) => (
                        <li key={index} className="history-item">
                            <h3>{task.description}</h3>
                            <p>Time Spent: {task.timeSpent} minutes</p>
                            <p>Date: {new Date(task.date).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default History