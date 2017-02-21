'use strict';

import React from 'react';

const Window = ({ stack, onActionPrimary, onActionSecondary, onWindowClose }) => (
  stack ? (
    <div>Hello window!</div>
  ) : (
    <div className="mylife-overlay">
      <img src="images/spinner.gif" />
    </div>
  )
);

Window.propTypes = {
  stack             : React.PropTypes.object,
  onActionPrimary   : React.PropTypes.func.isRequired,
  onActionSecondary : React.PropTypes.func.isRequired,
  onWindowClose     : React.PropTypes.func.isRequired,
};

export default Window;
