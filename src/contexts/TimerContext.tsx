import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the context type
interface TimerContextType {
    shouldReapplyTimerState: boolean;
    setShouldReapplyTimerState: (value: boolean) => void;
}

// Create the context with the default values
const TimerContext = createContext<TimerContextType | undefined>(undefined);

// Create a provider component
export const TimerProvider = ({ children }: { children: ReactNode }) => {
    const [shouldReapplyTimerState, setShouldReapplyTimerState] = useState(false);

    return (
        <TimerContext.Provider value={{ shouldReapplyTimerState, setShouldReapplyTimerState }}>
            {children}
        </TimerContext.Provider>
    );
};

// Create a custom hook to use the TimerContext
export const useTimerContext = () => {
    const context = useContext(TimerContext);
    if(!context){
        throw new Error('useTimerContext must be used within a TimerProvider');
    }
    return context;
}