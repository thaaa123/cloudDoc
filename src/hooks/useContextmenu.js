import { useEffect, useRef } from 'react';

const { remote } = window.require('electron')
const { Menu, MenuItem } = remote

const useContextmenu = (itemArr, targetSelector, deps) => {
    const cleckedElement = useRef(null)

    useEffect(() => {
        let menu = new Menu()

        itemArr.map(item => {
            menu.append(new MenuItem(item))
        })

        const handeleContextmenu = (e) => {
            if (document.querySelector(targetSelector).contains(e.target)) {
                cleckedElement.current = e.target
                menu.popup({ window: remote.getCurrentWindow() })
            }
        }

        window.addEventListener('contextmenu', handeleContextmenu)
        return () => {
            window.removeEventListener('contextmenu', handeleContextmenu)
        }
    }, deps)
    
    return cleckedElement
}

export default useContextmenu
