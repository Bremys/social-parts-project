import React, { Component } from 'react';
import {Grid, Cell} from 'styled-css-grid';
import InfiniteScroll from 'react-infinite-scroller';
import Post from '../Post/Post';
import 'whatwg-fetch';
import UserProfile from '../UserProfile/UserProfile';

class SearchResults extends Component {
  constructor(props) {
    super(props);

    this.state = {
        results: '',
        posts: [],
        users: [],
        hasMoreItems: true,
    };
    this.loadItems = this.loadItems.bind(this);
  }

  loadItems(page){
    const {
      posts,
      users,
    } = this.state;

    const {
      category,
      term
    } = this.props.match.params

    fetch(`/api/${category}/search/${term}/${Math.max(posts.length, users.length)}`)
    .then((res) => res.json())
    .then((json) => {
      const { hasMore } = json;
      if (hasMore && category === "posts"){
        this.setState({
            posts: json.posts,
            hasMoreItems: hasMore,
            results: category
          });
      }
      else if (hasMore && category === "users"){
        this.setState({
            users: json.users,
            hasMoreItems: hasMore,
            results: category
          });
      }
      else {
        this.setState({
          hasMoreItems: hasMore,
          results: category
        });
      }
    });
  }

  render() {
    const {
        posts,
        users,
        results,
        hasMoreItems
    } = this.state;

    const postsScroll = <InfiniteScroll
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
    </InfiniteScroll>;

    const usersScroll = <InfiniteScroll
    pageStart={0}
    loadMore={this.loadItems}
    hasMore={hasMoreItems}
  >
    {users.map((user, i) => {
      return (
        <>
          <UserProfile
          showPosts={false}
          match={{params: {username: user.username}}}
          key={i}
          />
          <br key={i+posts.length}/>
        </>
      );
    })}
    </InfiniteScroll>;
    
    const Scroller = results === "posts"? postsScroll: usersScroll;
    return (
    <>
        <Grid
            columns={"1"}
        >
            <Cell>
              {Scroller}
            </Cell>
        </Grid>
    </>
    );
  }
}

export default SearchResults;