/*

MIT License

Copyright (c) 2019 Adib Mohsin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

import React, { Component } from "react";
import { Dimensions, Animated, Easing, PanResponder } from "react-native";
import Styled from "styled-components/native";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
const SCREEN_EDGE = WIDTH * 0.3;

export default class Toast extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pan: new Animated.ValueXY(),
      opacity: new Animated.Value(0),
      text: "",
      backgroundColor: "#000",
      textColor: "#fff",
      duration: 2500,
      swipeEnabled: true,
      round: true,
      customStyles: {},
      position: "top"
    };

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_event, gesture) => {
        this.state.pan.setValue({
          x: gesture.dx,
          y: gesture.dy
        });
      },
      onPanResponderEnd: (_event, gesture) => {
        if (gesture.dx > SCREEN_EDGE) {
          this.forceSwipe();
        } else if (gesture.dx < -SCREEN_EDGE) {
          this.forceSwipe();
        } else {
          Animated.spring(this.state.pan, {
            toValue: {
              x: 0,
              y: 0
            }
          }).start();
        }
      }
    });

    this.containerOpacity = this.state.pan.x.interpolate({
      inputRange: [-100, 0, 100],
      outputRange: [0, 1, 0]
    });
  }

  forceSwipe = () => {
    this.state.opacity.setValue(0);
    this.state.pan.setValue({
      x: 0,
      y: 0
    });
  };

  /*
    OPTIONS => {
      backgroundColor,
      textColor,
      duration,
      round,
      customStyles
    }
  */

  validateOptions = options => {
    if (options !== undefined && options !== null) {
      if (
        options.backgroundColor !== undefined &&
        options.backgroundColor !== null
      ) {
        this.setState({ backgroundColor: options.backgroundColor });
      }

      if (options.textColor !== undefined && options.textColor !== null) {
        this.setState({ textColor: options.textColor });
      }

      if (options.duration !== undefined && options.duration !== null) {
        this.setState({ duration: options.duration });
      }

      if (options.round !== undefined && options.round !== null) {
        this.setState({ round: options.round });
      }

      if (options.customStyles !== undefined && options.customStyles !== null) {
        this.setState({ customStyles: options.customStyles });
      }

      if (options.position !== undefined && options.position !== null) {
        this.setState({ position: options.position });
      }
    }
  };

  /**
   * One man army function for showing the toast function
   * @param {String} text
   * @param {object} options
   */
  showToast = (text, options) => {
    this.validateOptions(options);
    this.setState({ text });
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 300,
      easing: Easing.in()
    }).start(() => {
      setTimeout(() => {
        Animated.timing(this.state.opacity, {
          toValue: 0,
          duration: 300,
          easing: Easing.in()
        }).start();
      }, this.state.duration);
    });
  };

  render() {
    return (
      <AnimatedContainer
        style={{
          opacity: this.containerOpacity,
          top: this.state.position === "top" ? 120 : HEIGHT - 200
        }}
      >
        <AnimatedToastView
          style={{
            opacity: this.state.opacity,
            ...this.state.pan.getLayout(),
            backgroundColor: this.state.backgroundColor,
            borderRadius: this.state.round ? 20 : 5,
            ...this.state.customStyles
          }}
          {...this.panResponder.panHandlers}
        >
          <ToastText style={{ color: this.state.textColor }}>
            {this.state.text}
          </ToastText>
        </AnimatedToastView>
      </AnimatedContainer>
    );
  }
}

const Container = Styled.View`
  position: absolute;
`;

const ToastView = Styled.View`
  background: #000000;
  border-radius: 20px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;

const AnimatedToastView = Animated.createAnimatedComponent(ToastView);
const AnimatedContainer = Animated.createAnimatedComponent(Container);

const ToastText = Styled.Text`
  color: white;
  text-align: center;
  font-size: 14px;
  padding: 10px;
`;
