import { useEffect } from 'react';
import './Settings.css'

interface SettingsProps {
    shortBreakLength: number; 
    longBreakLength: number;
    workLength: number;
    onChange: (element: HTMLSelectElement) => void;
    onClick: () => void;
    totalSteps: number;   
    color?: string; // Stretch Goal --> Add ability for user to select color theme
    audioCompletionNotification?: boolean;
}

function Settings ( { shortBreakLength, longBreakLength, workLength, onChange, totalSteps, onClick }: SettingsProps ) {

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent){
            const modal = document.querySelector(".modal")
            if(modal?.classList.contains("active")){
                if(e.key === "Escape"){
                    modal.classList.remove("active")
                }
            }
        }
    
        function handleClickOutside(e: MouseEvent){
            const modal = document.querySelector(".modal")
            if(modal && modal.classList.contains("active")){
                const modalContent = document.querySelector(".modal-content")
                const settingsButton = document.querySelector(".settings-button")
                if(modalContent && !modalContent.contains(e.target as Node) && settingsButton !== e.target){
                    console.log(!modalContent.contains(e.target as Node))
                    modal.classList.remove("active")
                }
            }
        }
    
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('click', handleClickOutside); 
        };
    }, []);

    function closeSettings() {
        const modal = document.querySelector(".modal")
        if(modal?.classList.contains("active")){
            modal.classList.remove("active")
        }
    }

    return (
        <div className='modal'>
            <div className='modal-content'>                                                                                             
                <button className="close-button" onClick={closeSettings}>{'x'}</button>
                <div className="settings">
                    <div className='time-intervals'>
                        <h2>Time Intervals</h2>
                        <div>
                            <label htmlFor="workLength">Work Session Length:</label>
                            <select name="workLength" defaultValue={25} id="workLength">
                                <option value={1}>1</option>
                                <option value={20}>20</option>
                                <option value={25}>25</option>
                                <option value={30}>30</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="shortBreakLength">Short Break Length:</label>
                            <select name="shortBreakLength" defaultValue={5} id="shortBreakLength">
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="longBreakLength">Long Break Length:</label>
                            <select name="longBreakLength" defaultValue={20} id="longBreakLength">
                                <option value={2}>2</option>
                                <option value={15}>15</option>
                                <option value={20}>20</option>
                                <option value={25}>25</option>
                                <option value={30}>30</option>
                            </select>
                        </div>
                        <div>
                        <label htmlFor="workingSessions">Number of Working Sessions:</label>
                            <select name="workingSessions" defaultValue={4} id="workingSessions">
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                            </select>
                        </div>
                    </div>
                    <div className='notifications'>
                        <h2>Notifications</h2>
                        <div>
                            <div className='audio-alert'>   
                                <p>Audio Alert</p>
                                <label className="switch">
                                    <input type="checkbox"/>
                                    <span className="slider round"></span>
                                </label>
                            </div>
                            <div className='move-to-front'>   
                                <p>Visual Alert</p>
                                <label className="switch">
                                    <input type="checkbox"/>
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div>
                        
                    </div>
                </div>
                <button onClick={onClick} id='apply'>
                    Apply Settings
                </button>
            </div>
        </div>
    )
}

export default Settings