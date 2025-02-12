'use client'
import React, { createContext, useContext, useState } from 'react';

interface UpdateContextProps {
    refetchIncidenceComments: () => void;
    setRefetch: React.Dispatch<React.SetStateAction<() => void>>;
}

const UpdateContext = createContext<UpdateContextProps | undefined>(undefined);

export const UpdateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [refetch, setRefetch] = useState<() => void>(() => () => { });

    const refetchIncidenceComments = () => {
        if (refetch) {
            refetch();
        }
    };

    return (
        <UpdateContext.Provider value={{ refetchIncidenceComments, setRefetch }}>
            {children}
        </UpdateContext.Provider>
    );
};

export const useUpdateContext = () => {
    const context = useContext(UpdateContext);
    if (!context) {
        throw new Error('useUpdateContext must be used within an UpdateProvider');
    }
    return context;
};