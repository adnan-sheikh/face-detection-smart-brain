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
  apiKey: '2a6d9a0d95d24da2a7c4801414f10779',
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
    this.state = {
      input: '',
      imageUrl: '',
      boundingBoxes: [],
    };
  }

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
    this.setState({box: []});
    this.setState({ imageUrl: this.state.input });
    app.models
      .initModel({
        id: Clarifai.FACE_DETECT_MODEL,
        version: '45fb9a671625463fa646c3523a3087d5',
      })
      .then((faceModel) => {
        if (this.state.imageUrl.includes('.jpg')) {
          return faceModel.predict(this.state.imageUrl);
        }
        console.log('please use images with .jpg extension');
      })
      .then((response) => {
        const data = response.outputs[0].data;
        if (!data.regions) {
          console.log(
            'There are no faces in this image. Try for some images including faces!'
          );
        } else {
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

  render() {
    return (
      <div className='App'>
        <Particles
          className='particles'
          id='tsparticles'
          options={particleOptions}
        />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm
          onInputChange={this.handleInputChange}
          onButtonSubmit={this.handleButtonSubmit}
        />
        <FaceRecognition
          boundingBoxes={this.state.boundingBoxes}
          imageUrl={this.state.imageUrl}
          boundingBoxesLength={this.state.boundingBoxes.length}
        />
      </div>
    );
  }
}

export default App;
