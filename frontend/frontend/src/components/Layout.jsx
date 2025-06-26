// src/components/Layout.js
import React from 'react';

const Layout = ({ children }) => {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '1200px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center', // Forces centered text
      }}
    >
      {children}
    </div>
  );
};

export default Layout;
