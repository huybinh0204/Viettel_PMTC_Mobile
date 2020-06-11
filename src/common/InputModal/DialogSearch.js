// @flow
import React, { Component } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, FlatList, TextInput, TouchableWithoutFeedback, ScrollView } from 'react-native';

import moment from 'moment';
import { getFont, HEIGHT, WIDTH } from '../../config/Function';
import R from '../../assets/R';
import colors from '../../assets/colors';
import PickerSearch from '../Picker/PickerSearch';
import PickerItem from '../Picker/PickerItem';
import PickerDate from '../Picker/PickerDate';
import CheckBox from '../Picker/CheckBox'

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
class DialogSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      dataValue: []
    };
    this.dataValue = []
  }

  /**
 * Function to show modal
 * @param modalVisible true to show and false to hide modal
 */
  setModalVisible = (visible) => {
    this.setState({
      modalVisible: visible
    })
  }


  componentDidMount() {
    this.initArrayResult()
    this.setState({ dataValue: this.dataValue })
  }

  /**
 * This Function to init array results first render
 */
  initArrayResult = () => {
    this.props.data.map((item) => {
      let value = ''
      if (item.type === R.strings.TYPE_ITEM_DIALOGSEARCH.PICKER) {
        value = item.data[0].name
      }
      if (item.type === R.strings.TYPE_ITEM_DIALOGSEARCH.DATEPICKER) {
        value = moment(new Date()).format('DD/MM/YYYY')
      }
      if (item.type === R.strings.TYPE_ITEM_DIALOGSEARCH.CHECKBOX) {
        value = true
      }
      this.dataValue.push(value)
    })
  }

  /**
 *render item:type 0 TextInput, 1 Picker, 2 AutoComplete, 3 Calendar, 4 CheckBox
 * @param modalVisible true to show and false to hide modal
 */
  renderItem = ({ item, index } : {item:Item, index:number}) => {
    const { titleStyle, inputBoxStyle, textContentStyle, onValueChange } = this.props
    return (
      <TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[styles.title, titleStyle && titleStyle]}>
            {item.title}
          </Text>
        </View>
        {item.type === R.strings.TYPE_ITEM_DIALOGSEARCH.TEXTINPUT && <TextInput
          style={[styles.inputBox, textContentStyle && textContentStyle, inputBoxStyle && inputBoxStyle]}
          multiline={item.title === 'Nội dung'}
          onChangeText={text => {
            this.dataValue[index] = text
            onValueChange && onValueChange(text, index)
          }}
          placeholder={item.placeholder}
        />}
        {item.type === R.strings.TYPE_ITEM_DIALOGSEARCH.PICKER && <PickerItem
          width={WIDTH(331)}
          data={item.data && item.data}
          value={item.value && item.value}
          textStyle={textContentStyle && textContentStyle}
          containerStyle={inputBoxStyle && inputBoxStyle}
          onValueChange={(text) => {
            this.dataValue[index] = text
            onValueChange && onValueChange(text, index)
          }}
        />}
        {item.type === R.strings.TYPE_ITEM_DIALOGSEARCH.AUTOCOMPLETESEARCH && <PickerSearch
          textStyle={textContentStyle && textContentStyle}
          containerStyle={inputBoxStyle && inputBoxStyle}
          onValueChange={(text) => {
            this.dataValue[index] = text
            onValueChange && onValueChange(text, index)
          }}
          title={item.title}
          width={WIDTH(331)}
          data={item.data}
          value={item.value}
          placeholder={item.placeholder}
        />}
        {item.type === R.strings.TYPE_ITEM_DIALOGSEARCH.DATEPICKER && <PickerDate
          textStyle={textContentStyle && textContentStyle}
          containerStyle={inputBoxStyle && inputBoxStyle}
          minDate="01/01/1900"
          value={item.value}
          onValueChange={(text) => {
            this.dataValue[index] = text
            onValueChange && onValueChange(text, index)
          }}
          placeholder={item.placeholder}
        />}
        {item.type === R.strings.TYPE_ITEM_DIALOGSEARCH.CHECKBOX && <CheckBox
          value={item.value}
          textStyle={textContentStyle && textContentStyle}
          containerStyle={inputBoxStyle && inputBoxStyle}
          title={item.title}
          onValueChange={(text) => {
            this.dataValue[index] = text
            onValueChange && onValueChange(text, index)
          }}
        />}
      </TouchableOpacity>
    )
  }

  onSubmit=() => {
    this.setState({
      modalVisible: false
    })
  }

  render() {
    const { buttonStyle, textButtonStyle, textButton, data, onPressConfirm } = this.props

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={() => { this.setModalVisible(false) }}
      >
        <TouchableWithoutFeedback
          onPress={() => { this.setModalVisible(false) }}
        >
          <View
            style={styles.opacity}
          >
            <TouchableWithoutFeedback>
              <View style={styles.modal}>
                <View style={{ alignItems: 'center' }}>

                  <View style={styles.body}>
                    <ScrollView
                      showsVerticalScrollIndicator={true}
                      style={{ paddingBottom: HEIGHT(5) }}
                    >
                      <FlatList
                        data={data && data}
                        renderItem={this.renderItem}
                        keyExtractor={({ index }) => index}
                      />
                    </ScrollView>
                  </View>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <TouchableOpacity
                    onPress={() => {
                      onPressConfirm(this.dataValue)
                      this.setModalVisible(false)
                    }}
                    style={[styles.buttonComplete, buttonStyle && buttonStyle]}
                  >
                    <Text style={[styles.textBtnTao, textButtonStyle && textButtonStyle]}>{textButton || 'Tìm kiếm'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      this.setModalVisible(false)
                    }}
                  >
                    <Text style={styles.textExit}>Thoát</Text>
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

export default DialogSearch;
const styles = StyleSheet.create({
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
    alignItems: 'center',
    paddingHorizontal: WIDTH(12)
  },
  body: {
    width: WIDTH(331),
    height: HEIGHT(300),
    marginTop: HEIGHT(10),
    paddingBottom: HEIGHT(5)
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
  buttonComplete: {
    width: WIDTH(251),
    paddingVertical: HEIGHT(14),
    backgroundColor: colors.colorMain,
    borderRadius: HEIGHT(8),
    marginTop: HEIGHT(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
  textExit: {
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
