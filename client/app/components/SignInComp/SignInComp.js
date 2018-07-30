import React, { Component } from 'react';
import { withRouter } from 'react-router';
import 'whatwg-fetch';


class SignIn extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      signInError: '',
      signInUsername: '',
      signInPassword: '',
    };

    this.onTextboxChangeSignInUsername = this.onTextboxChangeSignInUsername.bind(this);
    this.onTextboxChangeSignInPassword = this.onTextboxChangeSignInPassword.bind(this);
    
    this.onSignIn = this.onSignIn.bind(this);
  }

  onTextboxChangeSignInUsername(event) {
    this.setState({
      signInUsername: event.target.value,
    });
  }

  onTextboxChangeSignInPassword(event) {
    this.setState({
      signInPassword: event.target.value,
    });
  }



  onSignIn() {
    // Grab state
    const {
      signInUsername,
      signInPassword,
    } = this.state;

    this.setState({
      isLoading: true,
    });

    // Post request to backend
    fetch('/api/account/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: signInUsername,
        password: signInPassword,
      }),
    }).then(res => res.json())
      .then(json => {
        console.log('json', json);
        if (json.success) {
          this.props.history.push('/main');
        } else {
          this.setState({
            signInError: json.message,
            isLoading: false,
          });
        }
      });
  }


  render() {
    const {
      isLoading,
      signInError,
      signInUsername,
      signInPassword,
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
            (signInError) ? (
              <p>{signInError}</p>
            ) : (null)
          }
          <span style={{
            color: "#E5E4E2"
          }}><b>Sign In</b></span>
          <br/>
          <input
            type="text"
            placeholder="Username"
            value={signInUsername}
            onChange={this.onTextboxChangeSignInUsername}
          /><br />
          <input
            type="password"
            placeholder="Password"
            value={signInPassword}
            onChange={this.onTextboxChangeSignInPassword}
          /><br />
          <button onClick={this.onSignIn}>Sign In</button>
        </div>

      </div>
    );
  }
}

const signInRouter = withRouter(SignIn);
export default signInRouter;