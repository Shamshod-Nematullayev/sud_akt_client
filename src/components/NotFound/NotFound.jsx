import React from "react";
import { useSpring, animated } from "react-spring";
import { Link } from "react-router-dom";
import "./style.css";

const NotFound = () => {
  const animationProps = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 1000 },
  });

  return (
    <animated.div style={animationProps} className="not-found-container">
      <h1>404 - Not Found</h1>
      <p>The page you are looking for might be under construction.</p>
      <Link to="/">Go to Home</Link>
    </animated.div>
  );
};

export default NotFound;
