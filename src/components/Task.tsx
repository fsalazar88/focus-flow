import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Task.css";

interface TaskProps {
    remainingTime: number,
    workLength: number,
    isBreak: boolean,
}

interface Task {
    description: string,
    timeSpent: number,
    date: string,
}

function Task( {remainingTime, workLength, isBreak}: TaskProps ) {

    const [task, setTask] = useState('')
    const [taskHistory, setTaskHistory] = useState<Task[]>([])
    const navigate = useNavigate();

    useEffect(() => {
        if(remainingTime === 0 && !isBreak){

            const newTask: Task = {
                description: task.length ? task : 'No Description',
                timeSpent: workLength,
                date: new Date().toISOString(),
            }
            const updatedHistory = [...taskHistory, newTask];
            setTaskHistory(updatedHistory)
            localStorage.setItem('history', JSON.stringify(updatedHistory))
        }
    }, [remainingTime])

    // useEffect(() => {
    //     console.log("taskHistory: ", taskHistory)
    // }, [taskHistory])

    function handleClick(){
        navigate('timer/history');
    }


    function handleChange(event: React.ChangeEvent<HTMLInputElement>){
        setTask(event.target.value)
    }

    return (
        <div className="task">
            <h3>Current Task:</h3>
            <div className="input-button">
                <input type="text" value={task} onChange={handleChange}/>
                <button className="history" onClick={handleClick}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12H4C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C9.53614 4 7.33243 5.11383 5.86492 6.86543L8 9H2V3L4.44656 5.44648C6.28002 3.33509 8.9841 2 12 2ZM13 7L12.9998 11.585L16.2426 14.8284L14.8284 16.2426L10.9998 12.413L11 7H13Z"></path></svg>
                </button>
            </div>
        </div>
    )
}

export default Task
