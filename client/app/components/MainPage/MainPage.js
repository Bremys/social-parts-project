import React from 'react';
import {Link} from 'react-router-dom';
// import openSocket from 'socket.io-client';
// const socket = openSocket('http://localhost:8000');


class MainPage extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      message: 'hi',
    };
    // this.sendSocketIO = this.sendSocketIO.bind(this);
  }

  // componentDidMount(){
  //   socket.addEventListener('newFeed', (serverMsg) => this.setState({
  //     message: serverMsg
  //   }));
  // }

//   sendSocketIO() {
//     socket.emit('example_message', 'demo');
// }

  render() {
    return (
    <>
      <Link to={'/main/post'}>New Post</Link>
    </>
    );
  }
}

export default MainPage;
