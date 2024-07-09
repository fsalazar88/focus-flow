import { useEffect } from 'react';
import './Settings.css'

interface SavedState {
    remainingTime: number,
    workLength: number,
    shortBreakLength: number,
    longBreakLength: number,
    currentStep: number;
    totalSteps: number,
    isBreak: boolean,
    hasAudioAlert: boolean | undefined,
    hasVisualAlert: boolean | undefined,
}

interface SettingsProps {
    shortBreakLength: number, 
    longBreakLength: number,
    workLength: number,
    // onChange: (element: HTMLSelectElement) => void;
    onCloseClick: () => void,
    onSaveClick: () => void,
    toggleTimer: () => void,
    totalSteps: number,
    color?: string, // Stretch Goal --> Add ability for user to select color theme
    audioCompletionNotification?: boolean,
    remainingTime: number,
    isPaused: boolean,
    hasAudioAlert: boolean | undefined,
    hasVisualAlert: boolean | undefined,

}

function Settings ( { shortBreakLength, longBreakLength, workLength, onCloseClick, totalSteps, onSaveClick, remainingTime, isPaused, toggleTimer }: SettingsProps ) {

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
        // const remainingMinutes = Math.floor(remainingTime / 60);
        const modal = document.querySelector(".modal")
        if(modal?.classList.contains("active")){
            modal.classList.remove("active")
        }
     
        // const savedState = localStorage.getItem('timerState');
        // let parsedState: SavedState | null = null;
        // if(savedState !== null){
        //     parsedState = JSON.parse(savedState);
        // }
        // if(isPaused && remainingTime !== shortBreakLength*60 && remainingTime !== longBreakLength*60 && remainingTime !== workLength*60 && remainingTime !== parsedState?.remainingTime){
        //     onCloseClick();
        // }
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
                            <select name="workLength" defaultValue={workLength} id="workLength">
                                <option value={1}>1</option>
                                <option value={20}>20</option>
                                <option value={25}>25</option>
                                <option value={30}>30</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="shortBreakLength">Short Break Length:</label>
                            <select name="shortBreakLength" defaultValue={shortBreakLength} id="shortBreakLength">
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="longBreakLength">Long Break Length:</label>
                            <select name="longBreakLength" defaultValue={longBreakLength} id="longBreakLength">
                                <option value={2}>2</option>
                                <option value={15}>15</option>
                                <option value={20}>20</option>
                                <option value={25}>25</option>
                                <option value={30}>30</option>
                            </select>
                        </div>
                        <div>
                        <label htmlFor="workingSessions">Number of Working Sessions:</label>
                            <select name="workingSessions" defaultValue={totalSteps / 2} id="workingSessions">
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
                                    <input type="checkbox" />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                            <div className='visual-alert'>   
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
                <button onClick={onSaveClick} id='apply'>
                    Apply Settings
                </button>
            </div>
        </div>
    )
}

export default Settings