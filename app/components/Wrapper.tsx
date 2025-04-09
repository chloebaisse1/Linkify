type WrapperProps = {
  children: React.ReactNode;
};

import React from "react";
import Navbar from "./Navbar";

const Wrapper = ({ children }: WrapperProps) => {
  return (
    <div data-theme="corporate">
      <Navbar />
      <div>{children}</div>
    </div>
  );
};

export default Wrapper;
