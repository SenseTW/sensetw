import * as React from 'react';

function Message(props) {
  return (
    <div style={{
      color: '#9f3a38',
      fontSize: '12px',
      textAlign: 'left',
      lineHeight: '16px',
      marginTop: '-10px',
      marginBottom: '16px',
    }}>
      {props.children}
    </div>
  );
}

export default Message;
