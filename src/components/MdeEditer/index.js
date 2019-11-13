import React from 'react';
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from '@fortawesome/free-solid-svg-icons'

const MdeEditer = ( { file, fileChange, saveCurrentFile } ) => {
    return (
        <>
           <SimpleMDE
            key={file && file.id}
            value={file && file.body}
            onChange={(val) => {fileChange(file.id, val)}}
            options={
              {
                minHeight: '510px'
              }
            }
           ></SimpleMDE>
          {/* <button type="button" className="button-icon" onClick={ saveCurrentFile }>
              <FontAwesomeIcon title="保存" icon={ faSave }></FontAwesomeIcon>
              保存
          </button> */}
        </>
    )
}

MdeEditer.propTypes = {
  file: PropTypes.object,
  fileChange: PropTypes.func,
}

export default MdeEditer
