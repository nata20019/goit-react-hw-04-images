import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import './Modal.css';

export const Modal = ({ onClose, imageURL, imageTags }) => {
  const handleKeyDown = useCallback(
    e => {
      if (e.code === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  const handleOverlayClick = useCallback(
    e => {
      if (e.currentTarget === e.target) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const modalRoot = document.querySelector('#root');

  if (!modalRoot) {
    console.error(
      'Target container for modal not found: #root. Please ensure it exists in your index.html'
    );
    return null;
  }

  return createPortal(
    <div className="Overlay" onClick={handleOverlayClick}>
      <div className="Modal">
        <img src={imageURL} alt={imageTags} />
      </div>
    </div>,
    modalRoot
  );
};
Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  imageURL: PropTypes.string.isRequired,
  imageTags: PropTypes.string.isRequired,
};
export default Modal;

// import React, { Component } from 'react';
// import { createPortal } from 'react-dom';
// import PropTypes from 'prop-types';
// import './Modal.css';

// const modalRoot = document.querySelector('#root'); // Це ID елемента в index.html

// export class Modal extends Component {
//   static propTypes = {
//     onClose: PropTypes.func.isRequired,
//     imageURL: PropTypes.string.isRequired,
//     imageTags: PropTypes.string.isRequired,
//   };

//   componentDidMount() {
//     window.addEventListener('keydown', this.handleKeyDown);
//   }

//   componentWillUnmount() {
//     window.removeEventListener('keydown', this.handleKeyDown);
//   }

//   handleKeyDown = e => {
//     if (e.code === 'Escape') {
//       this.props.onClose();
//     }
//   };

//   handleOverlayClick = e => {
//     if (e.currentTarget === e.target) {
//       this.props.onClose();
//     }
//   };

//   render() {
//     const { imageURL, imageTags } = this.props;

//     return createPortal(
//       <div className="Overlay" onClick={this.handleOverlayClick}>
//         <div className="Modal">
//           <img src={imageURL} alt={imageTags} />
//         </div>
//       </div>,
//       modalRoot
//     );
//   }
// }

// export default Modal;
