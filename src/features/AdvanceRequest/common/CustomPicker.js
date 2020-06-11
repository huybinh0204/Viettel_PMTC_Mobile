import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  Dimensions
} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import _ from 'lodash'
import R from '../../../assets/R';
import { WIDTHXD, getFontXD, HEIGHTXD } from '../../../config/Function';
/**
   * This Function to show piker with list date (for example [{name:'Picker1'},{name:'Picker2}])
   * @callback onValueChange return value of item you choice
   * @param value value of picker you choice
   * @param containerStyle custom containerStyle of view
   * @param data data value of date
   * @param width width of picker
   * @param height height of picker
   * @param date value of date you choice
   * @param heightItem height of picker Item
   * @param maxHeight set height of list item
   * other you can make minDate,maxDate... with props of libary react-native-datepicker
   */


export default class PickerItem extends Component {
  constructor(props) {
    super(props);
    this._button = null;
    this._buttonFrame = null;
    this.state = {
      value: '',
      showInBottom: true,
      data: [],
      defaultIndex: null
    };
  }

  componentDidMount() {
    this._dropdown.select(0)
    const { value, data } = this.props
    this._initStatePicker(data, value)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this._initStatePicker(nextProps.data, nextProps.value)
    } if (nextProps.data !== this.state.data) {
      this.setState({ data: nextProps.data })
    }
  }

  _initStatePicker = (data, value) => {
    if (data && data.length > 0) {
      if (typeof (value) === 'number') {
        let newValue = ''
        _.forEach(data, (item, index) => {
          if (item.value === value) newValue = data[index].name
        })
        this.setState({ value: newValue })
      } else {
        this.setState({ value, data })
      }
    }
  }

  _dropdownAdjustFrame = (style) => {
    const { showInBottom } = this.state
    let stylez = style
    if (!showInBottom) {
      stylez.top += HEIGHTXD(100) * (5 - Math.min(this.state.data.length, 5));
    }
    return stylez;
  }

  _calcPosition() {
    const { data } = this.state;
    let dropdownStyle = { maxHeight: HEIGHTXD(100 * Math.min(data.length, 5)) + (6 - Math.min(data.length, 5)) * HEIGHTXD(105) }
    const dimensions = Dimensions.get('window');
    const windowHeight = dimensions.height;
    const dropdownHeight = dropdownStyle.maxHeight
    const bottomSpace = windowHeight - this._buttonFrame.y - this._buttonFrame.h;
    const showInBottom = bottomSpace >= dropdownHeight || bottomSpace >= this._buttonFrame.y;
    this.setState({ showInBottom })
  }

  _updatePosition() {
    if (this._button && this._button.measure) {
      this._button.measure((fx, fy, width, height, px, py) => {
        this._buttonFrame = { x: px, y: py, w: width, h: height };
        this._calcPosition()
      });
    }
  }

  _checkDisable = () => {
    let check = false
    if (this.props.enableEdit === undefined) {
      return check
    } else {
      check = !this.props.enableEdit
    }
    return check
  }

  render() {
    const { width, containerStyle, height, isFilter, label, require, value } = this.props
    const { data } = this.state
    return (
      <View style={styles.cell}>
        {label
          ? <View style={{ flexDirection: 'row', backgroundColor: 'null' }}>
            <Text style={styles.label}>{label}</Text>
            {require ? <Text style={styles.require}>*</Text> : null}
          </View>
          : null}
        <TouchableOpacity
          disabled={this._checkDisable()}
          ref={button => { this._button = button }}
          onPress={() => { this._dropdown.show(); this._updatePosition() }}
          style={[styles.pickerStyle, containerStyle && containerStyle, height && { height }, width && { width }]}
        >
          <Text numberOfLines={1} style={[styles.dropdown_row_text, width && { width: width - WIDTHXD(125), marginLeft: WIDTHXD(-4) }]}>
            {this.state.value}
          </Text>
          <Image
            resizeMode="contain"
            source={isFilter ? R.images.iconDropdown : R.images.iconDown}
            style={{
              width: WIDTHXD(35),
              height: WIDTHXD(18),
            }}
          />
        </TouchableOpacity>
        <ModalDropdown
          showsVerticalScrollIndicator={true}
          ref={el => { this._dropdown = el }}
          style={[styles.dropdown, width && { width }]}
          defaultValue=""
          // defaultIndex={this._defaulIndex(data, value)}
          textStyle={styles.dropdown_text}
          dropdownStyle={[styles.dropdown_dropdown, { maxHeight: HEIGHTXD(100 * Math.min(data.length, 5) + 12) }, width && { width }]}
          options={this.state.data}
          onSelect={(index, valueItem) => {
            this.props.onValueChange(index, valueItem)
            this.setState({ value: valueItem.name })
          }
          }
          renderButtonText={(rowData) => this.renderButtonText(rowData)}
          renderRow={this.renderRow}
          adjustFrame={style => this._dropdownAdjustFrame(style)}
          renderSeparator={() => (<View style={{ width: '100%', height: 0.5, backgroundColor: '#e3e8f2' }} />)}
        />
      </View>
    );
  }

  renderButtonText = () => ' '

  _renderSeparator = (sectionId, index, adjacentRowHighlighted) => {
    return null
  }

  renderRow = (rowData, rowID, highlighted) => {
    const { width, heightItem } = this.props
    const { data } = this.state
    let evenRow = (rowID === (data && (data.length - 1)));
    return (
      <TouchableHighlight underlayColor="cornflowerblue">
        <View style={[styles.dropdown_row,
        heightItem && { height: heightItem },
        highlighted && { backgroundColor: '#e3e8f2' },
        evenRow && { borderBottomLeftRadius: WIDTHXD(20), borderBottomRightRadius: WIDTHXD(20) },
        width && { width }]}
        >
          <Text numberOfLines={1} style={[styles.dropdown_row_text]}>
            {`${rowData.name}`}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }

  renderSeparator = (rowID) => {
    if (rowID === this.state.data.length - 1) return [];
    let key = `spr_${rowID}`;
    return (<View
      style={styles.dropdown_separator}
      key={key}
    />);
  }
}

