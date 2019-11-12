import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const BottomBtn = ({ text, colorClass, icon, onBntClick }) => {
    return (
        <>
            <button type="button" className={`btn btn-block no-border ${colorClass}`}
            onClick={() => onBntClick()}>
                <FontAwesomeIcon className="mr-2" title="搜索" icon={ icon }></FontAwesomeIcon>
                {text}
            </button>
        </>
    )
}

BottomBtn.propTypes = {
    text: PropTypes.string,
    colorClass: PropTypes.string,
    icon: PropTypes.object,
    onBntClick: PropTypes.func,
}

export default BottomBtn
