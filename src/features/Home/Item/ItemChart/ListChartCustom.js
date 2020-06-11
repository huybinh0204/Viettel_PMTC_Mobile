import React, { Component } from 'react';
import { View, processColor, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import { FlatList } from 'react-native-gesture-handler';
import Fontisto from 'react-native-vector-icons/Fontisto'
import PickerItem from '../../../../common/Picker/PickerItem';
import { WIDTH, getWidth, WIDTHXD, getFontXD, getLineHeightXD, HEIGHTXD, numberWithCommas } from '../../../../config';
import R from '../../../../assets/R';
import moment from 'moment';

export const QUARTER_NAME = ['Quý I', 'Quý II', 'Quý III', 'Quý IV'];
const UNIT_NAME = ['Số lượng', 'Số tiền'];


// convert money number form dong to trieu
const value = (valueNumber, isNumber) => {
  if (isNumber) return valueNumber;
  return numberWithCommas(Math.round(valueNumber / 1000000));
}


export default class ListChartCustom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultQuarterName: QUARTER_NAME[moment().quarter() - 1],
      defaultUnnitName: UNIT_NAME[0],
    }
  }

  componentDidMount() {
    this.setState({
      defaultQuarterName: QUARTER_NAME[this.props.quarter - 1],
      defaultUnnitName: UNIT_NAME[this.props.unit ? 0 : 1],
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.quarter !== prevProps.quarter) {
      this.setState({
        defaultQuarterName: QUARTER_NAME[this.props.quarter - 1],
      })
    }
    if (this.props.unit !== prevProps.unit) {
      this.setState({
        defaultUnnitName: UNIT_NAME[this.props.unit ? 0 : 1],
      })
    }
  }

  _getTittle = (index, key) => {
    let dataTittle = {
      title: ['TT Duyệt', 'Trình ký', 'TT ký', 'TT chi'],
      ttDuyet1: ['Đã duyệt', 'Đã trình', 'Ban hành', 'Đã chi đủ'],
      ttDuyet2: ['Chưa duyệt', 'Chưa trình', 'Chưa ban hành', 'Chưa chi đủ'],
      ttDuyet3: ['Từ chối', 'Chưa trình', 'Từ chối', 'Chưa chi'],
    }
    return dataTittle[key][index]
  }

  _renderItem = ({ item, index }) => {
    let width = WIDTHXD(810.45 / 4)
    let height = HEIGHTXD(783.53)
    return (
      <View style={{ width: index === 3 ? width + WIDTHXD(28.125) : width, height: HEIGHTXD(780), paddingRight: index === 3 ? WIDTHXD(28.125) : 0 }}>
        <View style={[
          { backgroundColor: '#1B57C4', alignItems: 'center', height: HEIGHTXD(88), flexDirection: 'row' },
          { width: index === 3 ? width + WIDTHXD(28.125) : width + 1, },
          index === 0 && { borderTopLeftRadius: WIDTHXD(18), borderBottomLeftRadius: WIDTHXD(18), borderColor: R.colors.colorMain, },
        ]}
        >
          {index === 3 && <View style={styles.triangle} />}
          {index !== 0 && <Image style={{ height: HEIGHTXD(88), width: WIDTHXD(45), }} resizeMode="contain" source={R.images.arrowR} />}
          <Text style={styles.title}>{this._getTittle(index, 'title')}</Text>
          {index === 3 && <View style={{ width: WIDTHXD(30.125), marginLeft: -WIDTHXD(30.125), height: HEIGHTXD(88), backgroundColor: 'white' }} />}
        </View>
        <View style={{ height: HEIGHTXD(12) }} />
        {item.data1 > 0 && (
          <TouchableOpacity style={[
            styles.borderCol,
            { height: item.data1 / this.props.total * height, }
          ]}
            onPress={() => this.props.onPressFilter(index, 0)}
          >
            <View style={[
              { width: WIDTHXD(15), minHeight: HEIGHTXD(120) },
              { height: item.data1 / this.props.total * height, backgroundColor: R.colors.colorMain }
            ]}
            />
            <View style={{ flex: 1, alignItems: 'center', }}>
              <Text style={[styles.label, { marginTop: HEIGHTXD(9) }]}>{this._getTittle(index, 'ttDuyet1')}</Text>
              <Text style={{ ...styles.data, fontSize: getFontXD(this.props.unit ? 41 : 25) }}>{value(item.data1, this.props.unit)}</Text>
            </View>
          </TouchableOpacity>
        )}
        {item.data2 > 0 && (
          <TouchableOpacity style={[
            styles.borderCol,
            { height: item.data2 / this.props.total * height, }
          ]}
            onPress={() => this.props.onPressFilter(index, 1)}
          >
            <View style={[
              { width: WIDTHXD(15), minHeight: HEIGHTXD(120) },
              { height: item.data2 / this.props.total * height, backgroundColor: '#FF9C00' }
            ]}
            />
            <View style={{ flex: 1, alignItems: 'center', }}>
              <Text style={[styles.label, { marginTop: HEIGHTXD(9) }]}>{this._getTittle(index, 'ttDuyet2')}</Text>
              <Text style={{ ...styles.data, fontSize: getFontXD(this.props.unit ? 41 : 25) }}>{value(item.data2, this.props.unit)}</Text>
            </View>
          </TouchableOpacity>
        )}
        {item.data3 > 0 && (
          <TouchableOpacity style={[
            styles.borderCol,
            { height: item.data3 / this.props.total * height, }
          ]}
            onPress={() => this.props.onPressFilter(index, 2)}
          >
            <View style={[
              { width: WIDTHXD(15), minHeight: HEIGHTXD(120) },
              { height: item.data3 / this.props.total * height, backgroundColor: R.colors.colorTuChoi }
            ]}
            />
            <View style={{ flex: 1, alignItems: 'center', }}>
              <Text style={[styles.label, { marginTop: HEIGHTXD(9) }]}>{this._getTittle(index, 'ttDuyet3')}</Text>
              <Text style={{ ...styles.data, fontSize: getFontXD(this.props.unit ? 41 : 25) }}>{value(item.data3, this.props.unit)}</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container} key={this.props.key}>
        <View style={styles.header}>
          <Text style={styles.textTitle} numberOfLines={1}>{this.props.title}</Text>
          <PickerItem
            defaultValue={this.state.defaultQuarterName}
            data={[{ name: 'Quý I' }, { name: 'Quý II' }, { name: 'Quý III' }, { name: 'Quý IV' }]}
            width={WIDTHXD(190)}
            height={HEIGHTXD(66)}
            iconDropdown={R.images.drop}
            textStyle={{ color: '#042C5C', fontSize: getFontXD(R.fontsize.lableFieldTextSize), width: WIDTHXD(170), textAlign: 'right', paddingRight: WIDTHXD(20) }}
            containerStyle={{ borderWidth: 0, paddingHorizontal: 0, justifyContent: 'flex-end' }}
            iconDropdownStyle={{ width: WIDTHXD(30), height: HEIGHTXD(30) }}
            onValueChange={(index, item) => {
              this.props.onFilterChange && this.props.onFilterChange(parseInt(index) + 1, this.props.unit);
            }}

          />
          <PickerItem
            defaultValue={this.state.defaultUnnitName}
            data={[{ name: 'Số lượng' }, { name: 'Số tiền' }]}
            width={WIDTHXD(270)}
            height={HEIGHTXD(66)}
            textStyle={{ color: '#042C5C', fontSize: getFontXD(R.fontsize.lableFieldTextSize), width: WIDTHXD(240), textAlign: 'right', paddingRight: WIDTHXD(20) }}
            containerStyle={{ borderWidth: 0, paddingHorizontal: 0, justifyContent: 'flex-end' }}
            iconDropdown={R.images.drop}
            iconDropdownStyle={{ width: WIDTHXD(30), height: HEIGHTXD(30) }}
            onValueChange={(index, item) => {
              this.props.onFilterChange && this.props.onFilterChange(this.props.quarter, parseInt(index) === 0)
            }}

          />
        </View>
        <View style={styles.containerChart}>
          <View style={{ height: HEIGHTXD(750), justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity
              style={{ ...styles.iconCirle, marginLeft: WIDTHXD(28) }}
              onPress={() => this.props.onPress(true)}
            >
              <Icon name="left" size={WIDTHXD(31)} />
            </TouchableOpacity>
          </View>

          <FlatList
            style={styles.chart}
            data={this.props.data}
            horizontal={true}
            scrollEnabled={false}
            renderItem={this._renderItem}
          />

          <View style={{ height: HEIGHTXD(750), justifyContent: 'center', alignItems: 'center', position: 'absolute', right: WIDTHXD(0), }}>
            <TouchableOpacity
              style={{ ...styles.iconCirle, marginRight: WIDTHXD(28) }}
              onPress={() => this.props.onPress(false)}
            >
              <Icon name="right" size={WIDTHXD(31)} />
            </TouchableOpacity>
          </View>

        </View>
        <View style={{ width: WIDTHXD(1035), height: HEIGHTXD(46), alignItems: 'flex-end', marginTop: HEIGHTXD(24), paddingHorizontal: WIDTHXD(81) }}>
          {!this.state.mode && <Text style={{ fontFamily: R.fonts.RobotoRegular, fontSize: getFontXD(R.fontsize.lableFieldTextSize) }}>Đơn vị: triệu VNĐ</Text>}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  borderCol: {
    minHeight: HEIGHTXD(120),
    borderWidth: 0.5,
    borderLeftWidth: 0,
    borderColor: '#C1C1C1',
    flexDirection: 'row',
  },
  data: {
    fontFamily: R.fonts.RobotoRegular,
    fontSize: getFontXD(21),
    lineHeight: getLineHeightXD(48)
  },
  label: {
    fontSize: getFontXD(28),
    color: R.colors.color777,
    fontFamily: R.fonts.RobotoRegular,
    lineHeight: getLineHeightXD(37)
  },
  triangle: {
    width: 0,
    height: 0,
    alignSelf: 'center',
    backgroundColor: 'transparent',
    zIndex: 1100,
    borderStyle: 'solid',
    borderLeftWidth: HEIGHTXD(44.5),
    borderRightWidth: HEIGHTXD(44.5),
    borderBottomWidth: WIDTHXD(26.75),
    borderLeftColor: R.colors.white,
    borderRightColor: R.colors.white,
    borderBottomColor: '#1B57C4',
    position: 'absolute',
    right: -WIDTHXD(25.8),
    transform: [
      { rotate: '90deg' }
    ]
  },
  containerChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: WIDTHXD(28),
  },
  container: {
    backgroundColor: 'white',
    width: WIDTHXD(1035),
    borderRadius: WIDTHXD(36),
    alignSelf: 'center',
    shadowColor: '#00000014',
    shadowOffset: { width: 2, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
    paddingBottom: HEIGHTXD(60),
    height: HEIGHTXD(1125),
  },
  chart: {
    height: HEIGHTXD(783.53),
    width: WIDTHXD(838.125),
    marginTop: HEIGHTXD(85.47),
    marginLeft: WIDTHXD(10),
  },
  textTitle: {
    fontSize: getFontXD(48),
    //  lineHeight: getLineHeightXD(56),
    fontFamily: R.fonts.RobotoMedium,
    opacity: 1,
    flex: 1,
    marginLeft: WIDTHXD(50)
  },
  title: {
    color: R.colors.white,
    fontFamily: R.fonts.RobotoRegular,
    fontSize: getFontXD(35),
    lineHeight: getLineHeightXD(44),
    marginLeft: WIDTHXD(7),
    flex: 1,
    textAlign: 'center'
  },
  itemPicker: {
    color: '#042C5C',
    marginRight: WIDTHXD(40),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    marginTop: HEIGHTXD(47),
    paddingRight: WIDTHXD(82)
  },
  renderBox: {
    width: WIDTHXD(1007 / 3),
    marginVertical: HEIGHTXD(56),
    height: HEIGHTXD(130),
    borderColor: R.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },

  legendBox: {
    width: WIDTHXD(27),
    height: WIDTHXD(27),
    borderRadius: WIDTHXD(27) / 2,
  },
  number: {
    color: R.colors.indigoA701,
    fontSize: getFontXD(48),
    lineHeight: getLineHeightXD(58),
    fontFamily: R.fonts.RobotoMedium,
    opacity: 1,
    marginLeft: WIDTHXD(50)
  },
  legendText: {
    marginLeft: WIDTHXD(15),
    marginTop: HEIGHTXD(5),
    color: R.colors.black0,
    fontSize: getFontXD(36),
    lineHeight: getLineHeightXD(44),
    fontFamily: R.fonts.RobotoRegular,
    opacity: 0.75,
  },
  iconCirle: {
    width: WIDTHXD(76),
    height: WIDTHXD(80),
    borderRadius: WIDTHXD(40),
    backgroundColor: 'white',
    shadowColor: '#111C6026',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 0.5,
    alignItems: 'center',
    justifyContent: 'center'
  },
});
