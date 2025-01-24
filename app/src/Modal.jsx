import React from 'react';
import PropTypes from 'prop-types';

import './Modal.css';

function Modal({ content, close, otherButtons, closeText }) {

    const sP = (e) => { e.stopPropagation(); };

    return (
        <div className="modal-overlay" onClick={close}>
        <div className="modal" onClick={sP}>
            <div className="modal-content">
                {content}
            </div>
            {otherButtons}
            <button className="btn-big btn-close" onClick={close}>{closeText}</button>
        </div>
        </div>
    );
}
Modal.propTypes = {
    content: PropTypes.node.isRequired,
    close: PropTypes.func.isRequired,
    otherButtons: PropTypes.node,
    closeText: PropTypes.string,
};

Modal.defaultProps = {
    otherButtons: null,
    closeText: "Close",
};

export default Modal;