'use strict';

import React from 'react';

function getStyleSizePosition(control) {
  const { left, top, height, width } = control;
  return { left, top, height, width };
}

const Control = ({ control, onActionPrimary, onActionSecondary }) => (
  <div title={control.id}
       style={getStyleSizePosition(control)}
       className={control.active ? 'mylife-control-button' : 'mylife-control-inactive'}
       onTouchTap={onActionPrimary}>
    {control.display && <img src={`data:image/png;base64,${control.display}`} />}
    {control.text && <p>{control.text}</p>}
  </div>
);

Control.propTypes = {
  control           : React.PropTypes.object.isRequired,
  onActionPrimary   : React.PropTypes.func.isRequired,
  onActionSecondary : React.PropTypes.func.isRequired,
};

export default Control;

/*

ajout sur control : left, top, active, display, text

 TODO:

          input-handler="{
           's': control.primaryAction.execute,
           'l': control.secondaryAction.execute,
           'ss': control.secondaryAction.execute
*/