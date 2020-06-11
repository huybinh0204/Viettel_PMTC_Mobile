import React, { PureComponent } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { getFont, HEIGHT, WIDTH, getFontXD, getLineHeight, HEIGHTXD, WIDTHXD, getWidth } from '../../config/Function';
import R from '../../assets/R';
import colors from '../../assets/colors';

/**
   * Displays a popup search with a list of data that returns the value of the selected item
   *@param title title of popup search(string)
   *@callback onValueChange call when you choice one of list item with param name and item
   *@method setModalVisible to set show and hide this popup(param true to show and false to hide)
   *
   */
class Confirm extends PureComponent {
  state = {
    modalVisible: false,

  };

  /**
   * This Function to open, close modal
   */
  setModalVisible = (visible: boolean) => {
    this.setState({
      modalVisible: visible
    })
  }

  render() {
    const { title, titleLeft, titleRight, onPressLeft, onPressRight } = this.props
    return (
      <Modal
        onRequestClose={() => { this.setModalVisible(false) }}
        animationType="slide"
        transparent={true}
        visible={this.state.modalVisible}
      >
        <TouchableWithoutFeedback
          onPress={() => { this.setModalVisible(false) }}
        >
          <View
            style={styles.opacity}
          >
            <TouchableWithoutFeedback>
              <View style={styles.modal}>
                <Text style={styles.title}>{title}</Text>
                <View style={styles.container}>
                  <TouchableOpacity
                    hitSlop={{ top: 20, bottom: 20, left: 50, right: 10 }}
                    onPress={() => {
                      onPressLeft();
                      this.setModalVisible(false)
                    }}
                    style={styles.btnButton}
                  >
                    <Text style={styles.text}>{titleLeft}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    hitSlop={{ top: 20, bottom: 20, left: 10, right: 50 }}
                    onPress={() => {
                      onPressRight();
                      this.setModalVisible(false)
                    }}
                    style={{ flex: 0, marginLeft: WIDTHXD(120) }}
                  >
                    <Text style={[styles.text, { color: R.colors.colorMain }]}>{titleRight}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

export default Confirm;
const styles = StyleSheet.create({
  opacity: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#rgba(0,0,0,0.7)'
  },
  btnButton: {
    flex: 0,
  },
  text: {
    color: '#949494',
    fontSize: getFontXD(48),
    fontFamily: R.fonts.RobotoMedium
  },
  modal: {
    backgroundColor: R.colors.white100,
    minWidth: WIDTHXD(750),
    maxWidth: getWidth() * 0.8,
    borderRadius: WIDTHXD(30),
    // minHeight: HEIGHTXD(369),
    paddingVertical: HEIGHTXD(59),
    paddingTop: HEIGHTXD(61),
    paddingHorizontal: WIDTHXD(60),
    alignItems: 'center',
  },
  title: {
    color: R.colors.black0,
    width: WIDTHXD(557),
    flexWrap: 'wrap',
    paddingRight: WIDTHXD(27),
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: HEIGHTXD(87),
  },
});
