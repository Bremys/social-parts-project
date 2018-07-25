import React, { Component } from 'react';
import 'whatwg-fetch';

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      signUpError: '',
      signUpUsername: '',
      signUpFirstName: '',
      signUpLastName: '',
      signUpEmail: '',
      signUpPassword: '',
      signUpConfirmedPassword: '',
    };

    this.onTextboxChangeSignUpUsername = this.onTextboxChangeSignUpUsername.bind(this);
    this.onTextboxChangeSignUpFirstName = this.onTextboxChangeSignUpFirstName.bind(this);
    this.onTextboxChangeSignUpLastName = this.onTextboxChangeSignUpLastName.bind(this);
    this.onTextboxChangeSignUpConfirmedPassword = this.onTextboxChangeSignUpConfirmedPassword.bind(this);
    this.onTextboxChangeSignUpEmail = this.onTextboxChangeSignUpEmail.bind(this);
    this.onTextboxChangeSignUpPassword = this.onTextboxChangeSignUpPassword.bind(this);
    
    this.onSignUp = this.onSignUp.bind(this);
  }

  onTextboxChangeSignUpUsername(event) {
    this.setState({
      signUpUsername: event.target.value,
    });
  }

  onTextboxChangeSignUpFirstName(event) {
    this.setState({
      signUpFirstName: event.target.value,
    });
  }

  onTextboxChangeSignUpLastName(event) {
    this.setState({
      signUpLastName: event.target.value,
    });
  }

  onTextboxChangeSignUpEmail(event) {
    this.setState({
      signUpEmail: event.target.value,
    });
  }

  onTextboxChangeSignUpPassword(event) {
    this.setState({
      signUpPassword: event.target.value,
    });
  }

  onTextboxChangeSignUpConfirmedPassword(event) {
    this.setState({
      signUpConfirmedPassword: event.target.value,
    });
  }

  onSignUp() {
    // Grab state
    const {
      signUpUsername,
      signUpFirstName,
      signUpLastName,
      signUpEmail,
      signUpPassword,
      signUpConfirmedPassword,
    } = this.state;

    this.setState({
      isLoading: true,
    });

    // Post request to backend
    fetch('/api/account/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username:  signUpUsername,
        firstName:  signUpFirstName,
        lastName:  signUpLastName,
        email:  signUpEmail,
        password:  signUpPassword,
        confirmedPassword:  signUpConfirmedPassword,
      }),
    }).then(res => res.json())
      .then(json => {
        console.log('json', json);
        if (json.success) {
          this.setState({
            signUpError: json.message,
            isLoading: false,
            signUpError: '',
            signUpUsername: '',
            signUpFirstName: '',
            signUpLastName: '',
            signUpEmail: '',
            signUpPassword: '',
            signUpConfirmedPassword: '',
          });
        } else {
          this.setState({
            signUpError: json.message,
            isLoading: false,
          });
        }
      });
  }

  render() {
    const {
      isLoading,
      signUpError,
      signUpUsername,
      signUpFirstName,
      signUpLastName,
      signUpEmail,
      signUpPassword,
      signUpConfirmedPassword,
    } = this.state;

    if (isLoading) {
      return (<div><p>Loading...</p></div>);
    }

    return (
      <div>
        <br />
        <br />
        <div>
          {
            (signUpError) ? (
              <p>{signUpError}</p>
            ) : (null)
          }
          <span style={{
            color: "#E5E4E2"
          }}> <b>Sign Up</b> </span>
          <br/>
          <input
            type="text"
            placeholder="Username"
            value={signUpUsername}
            onChange={this.onTextboxChangeSignUpUsername}
          /><br />
          <input
            type="text"
            placeholder="First Name"
            value={signUpFirstName}
            onChange={this.onTextboxChangeSignUpFirstName}
          /><br />
          <input
            type="text"
            placeholder="Last Name"
            value={signUpLastName}
            onChange={this.onTextboxChangeSignUpLastName}
          /><br />
          <input
            type="email"
            placeholder="Email"
            value={signUpEmail}
            onChange={this.onTextboxChangeSignUpEmail}
          /><br />
          <input
            type="password"
            placeholder="Password"
            value={signUpPassword}
            onChange={this.onTextboxChangeSignUpPassword}
          /><br />
          <input
            type="password"
            placeholder="Confirm Password"
            value={signUpConfirmedPassword}
            onChange={this.onTextboxChangeSignUpConfirmedPassword}
          /><br />
          <button onClick={this.onSignUp}>Sign Up</button>
        </div>

      </div>
    );
  }
}

export default SignUp;