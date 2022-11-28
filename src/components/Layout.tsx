import React from "react";
import { Header } from "./index";

interface Props {
  children?: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Header />
      <div className="max-w-5xl px-5 mx-auto">{children}</div>
    </>
  );
};

export default Layout;
