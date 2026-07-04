import React, { Children, createContext, useContext, useRef } from 'react'
import { asset } from '../assets/asset'



    const SoundContext = createContext();
    
    export const SoundProvider = ({ children }) => {

        const clickSound = useRef(new Audio(asset.click));

        const handileClickSound = () => {
            clickSound.current.currentTime = 0;
            clickSound.current.play();
        };

        return (
       <SoundContext.Provider value={{ handileClickSound }}>
        {children}
       </SoundContext.Provider>
    );
    };

    export const useSound = () => useContext(SoundContext);

  

