import React from 'react';
import {Link, Redirect} from 'react-router-dom';
import {Grid, Cell} from 'styled-css-grid';
import InfiniteScroll from 'react-infinite-scroller';
import Post from '../Post/Post';


class MainPage extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      hasMoreItems: true,
      posts: [],
      term: '',
      category: 'users',
      redirect: false,
    };

    this.loadItems = this.loadItems.bind(this);
    this.changeSearch = this.changeSearch.bind(this);
    this.submitSearch = this.submitSearch.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }


  changeSearch(event) {
    this.setState({
      term: event.target.value
    });
  }

  handleSelect(event) {
    this.setState({
      category: event.target.value
    });
  }

  submitSearch(event){
    this.setState({
      redirect: event.key == "Enter"
    });
  }

  componentDidMount(){
    this.props.socket.addEventListener('newPost', (post) => {
        const {
            posts
        } = this.state;
        posts.unshift(post);
        this.setState({
            posts: posts,
        });
    });
  }

  loadItems(page){
    const {
      posts
    } = this.state;

    fetch(`/api/fetchposts/${posts.length}`)
    .then((res) => res.json())
    .then((json) => {
      const {hasMore , ...postOptions} = json;
      if (hasMore) {
          posts.push(postOptions);
      }
      this.setState({
        posts: posts,
        hasMoreItems: hasMore,
      });
    });
  }

  render() {
    const {
      posts,
      hasMoreItems,
      term,
      category,
      redirect
    } = this.state;
    
    if(redirect) {
      return (
      <Redirect 
      to={`/search/${category}/${term}`}      
      ></Redirect>);
    }

    return (
    <>
      <Grid columns={"20% 80%"}>
        <Cell top={1} left={2} width={2}>
          <Link 
            to={`/search/${category}/${term}`}
            ref={link => this.SearchLink = link}
            ></Link>
          <input
            type={"text"}
            onChange={this.changeSearch}
            onKeyDown={this.submitSearch}
            style={{
              margin: '0 auto',
              maxWidth: 800
            }}
          />
          <select
            onChange={this.handleSelect}
          >
            <option value={"users"}>Users</option>
            <option value={"posts"}>Posts</option>
          </select>
        </Cell>
        <Cell top={2} left={2}>
          <Link to={`/users/${this.props.user.username}`}>
            <h1>{this.props.user.firstName + " " + this.props.user.lastName}</h1>
          </Link>
        </Cell>
        <Cell top={2} left={1}>
          <Link to={'/main/post'}>New Post</Link>
          <br/>
          <br/>
          <br/>
          <Link to={'/main/contacts'}>Update contacts</Link>
          <br/>
          <br/>
          <br/>
        </Cell>
        <Cell  top={3} left={2} height={3}>
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

export default MainPage;
