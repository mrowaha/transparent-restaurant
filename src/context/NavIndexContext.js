import React, { useState } from 'react';

export const NavIndexContext = React.createContext({
  navIndex : 0,
  setNavIndex : () => {}
})

function NavIndexContextProvider ({children}) {
  const [navIndex, setNavIndex] = useState(0);


  const cxt = {
    navIndex : navIndex,
    setNavIndex : setNavIndex
  }

  return (
    <NavIndexContext.Provider value={cxt}>
      {children}
    </NavIndexContext.Provider>
  )
}

export default NavIndexContextProvider;