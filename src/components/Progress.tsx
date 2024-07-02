import React from 'react'
import './Progress.css'

interface SettingsProps {
    currentStep: number,
    totalSteps: number,
    isBreak: boolean
}

function Progress({ currentStep, totalSteps, isBreak }: SettingsProps) {
    return (
        <div className="steps-container">
            {Array.from({ length: totalSteps/2 }).map((_, index) => (
                    
                <React.Fragment key={index}>
                    <div
                        key={`step-${index}`}
                        // className={`step ${index < currentStep ? ((index+1) % 2 === 0 ? 'active-break' : 'active-work') : ''} ${(index+1) < currentStep ? 'completed' : ''} ${(index+1) === currentStep ? 'current' : ''}`}
                        className={`step ${index < (currentStep - Math.floor(currentStep/2)) ? 'active-work' : ''} ${((index+1) + Math.floor(currentStep/2)) < currentStep ? 'completed' : ''} ${((index+1) + Math.floor(currentStep/2)) <= currentStep && isBreak ? 'completed' : ''}`}
                    ></div>              
                    {index < totalSteps/2-1 && <div className="line" key={`line-${index}`}></div>}
                </React.Fragment>
            ))}
        </div>
    );
}

export default Progress



// add focus to play button when current step changes