import React, { Component } from 'react';
import { Grid, Cell } from "styled-css-grid";
import styled from "styled-components";
import { SignOut } from "../SignOutComp/SignOutComp";
import { Link } from 'react-router-dom';

// import Header from '../Header/Header';
// import Footer from '../Footer/Footer';

const HeaderStyle = styled(Cell)`
  background-color: #b9314f;
`;

const ulStyle = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
`;

const liStyle = styled.li`
  float: left;
`;

const LinkInli = styled(Link)`
  display: inline-block;
  color: white;
  text-align: center;
  padding: 16px;
  text-decoration: none;
  &:hover{
    background-color: #3a4f41;
  }
`;

const styledSignOut = styled(SignOut)`
  display: inline-block;
  color: white;
  text-align: center;
  padding: 16px;
  text-decoration: none;
  &:hover{
    background-color: #3a4f41;
  }
`;

const App = ({ children }) => (
  <>
    <Grid
    style = {
      {backgroundColor: "#dec3be"}
    }
    columns={"1fr"}
    rows={"minmax(45px,auto) 1fr minmax(45px,auto)"}>

  <HeaderStyle>
    <nav>
      <ulStyle>
      <liStyle><LinkInli to="/">Home   </LinkInli></liStyle>
      <liStyle><LinkInli to="/main">Main</LinkInli></liStyle>
      <liStyle><SignOut></SignOut></liStyle>
      </ulStyle>
    </nav>
  </HeaderStyle>

  <Cell
    style={
    { backgroundColor: "#dec3be" ,
      padding: "5px",
      margin: "5px",    
    } 
  }
  center middle
  >{children}</Cell>

  <HeaderStyle></HeaderStyle>
</Grid>
  </>
);

export default App;
