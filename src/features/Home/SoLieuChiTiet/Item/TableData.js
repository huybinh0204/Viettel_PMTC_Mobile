import React, { Component } from 'react';
import { View, processColor, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto'
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import PickerItem from '../../../../common/Picker/PickerItem';
import { WIDTH, getWidth, WIDTHXD, getFontXD, getLineHeightXD, HEIGHTXD } from '../../../../config';
import R from '../../../../assets/R';
import moment from 'moment';


export default class TableData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      indexShowColum: 2,
      legend: {
        enabled: false,
      },
      marker: {
        enabled: false,
      },
    };
  }

  render() {
    const heightArr = [HEIGHTXD(100), HEIGHTXD(100), HEIGHTXD(100), HEIGHTXD(100)];
    const { dataTable } = this.props
    const dataTotal = dataTable[3]
    const maxLen = Math.max(dataTotal[0].length, dataTotal[1].length, dataTotal[2].length);
    const fontSize = maxLen > 11 ? (11 / maxLen * getFontXD(37)) : getFontXD(37);
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.textTitle}>{this.props.title}</Text>
          <PickerItem
            data={[{ name: '2020' }, { name: '2019' }]}
            width={WIDTHXD(260)}
            defaultValue={moment().year()}
            height={HEIGHTXD(66)}
            iconDropdown={R.images.drop}
            iconDropdownStyle={{ width: WIDTHXD(30), height: HEIGHTXD(30) }}
            containerStyle={{ borderWidth: 0 }}
            onValueChange={this.props.onValueChange}
          />
        </View>
        <View style={{ paddingHorizontal: WIDTHXD(45), marginTop: HEIGHTXD(65), }}>
          <Table borderStyle={{ borderWidth: 0.5, borderColor: '#C1C1C1', }}>
            <Row data={['', 'Ngân sách', 'Đã chi', 'Còn lại']} flexArr={[165, 258, 258, 258]} style={styles.head} textStyle={styles.rowTittle} />
            <TableWrapper style={styles.wrapper}>
              <Col data={['Quý I', 'Quý II', 'Quý III', 'Quý IV']} textStyle={styles.text} style={{ flex: 165 }} heightArr={heightArr} />
              <Col data={dataTable[0]} textStyle={[styles.text, { color: R.colors.black0, fontSize }]} style={{ flex: 258 }} heightArr={heightArr} />
              <Col data={dataTable[1]} textStyle={[styles.text, { color: R.colors.colorMain, fontSize }]} style={{ flex: 258 }} heightArr={heightArr} />
              <Col data={dataTable[2]} textStyle={[styles.text, { color: '#FF9C00', fontSize }]} style={{ flex: 258 }} heightArr={heightArr} />
            </TableWrapper>
            <TableWrapper style={styles.wrapper}>
              <Col data={['Tổng']} textStyle={styles.text} style={{ flex: 165, backgroundColor: R.colors.borderD4 }} heightArr={heightArr} />
              <Col data={[dataTotal[0]]} textStyle={[styles.text, { color: R.colors.black0, fontFamily: R.fonts.RobotoBold, fontSize }]} style={{ flex: 258, backgroundColor: R.colors.borderD4 }} heightArr={heightArr} />
              <Col data={[dataTotal[1]]} textStyle={[styles.text, { color: R.colors.colorMain, fontFamily: R.fonts.RobotoBold, fontSize }]} style={{ flex: 258, backgroundColor: R.colors.borderD4 }} heightArr={heightArr} />
              <Col data={[dataTotal[2]]} textStyle={[styles.text, { color: '#FF9C00', fontFamily: R.fonts.RobotoBold, fontSize }]} style={{ flex: 258, backgroundColor: R.colors.borderD4 }} heightArr={heightArr} />
            </TableWrapper>

          </Table>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  head: { height: HEIGHTXD(100), backgroundColor: '#fff' },
  rowTittle: { textAlign: 'center', fontSize: getFontXD(37), fontFamily: R.fonts.RobotoBold },
  wrapper: { flexDirection: 'row' },
  text: { textAlign: 'center', fontSize: getFontXD(37), fontFamily: R.fonts.RobotoRegular },
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
    paddingBottom: HEIGHTXD(45)
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: HEIGHTXD(47),
    paddingHorizontal: WIDTHXD(35),
  },
  textTitle: {
    fontFamily: R.fonts.RobotoMedium,
    fontSize: getFontXD(54)
  }
});
