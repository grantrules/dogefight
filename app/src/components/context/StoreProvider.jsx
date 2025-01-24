import React, { useContext } from 'react';
import PropTypes from 'prop-types';

const StoreContext = React.createContext({});

function StoreProvider({ children, store: s }) {
  const [store] = React.useState(s);

  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  );
}

StoreProvider.propTypes = {
  children: PropTypes.node.isRequired,
  store: PropTypes.object,
};

function useStore() {
  return useContext(StoreContext);
}

export { StoreContext, StoreProvider, useStore };