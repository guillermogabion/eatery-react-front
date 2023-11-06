import React, { useState } from "react";

interface LoaderProps {
  show: boolean;
}

const Loader = ({ show }: LoaderProps) => {
  const modalStyle = {
    display: show ? "block" : "none",
  };

  return (
    <div className="custom-modal" style={modalStyle}>
      <div className="modal-content">
        <div className="modal-header">
          <span className="close">&times;</span>
        </div>
        <div className="modal-body">
          <div className="loader triangle">
            <svg viewBox="0 0 86 80">
              <polygon points="43 8 79 72 7 72"></polygon>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
