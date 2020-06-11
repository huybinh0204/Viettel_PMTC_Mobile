import React, { Component } from 'react';
import { View, processColor, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { PieChart } from 'react-native-charts-wrapper';
import { Picker } from 'native-base'
import Icon from 'react-native-vector-icons/dist/AntDesign';
import { WIDTH, HEIGHT, getWidth, getFontXD, HEIGHTXD, WIDTHXD, getLineHeightXD } from '../../../../config';
import R from '../../../../assets/R';

const legendToTrinh = [
  {
    label: 'Đã duyệt',
    number: '12',
    price: '12.000.000',
    color: R.colors.colorMain
  },
  {
    label: 'Chưa duyệt',
    number: '12',
    price: '4.000.000',
    color: '#F39C12'
  },
  {
    label: 'Từ chối',
    number: '08',
    price: '4.000.000',
    color: '#504A4B'
  },
];
export default class HalfPieChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      legend: {
        enabled: false,
      },
      data: this.props.data,
      description: {
        text: '',
      },
      quy: 1,
      loai: '',
      language: ''
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.textTitle}>{this.props.title}</Text>
          <Picker
            selectedValue={this.state.language}
            style={{ height: HEIGHTXD(66), width: WIDTHXD(300) }}
            onValueChange={(itemValue) => this.setState({ quy: itemValue })
            }
            mode="dropdown"
          >
            <Picker.Item label="Quý I" value="1" />
            <Picker.Item label="Quý II" value="2" />
            <Picker.Item label="Quý III" value="3" />
            <Picker.Item label="Quý IV" value="4" />
          </Picker>
          <Picker
            selectedValue={this.state.language}
            style={{ height: HEIGHTXD(66), width: WIDTHXD(300) }}
            onValueChange={(itemValue) => this.setState({ loai: itemValue })}
            mode="dropdown"
          >
            <Picker.Item label="Số tờ trình" value="soToTrinh" />
          </Picker>
        </View>
        <View style={styles.containerChart}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity
              style={styles.iconCirle}
              onPress={this.props.onPress}
            >
              <Icon name="left" size={WIDTHXD(31)} />
            </TouchableOpacity>
          </View>
          <PieChart
            style={styles.chart}
            logEnabled={true}
            data={this.state.data}
            legend={this.state.legend}
            drawEntryLabels={false}
            rotationEnabled={false}
            styledCenterText={{ text: this.props.total, color: processColor('#232425'), size: getFontXD(69), fontFamily: R.fonts.RobotoRegular }}
            holeRadius={70}
            holeColor={processColor('#fff')}
            transparentCircleRadius={0}
            chartDescription={this.state.description}
            centerTextRadiusPercent={100}
            maxAngle={180}
            rotationAngle={180}
          />
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity
              style={styles.iconCirle}
              onPress={this.props.onPress}
            >
              <Icon name="right" size={WIDTHXD(31)} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.line} />
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: HEIGHTXD(69) }}>
          {
            legendToTrinh.map((
              item, index
            ) => (
                <View key={index.toString()} style={[styles.renderBox, { borderRightWidth: (index === legendToTrinh.length - 1) ? 0 : 1 }]}>
                  <Text style={styles.number}>{(this.props.mode === true) ? item.number : item.price}</Text>
                  <View style={{ flexDirection: 'row', paddingHorizontal: WIDTHXD(10), alignItems: 'center' }}>
                    <View style={[styles.legendBox, { backgroundColor: item.color, marginRight: WIDTHXD(17) }]} />
                    <Text style={styles.legendText}>{item.label}</Text>
                  </View>
                </View>
              ))
          }
        </View>
        <View style={styles.viewHachToan}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.legendText}>Đã hoạch toán</Text>
            <Text style={[styles.number, { paddingHorizontal: WIDTHXD(10) }]}>20</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.legendText}>Chưa hoạch toán</Text>
            <Text style={[styles.number, { paddingHorizontal: WIDTHXD(10) }]}>05</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: WIDTHXD(1007),
    borderRadius: WIDTHXD(36),
    alignSelf: 'center',
    shadowColor: '#00000014',
    shadowOffset: { width: 2, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,

  },
  chart: {
    height: HEIGHTXD(500),
    width: getWidth() * 0.8 - 2 * WIDTH(30),
    marginTop: HEIGHTXD(96),
  },
  textTitle: {
    fontSize: getFontXD(54),
    fontFamily: R.fonts.RobotoMedium,
    opacity: 1,
    marginLeft: WIDTHXD(50)
  },
  itemPicker: {
    color: '#042C5C',
    marginRight: WIDTHXD(40),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: HEIGHTXD(47),
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
  },
  legendText: {
    color: R.colors.black0,
    fontSize: getFontXD(36),
    lineHeight: getLineHeightXD(44),
    fontFamily: R.fonts.RobotoRegular,
    opacity: 0.75,
  },
  iconCirle: {
    width: WIDTHXD(80),
    height: WIDTHXD(80),
    borderRadius: WIDTHXD(40),
    marginLeft: WIDTHXD(44),
    shadowColor: '#111C6026',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 0.5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  containerChart: {
    flexDirection: 'row',
  },
  line: {
    height: HEIGHT(1),
    width: WIDTHXD(800),
    backgroundColor: R.colors.black0,
    opacity: 0.7,
    marginTop: -HEIGHTXD(100),
    marginLeft: WIDTHXD(100)
  },
  viewHachToan: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: HEIGHTXD(99),
    paddingHorizontal: WIDTHXD(50),
    width: WIDTHXD(1007),
    marginTop: HEIGHTXD(20)
  },
});
