import React, { Component } from 'react';
import {Grid, Cell} from 'styled-css-grid';
import 'whatwg-fetch';

class UserProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
        firstName: '',    
        lastName: '',
        following: false,  
    };
    this.followUser = this.followUser.bind(this);
  }

  followUser(){
      const {
          match
      } = this.props;
      const {
          following
      } = this.state;
      
      const action = following? "unfollow" : "follow";
      fetch(`/api/users/${match.params.username}/${action}`, {
          method: "POST"
      })
      .then((res) => res.json())
      .then((json) => {
          this.setState({
              following: json.following
          });
      });
  }

  componentDidMount(){
      const {
          match
      } = this.props;
      fetch(`/api/users/${match.params.username}`)
      .then((res) => res.json())
      .then((json) => {
          if(json.found){
              this.setState({
                  firstName: json.firstName,
                  lastName: json.lastName,
                  following: json.following,
              });   
              console.log(this.state);
          }
          else {
            this.props.history.push('/notfounduser')
          }
      });
  }

  render() {
    const {
        firstName,
        lastName,
        following,
    } = this.state;
    
    return (
    <>
        <Grid
            columns={"1"}
            rows={"2"}
        >
            <Cell> <h1>{firstName}    {lastName}</h1></Cell>
            <Cell><button onClick={this.followUser}>{
                following? "Unfollow" : "Follow"
            }</button></Cell>
        </Grid>
    </>
    );
  }
}

export default UserProfile;