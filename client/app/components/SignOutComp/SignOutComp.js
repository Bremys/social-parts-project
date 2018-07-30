import React, { Component } from 'react';
import styled from "styled-components";
import { EventEmitter } from 'fbemitter';
import { withRouter } from 'react-router';
import { socket } from '../SignInComp/SignInComp';
import 'whatwg-fetch';

const emitter = new EventEmitter();

const ButtonLink = styled.button`
    background-color: #b9314f;
    border:none;
    font-family:arial,sans-serif;
    cursor:pointer;
    display: inline-block;
    color: white;
    text-align: center;
    padding: 16px;
    text-decoration: none;
    &:hover{
        background-color: #3a4f41;
    }
`;


class SignOut extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
        loggedIn: false,
        isLoading: false
    };
    
    this.onSignOut = this.onSignOut.bind(this);
  }


  componentDidMount() {
    emitter.addListener('authenticationCheck', (logged) => {
        this.setState({
            loggedIn: logged
        });
        if(!logged){
            this.props.history.push('/');
        }
    });
  }

  onSignOut() {
      this.setState({
          isLoading: true
      });
    // Grab state
    // Post request to backend
    fetch('/api/account/signout', {
      method: 'POST',
    }).then(res => res.json())
      .then(json => {
        this.setState({
            loggedIn: false,
            isLoading: false
        });
        socket.disconnect();
        emitter.emitter('authenticationCheck', false);
      });
  }

  render() {
    const {
        isLoading,
        loggedIn
    } = this.state;

    if (isLoading) {
        return <div> Loading...</div>;
    }

    console.log("Sign out render: ", loggedIn);
    if (loggedIn) {
    console.log("loggedIn");
        return <ButtonLink onClick={this.onSignOut}>Sign Out</ButtonLink>;
    }
    return null;
  }
}

// if (isLoading) {
//     <p>Loading...</p>
// }
// if (loggedIn){
//     <button onClick={this.onSignOut}>Sign Out</button>
// }

const signOutRouter = withRouter(SignOut);

module.exports = {
    SignOut: signOutRouter,
    emitter: emitter
};