import React from 'react';
import SignUpComp from '../SignUpComp/SignUpComp.js';
import SignInComp from '../SignInComp/SignInComp.js';
import { Grid, Cell } from "styled-css-grid";
import 'whatwg-fetch';

const MyHome = () => (
    <> 

<Grid
    columns={"400px 20px 400px"}
    rows={"1fr"}>
  <Cell
    style={
        {
            backgroundColor: "#d5a18e",
            border: "2px solid #b9314f",
            outline: "2px solid #d5a18e"
        }

    }
    center={true}
  > <SignUpComp></SignUpComp></Cell>
    <Cell></Cell>
  <Cell
    style={
        {
            backgroundColor: "#d5a18e",
            border: "2px solid #b9314f",
            outline: "2px solid #d5a18e"
        }

    }
    center={true}
  > <SignInComp></SignInComp></Cell>

</Grid>    
    </>
);

export default MyHome;
