import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types';
import useKeyPress from '../../hooks/useKeyPress';


const FileSearch = ( { title, onKeySearch } ) => {
    const [ inputActive, setInputActive ] = useState(false);
    const [ value, setValue ] = useState('');
    const node = useRef(null)
    const enterPressed = useKeyPress(13)
    const escPressed = useKeyPress(27)

    const closeSearch = () => {
        setInputActive(false)
        setValue('')
        onKeySearch('')
    }

    useEffect(() => {
        if (enterPressed && inputActive) {
            onKeySearch(value)
        }

        if (escPressed && inputActive) {
            closeSearch('')
        }

    }, [ enterPressed, escPressed ])

    useEffect(() => {
        if ( inputActive ) {
            node.current.focus()
        }
    }, [ inputActive ])

    return (
        <div className="alert alert-primary d-flex justify-content-between align-items-center mb-0 pb-0 pt-0 border-0">
            {/* input 没有显示 */}
            {!inputActive &&
                <>
                    <span>{title}</span> 
                    <button type="button" className="button-icon" onClick={() => setInputActive(true)}>
                        <FontAwesomeIcon title="搜索" icon={ faSearch }></FontAwesomeIcon>
                    </button>
                </>
            }
            {/* input 显示 */}
            {inputActive &&
                <>
                    <input ref={ node } className="form-control" value={value} onChange={(e) => { setValue(e.target.value) }}></input>
                    <button type="button" className="button-icon" onClick={closeSearch}>
                        <FontAwesomeIcon title="关闭" icon={ faTimes }></FontAwesomeIcon>
                    </button>
                </>
            }
        </div>
    )
}

FileSearch.propTypes = {
    title: PropTypes.string,
    onKeySearch: PropTypes.func.isRequired
}

FileSearch.defaultProps = {
    title: '我的云文档'
}

export default FileSearch
