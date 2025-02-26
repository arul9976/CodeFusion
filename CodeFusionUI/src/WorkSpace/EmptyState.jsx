import React from 'react'
import './emptyState.css'
const EmptyState = () => {
  return (
    <>
      <div className="empty-state">
        <div className="illustration">
          <div className="folder">
            <div className="folder-back"></div>
            <div className="folder-front"></div>
            <div className="folder-content"></div>
          </div>
          <div className="person">
            <div className="person-body"></div>
            <div className="person-head"></div>
            <div className="person-arm"></div>
          </div>
          <div className="thought-bubble">
            <div className="question-mark">?</div>
          </div>
          <div className="plant plant-left"></div>
          <div className="plant plant-right"></div>
        </div>
        <p className="empty-text">No workspaces available</p>
      </div>
    </>
  )
}

export default EmptyState