import React, { Component } from 'react';
import './App.css';
import 'tachyons';
import Particles from 'react-tsparticles';

import Navigation from './Components/Navigation/Navigation';
import SignIn from './Components/SignIn/SignIn';
import Register from './Components/Register/Register';
import Logo from './Components/Logo/Logo';
import Rank from './Components/Rank/Rank';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';

const particleOptions = {
  particles: {
    color: {
      value: '#ffffff',
    },
    links: {
      color: '#ffffff',
      distance: 150,
      enable: true,
      opacity: 0.5,
      width: 1,
    },
    collisions: {
      enable: true,
    },
    move: {
      direction: 'none',
      enable: true,
      outMode: 'bounce',
      random: false,
      speed: 1,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        value_area: 800,
      },
      value: 70,
    },
    opacity: {
      value: 0.5,
    },
    shape: {
      type: 'circle',
    },
    size: {
      random: true,
      value: 3,
    },
  },
};

const initialState = {
  input: '',
  imageUrl: '',
  boundingBoxes: [],
  isThereAnyFace: true,
  route: 'signin',
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: '',
  },
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  loadUser = (newUser) => {
    this.setState({
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        entries: newUser.entries,
        joined: newUser.joined,
      },
    });
  };

  calculateFaceLocation = (boundingBox) => {
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: boundingBox.left_col * width,
      topRow: boundingBox.top_row * height,
      rightCol: width - boundingBox.right_col * width,
      bottomRow: height - boundingBox.bottom_row * height,
    };
  };

  handleInputChange = ({ target }) => {
    this.setState({
      input: target.value,
    });
  };

  handleButtonSubmit = () => {
    this.setState({ box: [] });
    this.setState({ imageUrl: this.state.input });
    fetch('https://evening-ocean-62088.herokuapp.com/imageurl', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: this.state.input }),
    })
      .then((response) => response.json())
      .then((response) => {
        const data = response.outputs[0].data;
        if (response) {
          fetch('https://evening-ocean-62088.herokuapp.com/image', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: this.state.user.id }),
          })
            .then((response) => response.json())
            .then((count) => {
              this.setState(Object.assign(this.state.user, { entries: count }));
            })
            .catch(console.log);
        }
        if (!data.regions) {
          this.setState({ isThereAnyFace: false });
          console.log(
            'There are no faces in this image. Try for some images including faces!'
          );
        } else {
          this.setState({ isThereAnyFace: true });
          if (data.regions.length === 1) {
            console.log(
              `I can identify ${data.regions.length} face in this image.`
            );
          } else {
            console.log(
              `I can identify ${data.regions.length} faces in this image.`
            );
          }
          const boundingBoxArray = data.regions.map(
            (box) => box.region_info.bounding_box
          );
          this.setState({
            boundingBoxes: boundingBoxArray.map((boundingBox) =>
              this.calculateFaceLocation(boundingBox)
            ),
          });
        }
      })
      .catch((error) => console.log('Ohhh no!', error));
  };

  handleRouteChange = (newRoute) => {
    if (newRoute === 'signin') {
      this.setState(initialState);
    }
    this.setState({ route: newRoute });
  };

  render() {
    const { imageUrl, boundingBoxes, isThereAnyFace, route, user } = this.state;
    return (
      <div className='App'>
        <Particles
          className='particles'
          id='tsparticles'
          options={particleOptions}
        />
        {route === 'home' ? (
          <>
            <Navigation onRouteChange={this.handleRouteChange} />
            <Logo />
            <Rank name={user.name} entries={user.entries} />
            <ImageLinkForm
              onInputChange={this.handleInputChange}
              onButtonSubmit={this.handleButtonSubmit}
            />
            <FaceRecognition
              boundingBoxes={boundingBoxes}
              imageUrl={imageUrl}
              isThereAnyFace={isThereAnyFace}
            />
          </>
        ) : route === 'signin' ? (
          <SignIn
            loadUser={this.loadUser}
            onRouteChange={this.handleRouteChange}
          />
        ) : (
          <Register
            loadUser={this.loadUser}
            onRouteChange={this.handleRouteChange}
          />
        )}
      </div>
    );
  }
}

export default App;
