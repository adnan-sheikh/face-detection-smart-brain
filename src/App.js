import React, { Component } from 'react';
import './App.css';
import 'tachyons';
import Particles from 'react-tsparticles';

import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo';
import Rank from './Components/Rank/Rank';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import Clarifai from 'clarifai';

const app = new Clarifai.App({
  apiKey: '',
});

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

class App extends Component {
  constructor(props) {
    super(props);
    this.particlesInit = this.particlesInit.bind(this);
    this.particlesLoaded = this.particlesLoaded.bind(this);
    this.state = {
      input: '',
      imageUrl: '',
    };
  }

  particlesInit(main) {
    console.log(main);
  }

  particlesLoaded(container) {
    console.log(container);
  }

  handleInputChange = ({ target }) => {
    this.setState({
      input: target.value,
    });
  };

  handleButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    app.models
      .initModel({
        id: Clarifai.FACE_DETECT_MODEL,
        version: '45fb9a671625463fa646c3523a3087d5',
      })
      .then((generalModel) => {
        if (this.state.imageUrl.includes('.jpg')) {
          return generalModel.predict(this.state.imageUrl);
        }
        console.log('please use images with .jpg extension');
      })
      .then((response) => {
        const data = response.outputs[0].data;
        console.log(data);
        if (!data.regions) {
          console.log(
            'There are no faces in this image. Try for some images including faces!'
          );
        } else {
          if (data.regions.length === 1) {
            console.log(
              `I can only identify ${data.regions.length} face in this image.`
            );
          } else {
            console.log(
              `I can identify ${data.regions.length} faces in this image.`
            );
          }
          const boundingBox = data.regions[0].region_info.bounding_box;
          console.log(boundingBox);
        }
      });
  };

  render() {
    return (
      <div className='App'>
        <Particles
          className='particles'
          id='tsparticles'
          init={this.particlesInit}
          loaded={this.particlesLoaded}
          options={particleOptions}
        />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm
          onInputChange={this.handleInputChange}
          onButtonSubmit={this.handleButtonSubmit}
        />
        <FaceRecognition imageUrl={this.state.imageUrl} />
      </div>
    );
  }
}

export default App;
