'use strict';

import React from 'react';

import WindowContent from './window-content';

const Window = ({ online, view, onActionPrimary, onActionSecondary, onWindowClose }) => (
  <div>
    {/* preload images */}
    <img src="images/spinner.gif" style={{display: 'none'}} />
    <img src="images/connecting.jpg" style={{display: 'none'}} />

    {!online && (
      <div className="mylife-overlay-connecting">
        <img src="images/connecting.jpg" />
      </div>
    )}

    {online && !view && (
      <div className="mylife-overlay">
        <img src="images/spinner.gif" />
      </div>
    )}

    {online && view && (
      <WindowContent window={view.window} onActionPrimary={onActionPrimary} onActionSecondary={onActionSecondary} />
    )}
  </div>
);

Window.propTypes = {
  online            : React.PropTypes.bool.isRequired,
  view              : React.PropTypes.object,
  onActionPrimary   : React.PropTypes.func.isRequired,
  onActionSecondary : React.PropTypes.func.isRequired,
  onWindowClose     : React.PropTypes.func.isRequired,
};

export default Window;

// TODO: children (stack.popup)