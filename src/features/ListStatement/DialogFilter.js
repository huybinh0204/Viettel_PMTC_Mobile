import React, { Component } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TouchableWithoutFeedback,
  ScrollView
} from 'react-native';
import IconClose from 'react-native-vector-icons/AntDesign';
import {
  getFont,
  HEIGHT,
  WIDTH,
  WIDTHXD,
  HEIGHTXD,
  getFontXD
} from '../../config/Function';
import R from '../../assets/R';
import colors from '../../assets/colors';
import PickerItem from '../../common/Picker/PickerItem';

/** This class render Dialog Search with list data ( each type of item will show different view
 * you can check type of item in R.strings.TYPE_ITEM_DIALOGSEARCH)(data for example [  {
    title: 'Số tờ trình gốc',
    type: R.strings.TYPE_ITEM_DIALOGSEARCH.TEXTINPUT,
    data: [],
    value: '',
    placeholder: 'Nhập số tờ trình gốc',
  }])
   * @param titleStyle to custom style of title
   * @param textContentStyle to custom style of text content
   * @param inputBoxStyle custom style box Input
   * @param buttonStyle custom style list button
   * @param containerStyle custom style container
   * @param textButtonStyle custom style of text button
   * @param itemListStyle to custom style item of list
   * @callback renderItem function render item, if null use default
   * @callback onPressConfirm Function when you choice finish return list value of Item ( Array for example ['1','17/03/1992','',true])
   * @callback onValueChange If you want to receive the data change of each item pass this function when you change value return value, index of Item for example onValueChange(val,index)
   */
class DialogFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      filter: []
    };
  }

  /**
   * Function to show modal
   * @param modalVisible true to show and false to hide modal
   */
  setModalVisible = visible => {
    this.setState({
      modalVisible: visible
    });
  };

  componentDidMount() {
    // this.initArrayResult()
  }

  /**
   * This Function to init array results first render
   */
  initArrayResult = () => {
    this.props.data.map(item => {
      let value = '';
      if (item.type === R.strings.TYPE_ITEM_DIALOGSEARCH.PICKER) {
        this.state.filter.push(item.data[0]);
      }
    });
  };

  renderItem = (item, index) => {
    const { inputBoxStyle, textContentStyle } = this.props;
    const { filter } = this.state;
    return (
      <TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.title}>{item.title}</Text>
        </View>
        <PickerItem
          width={WIDTHXD(695)}
          data={item.data}
          value={filter[index]}
          textStyle={textContentStyle && textContentStyle}
          containerStyle={inputBoxStyle && inputBoxStyle}
          onValueChange={val => {
            filter[index] = val;
            this.setState({ filter });
          }}
        />
      </TouchableOpacity>
    );
  };

  onSubmit = () => {
    this.setState({
      modalVisible: false
    });
  };

  render() {
    const {
      buttonStyle,
      textButtonStyle,
      textButton,
      data,
      onPressConfirm,
      title
    } = this.props;
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={() => {
          this.setModalVisible(false);
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            this.setModalVisible(false);
          }}
        >
          <View style={styles.opacity}>
            <TouchableWithoutFeedback>
              <View style={styles.modal}>
                <View style={{ alignItems: 'center' }}>
                  <View style={styles.viewTitle}>
                    <Text style={styles.styleTitle}>{title}</Text>
                    <TouchableOpacity
                      onPress={() => this.setModalVisible(false)}
                      style={styles.btClose}
                    >
                      <IconClose
                        name="close"
                        size={WIDTHXD(48)}
                        color={R.colors.black0}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.body}>
                    <ScrollView
                      showsVerticalScrollIndicator={true}
                      style={{ paddingBottom: HEIGHTXD(47) }}
                    >
                      <FlatList
                        data={data}
                        renderItem={({ item, index }) => this.renderItem(item, index)
                        }
                        keyExtractor={(item, index) => {
                          index.toString();
                        }}
                        extraData={this.state}
                      />
                    </ScrollView>
                  </View>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setModalVisible(false);
                      onPressConfirm(this.state.filter);
                    }}
                    style={[styles.buttonComplete, buttonStyle && buttonStyle]}
                  >
                    <Text
                      style={[
                        styles.textBtnTao,
                        textButtonStyle && textButtonStyle
                      ]}
                    >
                      {textButton || 'Tìm kiếm'}
                    </Text>
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

export default DialogFilter;
const styles = StyleSheet.create({
  opacity: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#rgba(0,0,0,0.7)'
  },
  viewTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    width: WIDTHXD(695),
    justifyContent: 'center'
  },

  styleTitle: {
    fontSize: getFontXD(48),
    color: R.colors.colorMain,
    fontFamily: R.fonts.RobotoMedium,
    flex: 10,
    textAlign: 'center',
    marginLeft: WIDTHXD(50)
  },

  btClose: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end'
  },

  modal: {
    backgroundColor: R.colors.white100,
    width: WIDTHXD(800),
    borderRadius: WIDTHXD(30),
    paddingTop: HEIGHT(16),
    paddingBottom: HEIGHTXD(60),
    alignItems: 'center',
    paddingHorizontal: WIDTHXD(12)
  },
  body: {
    width: WIDTHXD(800),
    paddingBottom: HEIGHTXD(30),
    justifyContent: 'center',
    alignItems: 'center'
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
    borderColor: '#D3DEE8'
  },
  buttonComplete: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  textExit: {
    fontSize: getFont(16),
    color: '#828282',
    textAlign: 'center',
    marginTop: HEIGHT(14)
  },
  textBtnTao: {
    fontWeight: '500',
    color: colors.colorMain,
    fontSize: getFont(16),
    textAlign: 'center'
  },
  textBtn: {
    fontWeight: '500',
    color: colors.colorMain,
    fontSize: getFont(15),
    marginRight: WIDTH(11)
  },
  title: {
    color: R.colors.color777,
    fontSize: getFontXD(36),
    fontFamily: R.fonts.RobotoRegular,
    marginBottom: HEIGHTXD(8),
    marginTop: HEIGHTXD(50)
  }
});
