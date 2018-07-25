import React, {Component} from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
} from "react-router-dom";
import 'whatwg-fetch';
import {emitter} from "../SignOutComp/SignOutComp.js"

const Loading = () => <div> Loading...</div>;


class PrivateRoute extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      isAuthenticated: false
    };
  }

  componentWillMount() {
    this.setState({
      isLoading: true
    });
    const {
      isAuthenticated
    } = this.state;
    fetch("/authenticate", 
    {method: "POST",
    headers: {
      'Content-Type': 'application/json'
    }})
    .then((res) => res.json())
    .then((json) => {
      this.setState({
        isLoading: false,
        isAuthenticated: json.success
      });
      emitter.emit('authenticationCheck', json.success);
      console.log(json);
    });
  }

    render() {
      let {
        isLoading,
        isAuthenticated
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
          return <Component {...props} />
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