const styles = StyleSheet.create({
  cell: {
    flex: 0
  },
  require: {
    color: 'red',
    fontSize: getFontXD(36),
    marginLeft: WIDTHXD(12)
  },
  label: {
    fontSize: getFontXD(36),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.color777,
    marginBottom: HEIGHTXD(8)
  },
  dropdown: {
    alignSelf: 'center',
    width: WIDTHXD(960),
    height: HEIGHTXD(0),
  },
  dropdown_text: {
    fontFamily: R.fonts.RobotoRegular,
    fontSize: getFontXD(42),
  },
  dropdown_dropdown: {
    width: WIDTHXD(960),
    maxHeight: HEIGHTXD(200),
    borderBottomLeftRadius: WIDTHXD(20),
    borderBottomRightRadius: WIDTHXD(20),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
  dropdown_row: {
    flexDirection: 'row',
    height: HEIGHTXD(100),
    alignItems: 'center',
    paddingLeft: WIDTHXD(12)
  },
  dropdown_row_text: {
    marginHorizontal: 4,
    fontFamily: R.fonts.RobotoRegular,
    fontSize: getFontXD(42),
    textAlignVertical: 'center',
  },
  dropdown_separator: {
    borderBottomWidth: 0.3,
    borderBottomColor: R.colors.iconGray,
  },
  pickerStyle: {
    width: WIDTHXD(960),
    height: HEIGHTXD(100),
    flexDirection: 'row',
    paddingHorizontal: WIDTHXD(30),
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 0.3,
    borderColor: R.colors.iconGray,
    borderRadius: WIDTHXD(20),
    marginTop: HEIGHTXD(10),
  }
});
