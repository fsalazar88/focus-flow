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
    const [displayedHistory, setDisplayedHistory] = useState<Task[]>([])
    const [searchQuery, setSearchQuery] = useState('')
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

    useEffect(() => {
        if(searchQuery.length > 0){
            const filteredHistory = taskHistory.filter(task => task.description.includes(searchQuery));
            setDisplayedHistory(filteredHistory)
        } else {
            setDisplayedHistory(taskHistory)
        }    
    }, [searchQuery, taskHistory])

    function handleClick() {
        navigate('/')
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSearchQuery(e.target.value)
    }

    return (
        <div className="history-container">
            {taskHistory.length > 0 && (
                <div className='search'>
                    <h3>Search:</h3>
                    <input type="text" value={searchQuery} onChange={handleChange}/>
                </div>
            )}
            <h2>Task History</h2>
            <button onClick={handleClick}>{'x'}</button>
            {taskHistory.length === 0 ? (
                <p>No completed tasks yet.</p>
            ) : (
                <ul className="history-list">
                    {displayedHistory.map((task, index) => (
                        <li key={index} className="history-item">
                            <h3>{task.description}</h3>
                            <p>Time Spent: {task.timeSpent} minutes</p>
                            <p>Date: {new Date(task.date).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            )}
            {displayedHistory.length === 0 && <p>No tasks match search criteria</p>}
        </div>
    );
}

export default History