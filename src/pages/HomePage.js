import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Banner, AboutUs } from "../components";
import { NavIndexContext } from "../context/NavIndexContext";

function HomePage() {
  const {hash} = useLocation();
  const {setNavIndex} = React.useContext(NavIndexContext);
  const aboutUsRef = React.useRef(null);
  const didMountRef = React.useRef(true);

  React.useEffect(() => {    
    const observer = new IntersectionObserver(entries => {
      const aboutUsDiv = entries[0];
      // check hash if didMount
      if (didMountRef.current) {
        aboutUsRef.current.setAttribute('fadeIn', '');
        didMountRef.current = false;
        if (hash === "#aboutus") {
          setNavIndex(1);
        } else {
          setNavIndex(0);
        }
        return;
      }

      if (aboutUsDiv.isIntersecting) {
        setNavIndex(1);
      } else {
        setNavIndex(0);
      }
    })
    observer.observe(aboutUsRef.current);
    
  }, [])

  return (
    <div>
      <Banner />
      <AboutUs ref={aboutUsRef}/>
      {/* Gap from bottom */}
      <div style={{ width: "100%", height: "50px" }}/>
    </div>
  );
}

export default HomePage;