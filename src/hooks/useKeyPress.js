import { useState, useEffect } from 'react';

const useKeyPress = ( targetKeyCode ) => {
    const [ keyPressed, setKeyPressed ] = useState(false)

    const keyUpHandler = ({ keyCode }) => {
        if (keyCode === targetKeyCode) {
            setKeyPressed(false)
        }
    }

    const keyDownHandler = ({ keyCode }) => {
        if (keyCode === targetKeyCode) {
            setKeyPressed(true)
        }
    }

    useEffect(() => {
        document.addEventListener('keyup', keyUpHandler)
        document.addEventListener('keydown', keyDownHandler)
        return () => {
            document.removeEventListener('keyup', keyUpHandler)
            document.removeEventListener('keydown', keyDownHandler)
        }
    }, [])

    return keyPressed
}

export default useKeyPress
