import React from "react";
import { Header } from "./index";
import Script from "next/script";

interface Props {
  children?: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" async defer />
      <Header />
      <div className="max-w-5xl px-3 mx-auto">{children}</div>
    </>
  );
};

export default Layout;
