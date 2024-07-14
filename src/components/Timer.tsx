import { useEffect, useState } from 'react';
import PlaybackToggle from './PlaybackToggle';
import Digits from './Digits';
import playIcon from '../assets/play-icon.svg'
import pauseIcon from '../assets/pause-icon.svg'
import Progress from './Progress';
import Settings from './Settings';
import Task from './Task';
import { useTimerContext } from '../contexts/TimerContext';
import './Timer.css'

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

interface SavedSettings {
    workLength: number,
    shortBreakLength: number,
    longBreakLength: number,
    totalSteps: number,
    hasAudioAlert: boolean | undefined,
    hasVisualAlert: boolean | undefined,
}

interface NotificationOptions{
    body: string,
    icon?: string,
    badge?: string,
    requireInteraction: boolean,
    silent: boolean,
    vibration?: boolean;
}

const savedSettings = localStorage.getItem('savedSettings');
let parsedSettings: SavedSettings | null = null;
if(savedSettings !== null){
    parsedSettings = JSON.parse(savedSettings);
}

function Timer() {
    const [workLength, setWorkLength] = useState(parsedSettings ? parsedSettings.workLength : 25); // Default work Interval set to 25 minutes
    const [shortBreakLength, setShortBreakLength] = useState(parsedSettings ? parsedSettings.shortBreakLength : 5)
    const [longBreakLength, setLongBreakLength] = useState(parsedSettings ? parsedSettings.longBreakLength : 20)
    const [remainingTime, setRemainingTime] = useState(parsedSettings ? parsedSettings.workLength * 60 : 25 * 60) // Remaining time in seconds
    const [isPaused, setIsPaused] = useState(true);
    const [timerIntervalId, setTimerIntervalId] = useState<NodeJS.Timeout | undefined>();
    const [currentStep, setCurrentStep] = useState(1)
    const [totalSteps, setTotalSteps] = useState(parsedSettings ? parsedSettings.totalSteps : 8)
    const [isBreak, setIsBreak] = useState(false)
    // const [wasRunning, setWasRunning] = useState(false)
    const [hasVisualAlert, setHasVisualAlert] = useState<boolean | undefined>(parsedSettings ? parsedSettings.hasVisualAlert : false)
    const [hasAudioAlert, setHasAudioAlert] = useState<boolean | undefined>(parsedSettings ? parsedSettings.hasAudioAlert : false)
    const { shouldReapplyTimerState, setShouldReapplyTimerState } = useTimerContext(); // Use the context

    useEffect(() => {
        console.log('inside useEffect to set savedState')
        if(shouldReapplyTimerState){
            console.log('saved state is true so this showed')
            setShouldReapplyTimerState(false)
            const savedState = localStorage.getItem('timerState');
            if (savedState) {
                const parsedState: SavedState = JSON.parse(savedState);
                setRemainingTime(parsedState.remainingTime);
                setWorkLength(parsedState.workLength);
                setShortBreakLength(parsedState.shortBreakLength);
                setLongBreakLength(parsedState.longBreakLength);
                setCurrentStep(parsedState.currentStep);
                setTotalSteps(parsedState.totalSteps);
                setIsBreak(parsedState.isBreak);
                setHasAudioAlert(parsedState.hasAudioAlert);
                setHasVisualAlert(parsedState.hasVisualAlert);
            } 
        }
    }, [shouldReapplyTimerState, setShouldReapplyTimerState])

    useEffect(() => {
        saveSettings();
        if(!shouldReapplyTimerState){
            setTime();
        }
    }, [workLength, shortBreakLength, longBreakLength, totalSteps, hasAudioAlert, hasVisualAlert])



    useEffect(() => {
        if(remainingTime === 0){
            showNotification();
            toggleTimer()
            setCurrentStep((prevStep) => prevStep + 1)
            setIsBreak(!isBreak)
        }
     }, [remainingTime])

     useEffect(() => {
        if (remainingTime === 0){
            setTime() 
        }
        
     }, [currentStep])

    function setTime() {
        if(currentStep > totalSteps){
            setRemainingTime(workLength * 60)
            setCurrentStep(1)
        } else if(currentStep === totalSteps){
            setRemainingTime(longBreakLength * 60)
        } else if(currentStep % 2 === 0){
            setRemainingTime(shortBreakLength * 60)
        } else {
            setRemainingTime(workLength * 60)
        }
    }

    function toggleTimer () {
        if(isPaused){
            const intervalId = setInterval(() => {
                setRemainingTime((prev) => prev - 6)
            }, 1000)
            setTimerIntervalId(intervalId);
            setIsPaused(false);
        } else {
            clearInterval(timerIntervalId);
            setIsPaused(true);
        }
    }

    function applySettings(){
        const timeIntervalsDiv = document.querySelector(".time-intervals");
        if (timeIntervalsDiv) {
            const selectElements = timeIntervalsDiv.querySelectorAll<HTMLSelectElement>("select");
            selectElements.forEach((element) => {
                handleIntervalChange(element)
            });
        }
        const visualAlertElement = document.querySelector('.visual-alert');
        if(visualAlertElement){
            handleNotificationsChange(visualAlertElement);
        }
        const audioAlertElement = document.querySelector('.audio-alert');
        if(audioAlertElement){
            handleNotificationsChange(audioAlertElement);
        }
    }

    function handleNotificationsChange(element: Element) {
        const className = element.className;
        const isChecked = element.querySelector('input')?.checked;
        switch (className) {
            case 'audio-alert':
                setHasAudioAlert(isChecked)
                break;
            case 'visual-alert':
                setHasVisualAlert(isChecked)
                break;
            default:
                break;
        }
    }

    function saveTimerState(){
        const timerState: SavedState = {
            remainingTime,
            workLength,
            shortBreakLength,
            longBreakLength,
            currentStep,
            totalSteps,
            isBreak,
            hasAudioAlert,
            hasVisualAlert,
        };
        console.log('inside saveTimerState, timerState = ', timerState)
        localStorage.setItem('timerState', JSON.stringify(timerState))
    }

    function saveSettings() {
        const settings: SavedSettings = {
            workLength,
            shortBreakLength,
            longBreakLength,
            totalSteps,
            hasAudioAlert,
            hasVisualAlert,
        };
        console.log('inside saveSettings, settings = ', settings)
        localStorage.setItem('savedSettings', JSON.stringify(settings));
    }

    function handleIntervalChange(element: HTMLSelectElement){
        switch (element.id) {
            case "workLength":
                setWorkLength(parseInt(element.value))
                break;
            case "shortBreakLength":
                setShortBreakLength(parseInt(element.value))
                break;
            case "longBreakLength":
                setLongBreakLength(parseInt(element.value))
                break;
            case "workingSessions":
                setTotalSteps(parseInt(element.value) * 2)
                break;
            default:
                break;
        }
    }
    // function handleIntervalChange(event: React.ChangeEvent<HTMLSelectElement>){
    //     switch (event.target.name) {
    //         case "workLength":
    //             setWorkLength(parseInt(event.target.value))
    //             break;
    //         case "shortBreakLength":
    //             setShortBreakLength(parseInt(event.target.value))
    //             break;
    //         case "longBreakLength":
    //             setLongBreakLength(parseInt(event.target.value))
    //             break;
    //         case "workingSessions":
    //             setTotalSteps(parseInt(event.target.value) * 2)
    //             break;
    //         default:
    //             break;
    //     }
    // }

    function handleOpenSettings() {
        const modal = document.querySelector(".modal");
        modal?.classList.add("active")
        if(!isPaused){ 
            // setWasRunning(true); // create a context for wasRunning. use it in settings and in history to restart timer if wasRunning is true
            toggleTimer();
        }
    }

    // function showNotification() {
    //     new Notification('Pomodoro Timer', {
    //         body: 'Your work or break session has ended.',
    //     }).onclick = () => {
    //         ipcRenderer.send('focus-window');
    //     };
    //     ipcRenderer.send('focus-window');
    // }

    // function showNotification() {
    //     console.log('sending focus-window event')
    //     window.ipcRenderer.send('show-notification', 'Pomodoro Timer', 'Your work or break session has ended.');
    //     window.ipcRenderer.send('focus-window');
    // }

    // function showNotification() {

    //     let options: NotificationOptions;
    //     let title: string;

    //     console.log('inside showNotification()')
    //     if (Notification.permission === "granted") {
    //         console.log('notifications granted')
    //         new Notification(title, options);
    //     } else if (Notification.permission !== "denied") {
    //         console.log('requesting notification access')
    //         Notification.requestPermission().then(permission => {
    //             if (permission === "granted") {
    //                 new Notification(title, options);
    //             }
    //         });
    //     } else {
    //         console.log('notification denied')
    //     }
    // }

    function showNotification() {
        let options: NotificationOptions;
        const title: string = 'Pomodoro Timer';

        if(!isBreak && currentStep === totalSteps - 1){
            options = {
                body: "All Sessions Complete! Take a well deserved long break!",
                icon: '/path/to/icon.png',
                requireInteraction: true,
                silent: false,
            }
        } else if(!isBreak) {
            options = {
                body: "Time's up! Take a break!",
                icon: '/path/to/icon.png',
                requireInteraction: true,
                silent: false,
            }
        } else if (isBreak){
            options = {
                body: "Time's up! Get back to work!",
                icon: '/path/to/icon.png',
                requireInteraction: true,
                silent: false,
            }
        }

        // Check if the browser supports notifications
        if (!("Notification" in window)) {
          alert("This browser does not support desktop notification");
          // Check whether notification permissions have already been granted;
          // if so, create a notification
        } else if (Notification.permission === "granted") {
          new Notification(title, options);
        } else if (Notification.permission !== "denied") {
          // We need to ask the user for permission
          Notification.requestPermission().then((permission) => {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
              new Notification(title, options);
            }
          });
        }
    }

    // function requestNotificationPermission() {
    //     if ('Notification' in window) {
    //         Notification.requestPermission().then(permission => {
    //             if (permission === 'granted') {
    //                 console.log('Notification permission granted.');
    //             } else {
    //                 console.log('Notification permission denied.');
    //             }
    //         });
    //     } else {
    //         console.log('This browser does not support notifications.');
    //     }
    // }
    
    // function showNotification(title, options) {
    //     if (Notification.permission === 'granted') {
    //         new Notification(title, options);
    //     }
    // }

    // useEffect(() => {
    //     // Request permission when the component mounts
    //     requestNotificationPermission();

    //     // Test notification
    //     showNotification('Pomodoro Timer', {
    //         body: "Time's up! Take a break!",
    //         icon: '/path/to/icon.png',
    //         requireInteraction: true,
    //         silent: false,
            
    //     });
    //     // setTimeout(() => {
    //     //     showNotification('Pomodoro Timer', {
    //     //         body: "Time's up! Take a break!",
    //     //         icon: '/path/to/icon.png',
    //     //         requireInteraction: true,
    //     //         silent: false,
                
    //     //     });
    //     // }, 5000); // Delay to ensure the component is fully loaded
    // }, []);

    return (
        <div className='container'>
            <Task
                remainingTime={remainingTime}
                workLength={workLength}
                isBreak={isBreak}
                saveTimerState={saveTimerState}
                toggleTimer={toggleTimer}
                isPaused={isPaused}
            />
            <div className='timer-settings'>
                <div className={`timer ${isBreak ? 'break-interval' : 'work-interval'}`}>
                    <Digits 
                        digits={Math.floor(remainingTime / 60).toString()}
                        className='minutes'
                    />  
                    <div className='separator'>
                        {":"}
                    </div>
                    <Digits
                        digits={(remainingTime - Math.floor(remainingTime / 60) * 60).toString()}
                        className='seconds'
                    />
                </div>
                <button 
                    onClick={handleOpenSettings} 
                    className='settings-button'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M9.95401 2.2106C11.2876 1.93144 12.6807 1.92263 14.0449 2.20785C14.2219 3.3674 14.9048 4.43892 15.9997 5.07103C17.0945 5.70313 18.364 5.75884 19.4566 5.3323C20.3858 6.37118 21.0747 7.58203 21.4997 8.87652C20.5852 9.60958 19.9997 10.736 19.9997 11.9992C19.9997 13.2632 20.5859 14.3902 21.5013 15.1232C21.29 15.7636 21.0104 16.3922 20.6599 16.9992C20.3094 17.6063 19.9049 18.1627 19.4559 18.6659C18.3634 18.2396 17.0943 18.2955 15.9997 18.9274C14.9057 19.559 14.223 20.6294 14.0453 21.7879C12.7118 22.067 11.3187 22.0758 9.95443 21.7906C9.77748 20.6311 9.09451 19.5595 7.99967 18.9274C6.90484 18.2953 5.63539 18.2396 4.54272 18.6662C3.61357 17.6273 2.92466 16.4164 2.49964 15.1219C3.41412 14.3889 3.99968 13.2624 3.99968 11.9992C3.99968 10.7353 3.41344 9.60827 2.49805 8.87524C2.70933 8.23482 2.98894 7.60629 3.33942 6.99923C3.68991 6.39217 4.09443 5.83576 4.54341 5.33257C5.63593 5.75881 6.90507 5.703 7.99967 5.07103C9.09364 4.43942 9.7764 3.3691 9.95401 2.2106ZM11.9997 14.9992C13.6565 14.9992 14.9997 13.6561 14.9997 11.9992C14.9997 10.3424 13.6565 8.99923 11.9997 8.99923C10.3428 8.99923 8.99967 10.3424 8.99967 11.9992C8.99967 13.6561 10.3428 14.9992 11.9997 14.9992Z"></path></svg>
                </button>
            </div>
            <div>
                <PlaybackToggle 
                    buttonText={isPaused ? "Start Timer" : "Pause Timer"}
                    icon={isPaused ? playIcon : pauseIcon}
                    onClick={toggleTimer}
                />
            </div>
            <Settings
                workLength={workLength}
                shortBreakLength={shortBreakLength}
                longBreakLength={longBreakLength}
                totalSteps={totalSteps}
                onCloseClick={toggleTimer}
                onSaveClick={applySettings}
                remainingTime={remainingTime}
                isPaused={isPaused}
                hasVisualAlert={hasVisualAlert}
                hasAudioAlert={hasAudioAlert}
                toggleTimer={toggleTimer}
                // handleNotificationsChange={handleNotificationsChange}
            />
            <Progress
                currentStep={currentStep}
                totalSteps={totalSteps}
                isBreak={isBreak}
            />
        </div>
    )
}

export default Timer

