import React from "react";
import Header from "./Header/Header";
import styled from "styled-components";

const Layout = (props: {childeren: JSX.Element}) => {
  return (
    <div>
      <Header />
      <>{props.childeren}</>
    </div>
  );
};

export default Layout;