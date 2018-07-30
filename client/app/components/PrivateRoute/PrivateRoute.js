import React, {Component} from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
} from "react-router-dom";
import 'whatwg-fetch';
import {emitter} from "../SignOutComp/SignOutComp.js"
import openSocket from 'socket.io-client';


const Loading = () => <div> Loading...</div>;


class PrivateRoute extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      isAuthenticated: false,
      user: {},
      socket: null,
    };
  }

  componentWillMount() {
    let {
      socket,
    } = this.state;

    this.setState({
      isLoading: true,
    });
    fetch("/authenticate", 
    {method: "POST",
    headers: {
      'Content-Type': 'application/json'
    }})
    .then((res) => res.json())
    .then((json) => {
      socket = (socket !== null) && socket.connected? 
                socket : openSocket('http://localhost:8000');
      this.setState({
        isLoading: false,
        isAuthenticated: json.success,
        user: json.user,
        socket: socket,
      });
      socket.emit('storeUser', json.userId);
      emitter.emit('authenticationCheck', json.success);
      console.log(json);
    });
  }

    render() {
      let {
        isLoading,
        isAuthenticated,
        user,
        socket,
      } = this.state;

      let { 
        component: Component, 
        ...rest 
      } = this.props;
    
    console.log(isAuthenticated);
    return (
      <Route
      {...rest}
      render= {props => {
        if (isLoading) {
          return <Loading></Loading>
        }
        else if (isAuthenticated) {
          return <Component user={user} socket={socket} {...props} />
        }
        else {
          return (
          <Redirect
              to={{
                pathname: "/",
                state: { from: props.location }
              }}
            />);
        }
      }}
    /> );
    }
}


export default PrivateRoute;