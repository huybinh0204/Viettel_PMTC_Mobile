import React, { PureComponent } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, FlatList, SafeAreaView } from 'react-native';
import i18n from 'assets/languages/i18n';
import FastImage from 'react-native-fast-image';
import { getFont, HEIGHT, WIDTH, getFontXD, getLineHeight, HEIGHTXD, WIDTHXD, getWidth, getLineHeightXD } from '../../config/Function';
import R from '../../assets/R';
import colors from '../../assets/colors';


/**
   * Displays a popup search with a list of data that returns the value of the selected item
   *@param title title of popup search(string)
   *@callback onValueChange call when you choice one of list item with param name and item
   *@method setModalVisible to set show and hide this popup(param true to show and false to hide)
   *
   */
class ModalAdd extends PureComponent {
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

  _renderItem = (item, index, onChange) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => {
        this.setModalVisible(false);
        onChange(index);
      }}
    >
      <View>
        <FastImage
          style={styles.viewIcon}
          source={item.icon}
        />
      </View>
      <Text style={styles.iconName}>{item.name}</Text>
    </TouchableOpacity>
  )

  render() {
    const { onChange } = this.props;
    const menu = [
      {
        name: i18n.t('STATEMENT_T'),
        icon: R.images.toTrinh
      },
      {
        name: 'Đề nghị TT',
        icon: R.images.deNghi
      },
      {
        name: 'Bảng THTT',
        icon: R.images.bangTHTT
      },
      {
        name: i18n.t('INVOICE_T'),
        icon: R.images.hoaDon
      },
    ]
    return (
      <Modal
        onRequestClose={() => { this.setModalVisible(false) }}
        animationType="slide"
        transparent={true}
        visible={this.state.modalVisible}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <TouchableWithoutFeedback
            onPress={() => { this.setModalVisible(false) }}
          >
            <View
              style={styles.opacity}
            >
              <TouchableWithoutFeedback>
                <View style={styles.container}>
                  <FlatList
                    data={menu}
                    renderItem={({ item, index }) => this._renderItem(item, index, onChange)}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      </Modal>
    );
  }
}

export default ModalAdd;
const styles = StyleSheet.create({
  opacity: {
    flex: 1,
    justifyContent: 'flex-end',
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
  container: {
    width: getWidth(),
    alignSelf: 'center',
    backgroundColor: R.colors.white,
    paddingTop: HEIGHTXD(39),
    paddingBottom: HEIGHTXD(72),
    borderTopLeftRadius: WIDTHXD(36),
    borderTopRightRadius: WIDTHXD(36),
  },
  itemContainer: {
    width: getWidth() / 4,
    alignItems: 'center',
  },
  viewIcon: {
    width: WIDTHXD(150),
    height: WIDTHXD(150),
    borderRadius: WIDTHXD(100),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    opacity: 1
  },
  iconName: {
    fontSize: getFontXD(40),
    lineHeight: getLineHeightXD(48),
    color: R.colors.black0,
    fontFamily: R.fonts.RobotoRegular,
    opacity: 1,
    marginTop: HEIGHTXD(21),
    alignSelf: 'center'
  },
});
