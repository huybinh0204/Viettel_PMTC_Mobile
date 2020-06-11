
import React, { Component } from 'react'
import {
  View, Text
} from 'react-native'
import ImageView from 'react-native-image-view';
import _ from 'lodash'
import R from '../../assets/R';
import { WIDTH, HEIGHT, getFont } from '../../config';

/**
 * @method setImageViewVisible Menthol to show imageviewer. Call this menthol using ref
 */
export default class ImageViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isImageViewVisible: false,
    };
    this.images = []
  }

  /**
 *This component show list image and support animation to view image
 *@param visible To show or hide ImageViewer
 *@param images Array image to view (eg:[
      { source: { uri: 'https://internetviettel.vn/wp-content/uploads/2017/05/4-1.jpg', }, title: 'Vườn cây xanh lá' },
      { source: { uri: 'https://imagevars.gulfnews.com/2020/01/07/Ronaldo_16f7ffce168_large.jpg', }, title: 'CR7' },
    ])
 */
  setImageViewVisible = async (visible, images) => {
    this.setState({
      isImageViewVisible: visible
    })
    this.images = images;
  }

  render() {
    return (
      <ImageView
        images={this.images}
        imageIndex={0}
        isVisible={this.state.isImageViewVisible}
        onClose={() => this.setState({ isImageViewVisible: false })}
        renderFooter={(currentImage) => (
          <View style={{ width: WIDTH(360), padding: HEIGHT(10), alignItems: 'center' }}>
            <Text style={{ fontSize: getFont(16), fontWeight: '500', color: R.colors.white }}>{_.has(currentImage, 'title') ? currentImage.title : ''}</Text>
          </View>
        )}
      />
    )
  }
}
