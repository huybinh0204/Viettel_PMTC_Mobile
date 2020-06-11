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
import R from '../../assets/R';
import { WIDTHXD, getFontXD, HEIGHTXD, getHeight } from '../../config/Function';

const data = [
]
/**
   * This Function to show piker with list date (for example [{name:'Picker1'},{name:'Picker2}])
   * @callback onValueChange return value of item you choice
   * @param value value of picker you choice
   * @param defaultIndex defaultIndex of picker you choice
   * @param containerStyle custom containerStyle of view
   * @param data data value of date
   * @param width width of picker
   * @param height height of picker
   * @param date value of date you choice
   * @param heightItem height of picker Item
   * @param maxHeight set height of list
   * @param iconDropdown to set icon for dropdown
   * @param iconDropdownStyle to style icon dropdown
   * other you can make minDate,maxDate... with props of libary react-native-datepicker
   */
export default class PickerItem extends Component {
  constructor(props) {
    super(props);
    this._button = null;
    this._buttonFrame = null;
    this.state = {
      value: '',
      showInBottom: true
    };
  }

  componentDidMount() {
    this._dropdown.select(0)
  }

  _dropdownAdjustFrame = (style) => {
    const { showInBottom } = this.state
    let stylez = style
    if (!showInBottom) {
      stylez.top += HEIGHTXD(99) * (6 - Math.min(this.props.data.length, 5));
    } else {
      stylez.top += HEIGHTXD(99);
    }
    // stylez.left += 150;
    return stylez;
  }

  _calcPosition() {
    const { data } = this.props;
    let dropdownStyle = { maxHeight: HEIGHTXD(99 * Math.min(data.length, 5)) + (6 - Math.min(data.length, 5)) * HEIGHTXD(105) }
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

  render() {
    const { width, onValueChange, containerStyle, height, value, defaultValue, data, defaultIndex, iconDropdown, iconDropdownStyle, disabled, isTriangle, textStyle } = this.props
    return (
      <View style={styles.cell}>
        <TouchableOpacity
          disabled={disabled}
          ref={button => { this._button = button }}
          onPress={() => { this._dropdown.show(); this._updatePosition() }}
          style={[styles.pickerStyle, containerStyle && containerStyle, height && { height }, width && { width }]}
        >
          <Text numberOfLines={1} style={[styles.dropdown_row_text, width && { width: width - WIDTHXD(125) }, textStyle ? textStyle : {}]}>
            {defaultValue || this.state.value}
          </Text>
          <Image
            resizeMode="contain"
            source={iconDropdown || isTriangle ? R.images.iconDropdown : R.images.iconDown}
            style={iconDropdownStyle || { width: WIDTHXD(35), height: WIDTHXD(18), }}
          />
        </TouchableOpacity>
        <ModalDropdown
          showsVerticalScrollIndicator={false}
          ref={el => { this._dropdown = el }}
          style={[styles.dropdown, width && { width }]}
          defaultValue={defaultValue || '0'}
          defaultIndex={defaultIndex || 0}
          textStyle={styles.dropdown_text}
          dropdownStyle={[styles.dropdown_dropdown, { maxHeight: HEIGHTXD(99 * Math.min(data.length, 5) + 12) }, width && { width }]}
          options={data && data}
          onSelect={(value) => {
            onValueChange && onValueChange(value, data[value])
            this.setState({ value: data[value].name })
          }}
          renderSeparator={() => (<View style={{ width: '100%', height: 0.5, backgroundColor: '#E2E8F2' }} />)}
          renderButtonText={(rowData) => this.renderButtonText(rowData)}
          renderRow={this.renderRow}
          adjustFrame={style => this._dropdownAdjustFrame(style)}
          // renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this.renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
        />
      </View>
    );
  }

  renderButtonText = () => ' '

  renderRow = (rowData, rowID, highlighted) => {
    const { width, heightItem, data } = this.props
    let evenRow = (rowID === (data && (data.length - 1)));
    return (
      <TouchableHighlight underlayColor="cornflowerblue">
        <View style={[styles.dropdown_row,
        heightItem && { height: heightItem },
        highlighted && { backgroundColor: '#e3e8f2' },
        evenRow && { borderBottomLeftRadius: WIDTHXD(20), borderBottomRightRadius: WIDTHXD(20), overflow: 'hidden' },
        width && { width }]}
        >
          <Text numberOfLines={1} style={[styles.dropdown_row_text, { marginHorizontal: WIDTHXD(30) }]}>
            {`${rowData.name}`}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }

  renderSeparator = (rowID) => {
    if (rowID === data.length - 1) return [];
    let key = `spr_${rowID}`;
    return (<View
      style={styles.dropdown_separator}
      key={key}
    />);
  }
}

const styles = StyleSheet.create({
  cell: {
    flex: 0,
  },
  dropdown: {
    alignSelf: 'center',
    width: WIDTHXD(960),
    height: HEIGHTXD(0),
    borderBottomLeftRadius: WIDTHXD(20),
    borderBottomRightRadius: WIDTHXD(20),
    overflow: 'hidden',
  },
  dropdown_text: {
    fontFamily: R.fonts.RobotoRegular,
    fontSize: getFontXD(42),
  },
  dropdown_dropdown: {
    width: WIDTHXD(960),
    maxHeight: HEIGHTXD(200),
    marginTop: -HEIGHTXD(99),
    borderWidth: 0,
    // borderColor: R.colors.iconGray,
    // borderRadius: 3,
    borderBottomLeftRadius: WIDTHXD(20),
    borderBottomRightRadius: WIDTHXD(20),
    // paddingBottom: HEIGHTXD(10),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    overflow: 'hidden',
    elevation: 2,
  },
  dropdown_row: {
    flexDirection: 'row',
    height: HEIGHTXD(99),
    alignItems: 'center',
  },
  dropdown_row_text: {
    // marginHorizontal: 4,
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
    height: HEIGHTXD(99),
    flexDirection: 'row',
    paddingHorizontal: WIDTHXD(30),
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 0.3,
    borderColor: R.colors.iconGray,
    borderRadius: WIDTHXD(20),
    // marginTop: HEIGHTXD(10)
  }
});
