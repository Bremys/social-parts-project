import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import 'whatwg-fetch';
import Modal from 'react-modal';
import styled from 'styled-components';
import {Grid, Cell} from 'styled-css-grid';

const StyledImg = styled.img`
    display: block;
    width: 100%;
    height: auto;
`;

const ulStyle = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
`;


class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false,
            currImage: 0,
            comments: [],
        }
        this.closeModal = this.closeModal.bind(this);
        this.shiftRight = this.shiftRight.bind(this);
        this.shiftLeft = this.shiftLeft.bind(this);
        this.handleComment = this.handleComment.bind(this);
    }


    componentDidMount(){
        const {
            postId
        } = this.props;
        fetch(`/api/${postId}/comments`)
        .then((res) => res.json())
        .then((json) => {
            console.log(json);
            this.setState({
                comments: json.comments
            });
        });
    }

    handleComment(event){
        if(event.key == 'Enter'){
            const {
                comments
            } = this.state;
            fetch('/api/post/comment', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    comment: event.target.value,
                    postId: this.props.postId,
                })
            })
            .then((res) => res.json())
            .then((json) => {
                if(json.success) {
                    this.setState({
                        comments: json.comments
                    });
                }  
            });
        }
    }

    shiftLeft(){
        const {
            album
        } = this.props;
        const {
            currImage
        } = this.state;
        this.setState({
            currImage: ((currImage - 1) + album.length) % album.length
        });
    }

    shiftRight(){
        const {
            album
        } = this.props;
        const {
            currImage
        } = this.state;
        this.setState({
            currImage: ((currImage + 1) + album.length) % album.length
        });
    }

    closeModal() {
        this.setState({modalIsOpen: false});
    }

    render () {
        const {
            poster,
            postType,
            title,
            price,
            content,
            album,
        } = this.props;

        const {
            modalIsOpen,
            currImage,
            comments,
        } = this.state;

         return (
            <>
                <Grid 
                    columns={3}
                    style={
                        {   
                            backgroundColor: "#E5E4E2",
                            border: "2px solid #b9314f",
                            outline: "2px solid #E5E4E2",
                            padding: "5px"
                        }
                    }
                >
                    <Cell top={1} left={2}>
                        <Link to={`/users/${poster.username}`}>
                            <h3>{poster.firstName + " " + poster.lastName}</h3>
                        </Link>
                        <br/>
                        <h3>{title}</h3>
                        <br/>
                        <p>{postType + ": " + price}</p>
                        <br/>
                        <p>{content}</p>
                        <br/>
                        {
                            (album.length !== 0) &&
                            <button 
                            onClick={() => this.setState({modalIsOpen: true})}>
                            View album
                            </button>
                        }
                        <Grid columns={1}>
                            <Cell>
                                <textarea onKeyDown={this.handleComment} placeholder={"New Comment"}/>
                            </Cell>
                            {
                                comments.map((comment, i) => {
                                    return (
                                        <>
                                            <Cell key={i}
                                                style={{
                                                    backgroundColor: "#fff",
                                                    border: "1px solid black",
                                                }}
                                            >
                                                <Link to={`/users/${comment.username}`}>
                                                    {comment.firstName + " " + comment.lastName}
                                                </Link>
                                                <br/>
                                                <p>{comment.comment}</p>
                                             </Cell>
                                        </>
                                    )
                                })
                            }
                        </Grid>
                    </Cell>
                    {(album.length !== 0) &&
                    <Cell top={2} left={2} center middle>
                        <Modal
                            isOpen={modalIsOpen}
                            onRequestClose={this.closeModal}
                            shouldCloseOnOverlayClick={true}
                        >
                            <Grid
                                columns={"20% 60% 20%"}
                            >
                                <Cell center middle>
                                    <button onClick={this.shiftLeft}>{"<-"}</button>
                                </Cell>
                                <Cell center middle>
                                    <StyledImg src={`data:${album[currImage].contentType};base64,${album[currImage].data.toString('base64')}`} />                                    
                                </Cell>
                                <Cell center middle>
                                    <button onClick={this.shiftRight}>{"->"}</button>
                                </Cell>
                            </Grid>
                        </Modal>
                    </Cell>}

                </Grid>
            </>
         );
    }

}

export default Post;