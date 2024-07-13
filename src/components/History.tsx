import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTimerContext } from '../contexts/TimerContext';
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
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editedDescription, setEditedDescription] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [showNotification, setShowNotification] = useState(false);

    const { setShouldReapplyTimerState } = useTimerContext(); // Use the context
    const navigate = useNavigate();

    useEffect(() => {
        const savedHistory = localStorage.getItem('history');
        if(savedHistory !== null){
            try{
                const parsedHistory: Task[] = JSON.parse(savedHistory);
                setTaskHistory(parsedHistory);
                setDisplayedHistory(parsedHistory);
            } catch(error) {
                console.error('Failed to parse task history from local storage: ', error);
            }
        }
    }, [])

    useEffect(() => {
        if(searchQuery.length > 0){
            const filteredHistory = taskHistory.filter(task => task.description.toLowerCase().includes(searchQuery.toLowerCase()));
            setDisplayedHistory(filteredHistory)
        } else {
            setDisplayedHistory(taskHistory)
        }    
    }, [searchQuery, taskHistory])

    function handleClick() {
        setShouldReapplyTimerState(true) // Set the flag when navigating to '/'
        navigate('/')
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (isEditing) {
            return;
        }
        setSearchQuery(e.target.value);
    }

    function handleFocus() {    
        if(isEditing){
            setShowNotification(true)
        }
        setIsInputFocused(true);
    }

    function handleBlur() {
        setIsInputFocused(false);
        setShowNotification(false);
    }

    function handleEdit(index: number, description: string) {
        setEditingIndex(index);
        setEditedDescription(description);
        setIsEditing(true);
    }

    function handleSave(index: number) {
        const updatedHistory = [...taskHistory];

        for(let i = 0; i < updatedHistory.length; i++){
            if(displayedHistory[index].date === updatedHistory[i].date){
                updatedHistory[i].description = editedDescription;
            }
        }
        //updatedHistory[index].description = editedDescription;
        setTaskHistory(updatedHistory);
        //setDisplayedHistory(updatedHistory);
        localStorage.setItem('history', JSON.stringify(updatedHistory));
        setEditingIndex(null);
        setIsEditing(false);
    }

    return (
        <div className="history-container">
            {taskHistory.length > 0 && (
                <>
                    <div className={`search ${(showNotification && isInputFocused) ? 'with-notification' : ''}`}>
                        <h3>Search:</h3>
                        <input 
                            type="text" 
                            value={searchQuery} 
                            onChange={handleChange} 
                            readOnly={isEditing} 
                            onFocus={handleFocus}
                            onBlur={handleBlur}    
                        />
                    </div>
                    {showNotification && isInputFocused && <p className="notification">Finish editing the task description before searching.</p>}
                </>
            )}
            <h2>Task History</h2>
            <button onClick={handleClick} id={'close-history'}>{'x'}</button>
            {taskHistory.length === 0 ? (
                <p>No completed tasks yet.</p>
            ) : (
                <ul className="history-list">
                    {displayedHistory.map((task, index) => (
                        <li key={task.date} className="history-item">
                            {editingIndex === index ? (
                                <>
                                    <div className='edit-task'>
                                        <input type="text" value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)}/>
                                        <button onClick={() => handleSave(index)} className='edit-save'>Save</button>
                                    </div>
                                </>
                            ) : (
                                <>  
                                    <div className='edit-task'>
                                        <h3>{task.description}</h3>
                                        <button onClick={() => handleEdit(index, task.description)} className='edit-save'>Edit</button>
                                    </div>
                                </>
                            )}
                            <>
                                <p>Time Spent: {task.timeSpent} minutes</p>
                                <p> &middot; </p>
                                <p>Date: {new Date(task.date).toLocaleString('en-US', {dateStyle: 'short', timeStyle: 'short' })}</p>
                            </>
                        </li>
                    ))}
                </ul>
            )}
            {displayedHistory.length === 0 && searchQuery && <p>No tasks match search criteria</p>}
        </div>
    );
}

export default History