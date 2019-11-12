import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import './index.scss';

const TabList = ({ files, activeId, unsavedIds, onTabClick, onCloseTab }) =>{
    return (
        <>
            <ul className="nav nav-pills tabList-component">
                {
                    files.map((file) => {
                        const withUnsaveMark = unsavedIds.includes(file.id)
                        const fClassName = classNames({
                            'active': activeId === file.id,
                            'withUnsaved': withUnsaveMark
                        }, 'nav-link', 'd-flex', 'align-items-center')
                        return (
                            <li className="nav-item" key={file.id}>
                                <a className={fClassName} href="#" onClick={(e) => {e.preventDefault(); onTabClick(file.id)}}>
                                    {file.title}
                                    <span className="ml-2 close-icon" onClick={(e) => {
                                        e.stopPropagation(); onCloseTab(file.id)
                                    }}>
                                        <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
                                    </span>
                                    { withUnsaveMark && <span className="rounded-circle unsave-icon ml-2"></span> }
                                </a>
                            </li>
                        )
                    })
                }
            </ul>
        </>
    )
}

TabList.propTypes = {
    files: PropTypes.array,
    activeId: PropTypes.string,
    unsavedIds: PropTypes.array,
    onTabClick: PropTypes.func,
    onCloseTaab: PropTypes.func
}

export default TabList
