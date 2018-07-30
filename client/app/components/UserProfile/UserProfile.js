import React, { Component } from 'react';
import {Grid, Cell} from 'styled-css-grid';
import InfiniteScroll from 'react-infinite-scroller';
import Post from '../Post/Post';
import 'whatwg-fetch';

class UserProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
        firstName: '',    
        lastName: '',
        following: false,
        posts: [],
        hasMoreItems: true,
    };
    this.followUser = this.followUser.bind(this);
    this.loadItems = this.loadItems.bind(this);
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

  componentWillReceiveProps(nextProps) {
    
    if (nextProps.match.params.username !== this.props.match.params.username) {
        const {
            match
        } = nextProps;
        fetch(`/api/users/${match.params.username}`)
        .then((res) => res.json())
        .then((json) => {
            if(json.found){
                this.setState({
                    firstName: json.firstName,
                    lastName: json.lastName,
                    following: json.following,
                    posts: [],
                    hasMoreItems: true,
                });   
                console.log(this.state);
            }
            else {
              this.props.history.push('/notfounduser')
            }
        });
    }
  }

  loadItems(page){
    const {
      posts
    } = this.state;

    fetch(`/api/users/${this.props.match.params.username}/posts/${posts.length}`)
    .then((res) => res.json())
    .then((json) => {
      const {hasMore } = json;
      if (hasMore){
        const newPosts = json.posts;
        this.setState({
            posts: newPosts,
            hasMoreItems: hasMore,
          });
      }
      else {
        this.setState({
            posts: posts,
            hasMoreItems: hasMore,
          });
      }
    });
  }

  render() {
    const {
        firstName,
        lastName,
        following,
        posts,
        hasMoreItems
    } = this.state;
    
    return (
    <>
        <Grid
            columns={"1"}
            rows={"3"}
        >
            <Cell> <h1>{firstName}    {lastName}</h1></Cell>
            <Cell><button onClick={this.followUser}>{
                following? "Unfollow" : "Follow"
            }</button></Cell>
            <Cell>
            <InfiniteScroll
            pageStart={0}
            loadMore={this.loadItems}
            hasMore={hasMoreItems}
          >
            {posts.map((post, i) => {
              return (
                <>
                  <Post
                  postId={post.postId}
                  poster={post.poster}
                  postType={post.postType}
                  title={post.title}
                  price={post.price}
                  content={post.content}
                  album={post.album}
                  key={i}
                  />
                  <br key={i+posts.length}/>
                </>
              );
            })}
            </InfiniteScroll>
            </Cell>
        </Grid>
    </>
    );
  }
}

export default UserProfile;