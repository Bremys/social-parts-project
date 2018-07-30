import React, { Component } from 'react';
import {Cell, Grid} from 'styled-css-grid';
import styled from 'styled-components'
import 'whatwg-fetch';

const StyledImg = styled.img`
    display: block;
    width: 95%;
    height: auto;
`;

const ChosenImg = StyledImg.extend`
    box-shadow: 0 0 5px rgba(81, 203, 238, 1);
    border: 1px solid rgba(81, 203, 238, 1);
`;

class CreatePost extends Component {
    constructor(props) {
      super(props);
      this.state = {
          uploadedImages: [],
          uploadedImagesUrl: [],
          selectedImages: [],
          currImage: -1,
          title: '',
          content: '',
          buyerSeller: 'BUY',
          price: 0,
          categories: 0,
      }

      this.urlify = (arr) => arr.map((file) => URL.createObjectURL(file));
      
      this.handleTitle = this.handleTitle.bind(this);
      this.handleContent = this.handleContent.bind(this);
      this.handleFiles = this.handleFiles.bind(this);
      this.uploadSelected = this.uploadSelected.bind(this);
      this.removeCurr = this.removeCurr.bind(this);
      this.shiftRight = this.shiftRight.bind(this);
      this.shiftLeft = this.shiftLeft.bind(this);
      this.uploadPost = this.uploadPost.bind(this);
      this.handleSelect = this.handleSelect.bind(this);
      this.handlePrice = this.handlePrice.bind(this);
      this.handleCategories = this.handleCategories.bind(this);
    }

    handleCategories(event) {
        console.log(event.target.value);
        this.setState({
          categories: event.target.value
        });
    }

    handleSelect(event) {
        console.log(event.target.value);
        this.setState({
          buyerSeller: event.target.value
        });
    }

    handlePrice(event) {
        console.log(event.target.value);
        this.setState({
          price: event.target.value
        });
    }

    handleTitle(event) {
      console.log(event.target.value);
      this.setState({
        title: event.target.value
      });
    }

    handleContent(event) {
      console.log(event.target.value);
        this.setState({
            content: event.target.value
        });
    }

    handleFiles(event) {
      let selectedImages = Array.from(event.target.files);
      this.setState({
        selectedImages: selectedImages
      });
    }

    uploadSelected() {
        let {
            uploadedImages,
            selectedImages
        } = this.state;
        console.log("Before: ", uploadedImages);
        let newUploaded = [...uploadedImages, ...selectedImages];
        console.log("After: ", newUploaded);
        this.setState({
            uploadedImages: newUploaded,
            uploadedImagesUrl: this.urlify(newUploaded),
            currImage: newUploaded.length - 1,
        });
      }

      removeCurr() {
        let {
            uploadedImages,
            currImage
        } = this.state;
        uploadedImages.splice(currImage, 1);
        if(uploadedImages.length === 0) {
            currImage = -1;
        }
        else if (currImage !== 0) {
            currImage = currImage-1;
        }
        this.setState({
            uploadedImages: uploadedImages,
            uploadedImagesUrl: this.urlify(uploadedImages),
            currImage: currImage,
        });
      }

      shiftRight() {
        let {
            uploadedImages,
            currImage
        } = this.state;
        if (currImage !== uploadedImages.length -1 ){
            uploadedImages[currImage+1] = uploadedImages.splice(currImage, 1, uploadedImages[currImage+1])[0];
            this.setState({
                uploadedImages: uploadedImages,
                uploadedImagesUrl: this.urlify(uploadedImages),
                currImage: (currImage+1),
            });
        }
      }

      shiftLeft() {
        let {
            uploadedImages,
            currImage
        } = this.state;
        if (currImage !== 0 ){
            uploadedImages[currImage-1] = uploadedImages.splice(currImage, 1, uploadedImages[currImage-1])[0];
            this.setState({
                uploadedImages: uploadedImages,
                uploadedImagesUrl: this.urlify(uploadedImages),
                currImage: (currImage-1),
            });
        }
      }

      uploadPost() {
        const {
            uploadedImages,
            title,
            content,
            buyerSeller,
            price,
            categories,
        } = this.state;

        const data = new FormData();
        data.append('title', title);
        data.append('content', content);
        uploadedImages.forEach((file, i) => {
            data.append(`file[${i}]`, file);
        });
        data.append('buyerSeller', buyerSeller);
        data.append('price', price);
        data.append('categories', categories);
        fetch('/api/newpost', {
            method: 'POST',
            body: data,
        })
      }
  


    render() {
        const {
            uploadedImagesUrl,
            currImage,
        } = this.state;

        const ImageNav = () => {
            return (
            <>
                <button onClick={this.removeCurr}>{"-"}</button>
                <button onClick={this.shiftRight}>{"->"}</button>
                <button onClick={this.shiftLeft}>{"<-"}</button>
            </>
            );
        };
        

        
        return (
            <>
            <Grid columns={5}>
            <Cell center middle
                left={3}
                top={1}
            >
            <input 
                type="text" 
                placeholder="Title"
                onChange={this.handleTitle}
                />
            <br/>
            <textarea 
            onChange={this.handleContent}          
            />
            <br/>
            <input 
                type="file" 
                onChange={this.handleFiles}
                formEncType={'multipart/form-data'}
                />
                <br/>
                <select
                    onChange={this.handleSelect}
                >
                    <option value={"BUY"}>Buy</option>
                    <option value={"SELL"}>Sell</option>
                </select>
                <br/>
                <input 
                    type="number"
                    onChange={this.handlePrice}
                    placeholder="Price"
                />
            <br/>
            <input 
                    type="text"
                    onChange={this.handleCategories}
                    placeholder="Categories - split with ,"
                />
            <br/>
            </Cell>
            <Cell center middle left={3} top={2}>
            <button onClick={this.uploadSelected}>{"+"}</button>
                {
                    currImage !== -1? <ImageNav/> : null
                }
            <br/>
            <button onClick={this.uploadPost}>Post</button>
            </Cell>
            
                    {
                        uploadedImagesUrl.map((image, i) => {
                            return (
                                <Cell
                                top={3 + Math.floor(i/5)}
                                left={(i%5)+1}
                                style={
                                    {
                                        width: "200px",
                                        height: "150px",
                                        position: "relative",
                                        display: "inline-block",
                                        overflow: "hidden",
                                        margin: "0",
                                    
                                    }
                                }
                                onClick={
                                    () => this.setState({currImage: i})
                                }
                                key={i}>
                                    {
                                        currImage === i? <ChosenImg src={image}/> : <StyledImg src={image}/>
                                    }
                                </Cell>
                            );
                        })
                    }
                </Grid>
            </>
        );
    }
  }

export default CreatePost;