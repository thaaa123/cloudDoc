import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons'
import { faMarkdown } from '@fortawesome/free-brands-svg-icons'
import useKeyPress from '../../hooks/useKeyPress';
import PropTypes from 'prop-types';
import useContextmenu from '../../hooks/useContextmenu';
import { getParentNode } from '../../utils/helper'

const FileList = ({ files, onFileClick, onSaveEdit, onFileDel }) => {
    const [ editStatus, setEditStatus ] = useState(false)
    const [ value, setValue ] = useState('')
    const enterPressed = useKeyPress(13)
    const escPressed = useKeyPress(27)

    const closeSearch = (fileItem) => {
        setEditStatus(false)
        setValue('')

        if( fileItem.isNewFile ) {
            onFileDel(fileItem.id)
        }
    }

    const cleckedElement = useContextmenu([
        {
            label: '打开',
            click: () => {
                const parentElement = getParentNode(cleckedElement.current, 'file-item')
                onFileClick(parentElement.dataset.id)
            }
        },
        {
            label: '重命名',
            click: () => {
                const parentElement = getParentNode(cleckedElement.current, 'file-item')
                setEditStatus(parentElement.dataset.id); 
                setValue(parentElement.dataset.title);
            }
        },
        {
            label: '删除',
            click: () => {
                const parentElement = getParentNode(cleckedElement.current, 'file-item')
                onFileDel(parentElement.dataset.id)
            }
        }
    ], '.file-list', [files])

    useEffect(() => {
        let fileItem = files.find(file => file.id === editStatus)
        if (enterPressed && editStatus && value.trim()) {
            onSaveEdit(fileItem.id, value, fileItem.isNewFile)
            setEditStatus(false)
            setValue('')
        }

        if (escPressed && editStatus) {
            closeSearch(fileItem)
        }
    }, [ enterPressed, escPressed ])

    useEffect(() => {
        const newFile = files.find(file => file.isNewFile)

        if ( newFile ) {
            setEditStatus(newFile.id)
            setValue(newFile.title)
        }
    }, [ files ])

    return (
        <ul className="list-group list-group-flush file-list">
            {
                files.map((file) => (
                    <li className="list-group-item file-item d-flex align-items-center row no-gutters" key={file.id}
                        data-id={file.id}
                        data-title={file.title}
                    >
                        {
                            (editStatus !== file.id && !file.isNewFile) &&
                            <>
                                <span className="col-2">
                                    <FontAwesomeIcon title="markdownIcon" icon={ faMarkdown }></FontAwesomeIcon>
                                </span>
                                <span className="col-6" onClick={() => {onFileClick(file.id)}}>{file.title}</span>
                                {/* <button type="button" className="button-icon col-2" onClick={() => { setEditStatus(file.id); setValue(file.title); }}>
                                    <FontAwesomeIcon title="编辑" icon={ faEdit }></FontAwesomeIcon>
                                </button>
                                <button type="button" className="button-icon col-2" onClick={() => {onFileDel(file.id)}}>
                                    <FontAwesomeIcon title="删除" icon={ faTrash }></FontAwesomeIcon>
                                </button> */}
                            </>
                        }
                        {
                            (editStatus === file.id || file.isNewFile) &&
                            <>
                                <input className="form-control col-10" placeholder="请输入文件名" value={value} onChange={(e) => { setValue(e.target.value) }}></input>
                                <button type="button col-2 ml-2" className="button-icon" onClick={() => closeSearch(file)}>
                                    <FontAwesomeIcon title="关闭" icon={ faTimes }></FontAwesomeIcon>
                                </button>
                            </>
                        }

                    </li>
                ))
            }
        </ul>
    )
}

FileList.propTypes = {
    files: PropTypes.array,
    onFileClick: PropTypes.func,
    onFileDel: PropTypes.func,
    onSaveEdit: PropTypes.func
}

export default FileList
