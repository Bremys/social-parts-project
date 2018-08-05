import React, { Component } from 'react';
import 'whatwg-fetch';

class Contacts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      sellerName: '',
      openingHours: '',
      sellerEmail: '',
      phoneNumber: '',
      sellerDesc: '',
      location: '',
      categories: '',
    };

    this.sellerNameChange = this.sellerNameChange.bind(this);
    this.openingHoursChange = this.openingHoursChange.bind(this);
    this.sellerEmailChange = this.sellerEmailChange.bind(this);
    this.phoneNumberChange = this.phoneNumberChange.bind(this);
    this.sellerDescChange = this.sellerDescChange.bind(this);
    this.locationChange = this.locationChange.bind(this);
    this.categoriesChange = this.categoriesChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  sellerNameChange(event) {
    this.setState({
      sellerName: event.target.value,
    });
  }

  
  openingHoursChange(event) {
    this.setState({
      openingHours: event.target.value,
    });
  }

  sellerEmailChange(event) {
    this.setState({
      sellerEmail: event.target.value,
    });
  }

  phoneNumberChange(event) {
    this.setState({
      phoneNumber: event.target.value,
    });
  }

  sellerDescChange(event) {
    this.setState({
      sellerDesc: event.target.value,
    });
  }

  locationChange(event) {
    this.setState({
      location: event.target.value,
    });
  }

  categoriesChange(event) {
    this.setState({
      categories: event.target.value,
    });
  }


  onSubmit() {
    // Grab state
    const {
        sellerName,
        openingHours,
        sellerEmail,
        phoneNumber,
        sellerDesc,
        location,
        categories,     
    } = this.state;

    this.setState({
      isLoading: true,
    });

    // Post request to backend
    fetch('/api/users/contactsupdate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sellerName: sellerName,
        openingHours: openingHours,
        sellerEmail: sellerEmail,
        phoneNumber: phoneNumber,
        sellerDesc: sellerDesc,
        location: location,
        categories: categories.split(','),
      }),
    }).then(res => res.json())
      .then(json => {
        console.log('json', json);
        if (json.success) {
          this.setState({
            isLoading: false,
            sellerName: sellerName,
            openingHours: openingHours,
            sellerEmail: sellerEmail,
            phoneNumber: phoneNumber,
            sellerDesc: sellerDesc,
            location: location,
            categories: categories,
          });
        } else {
          this.setState({
            isLoading: false,
          });
        }
      });
  }

  render() {
    const {
      isLoading,
      sellerName,
      openingHours,
      sellerEmail,
      phoneNumber,
      sellerDesc,
      location,
      categories,
    } = this.state;

    if (isLoading) {
      return (<div><p>Loading...</p></div>);
    }

    return (
      <div>
        <br />
        <br />
        <div>
          <span style={{
            color: "#E5E4E2"
          }}> <b>Contact Information</b> </span>
          <br/>
          <input
            type="text"
            placeholder="Seller Name"
            value={sellerName}
            onChange={this.sellerNameChange}
          /><br />
          <input
            type="text"
            placeholder="Opening Hours"
            value={openingHours}
            onChange={this.openingHoursChange}
          /><br />
          <input
            type="email"
            placeholder="Seller Email"
            value={sellerEmail}
            onChange={this.sellerEmailChange}
          /><br />
          <input
            type="text"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={this.phoneNumberChange}
          /><br />
          <textarea
            type="text"
            placeholder="Seller Description"
            value={sellerDesc}
            onChange={this.sellerDescChange}
          /><br />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={this.locationChange}
          /><br />
          <input
            type="text"
            placeholder="Categories to follow, seperate by ,"
            value={categories}
            onChange={this.categoriesChange}
          /><br />
          <button onClick={this.onSubmit}>Update Contacts</button>
        </div>

      </div>
    );
  }
}

export default Contacts;