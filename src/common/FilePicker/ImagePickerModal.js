import React, { Component } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import ImagePicker from 'react-native-image-crop-picker';
import { getFont, HEIGHT, WIDTH } from '../../config/Function';
import R from '../../assets/R';
import colors from '../../assets/colors';


/**
 * @callback onPickedImage Function to get array images picked onPickedImage(images:Array) result: [{path...},{path...}]
 * @method setModalVisible To show popUp and pick image (call menthol using ref)
 */
class ImagePickerModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    };
  }

  /**
   * This Function to help you chose image from galery or take new photo
   * @param visible To show imagepicker popup
   */

  setModalVisible = async (visible) => {
    this.setState({
      modalVisible: visible
    })
  }

  onchoosGalery = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      multiple: true
    }).then(images => {
      this.setState({ modalVisible: false })
      this.props.onPickedImage(images)
    });
  }

  onCapture = () => {
    ImagePicker.openCamera({
      mediaType: 'photo',
      width: 300,
      height: 400,
    }).then((image) => {
      this.setState({ modalVisible: false })
      this.props.onPickedImage([image])
    });
  }

  render() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={() => this.setModalVisible(false)}
      >
        <TouchableWithoutFeedback
          onPress={() => { this.setModalVisible(false) }}
        >
          <View
            style={styles.opacity}
          >
            <TouchableWithoutFeedback>
              <View style={styles.modal}>
                <View style={styles.header}>
                  <View />
                  <Text style={{ fontSize: getFont(18), fontFamily: 'Roboto', fontWeight: 'bold' }}>Chọn ảnh</Text>
                  <TouchableOpacity
                    onPress={() => this.setModalVisible(false)}
                  >
                    <AntDesign name="closecircleo" size={WIDTH(23)} color={R.colors.colorTextDetail} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => this.onCapture()}
                  style={{ padding: WIDTH(10), marginTop: HEIGHT(15), }}
                >
                  <Text style={{ fontSize: getFont(18), color: R.colors.blue }}>Chụp ảnh bằng Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.onchoosGalery()}
                  style={{ padding: WIDTH(10), marginTop: HEIGHT(15) }}
                >
                  <Text style={{ fontSize: getFont(18), color: R.colors.blue }}>Chọn ảnh từ thư viện</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: getFont(14), fontStyle: 'italic', marginTop: HEIGHT(10) }}>* Bấm giữ ảnh để chọn được nhiều ảnh</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

export default ImagePickerModal;
const styles = StyleSheet.create({
  loadingContainer: {
    elevation: 3,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: WIDTH(355),
    paddingLeft: WIDTH(38),
    paddingHorizontal: WIDTH(15),
    paddingVertical: HEIGHT(5),
    alignSelf: 'center'


  },
  opacity: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#rgba(0,0,0,0.7)'
  },
  modal: {
    backgroundColor: R.colors.white100,
    width: WIDTH(355),
    borderRadius: WIDTH(10),
    paddingTop: HEIGHT(16),
    paddingBottom: HEIGHT(14),
    paddingHorizontal: WIDTH(12)
  },
  body: {
    width: WIDTH(331)
  },
  inputBox: {
    width: WIDTH(331),
    paddingVertical: HEIGHT(8),
    borderRadius: HEIGHT(8),
    paddingHorizontal: WIDTH(14),
    height: HEIGHT(48),
    fontSize: getFont(16),
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D3DEE8',
  },
  buttonLogin: {
    width: WIDTH(251),
    paddingVertical: HEIGHT(14),
    backgroundColor: colors.colorMain,
    borderRadius: HEIGHT(8),
    marginTop: HEIGHT(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
  kiemtra: {
    fontSize: getFont(16),
    color: '#828282',
    textAlign: 'center',
    marginTop: HEIGHT(14)
  },
  textBtnTao: {
    fontWeight: '500',
    color: colors.white,
    fontSize: getFont(16),
    textAlign: 'center'
  },
  title: {
    color: '#1B1A1A',
    fontSize: getFont(16),
    fontWeight: 'bold',
    marginBottom: HEIGHT(8),
    marginTop: HEIGHT(12)
  },
  textBtn: {
    fontWeight: '500',
    color: colors.colorMain,
    fontSize: getFont(15),
    marginRight: WIDTH(11)
  },
});
