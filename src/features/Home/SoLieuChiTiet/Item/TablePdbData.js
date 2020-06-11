import React, { Component } from 'react';
import { View, processColor, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import DatePicker from 'react-native-datepicker';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import PickerItem from '../../../../common/Picker/PickerItem';
import { WIDTH, getWidth, WIDTHXD, getFontXD, getLineHeightXD, HEIGHTXD, numberWithCommas } from '../../../../config';
import R from '../../../../assets/R';

import moment from 'moment';
import { fetchPdbDashboard } from '..';

export default class TablePdbData extends Component {
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
      dateStart: `01/01/${moment().format('YYYY')}`,
      dateEnd: moment().format('DD/MM/YYYY'),
      datePickerMode: 'start',
      data: []
    };
  }

  componentDidMount() {
    this.fetch();
  }

  fetch = async () => {
    // console.log(this.props);
    const user = this.props.userData;
    const dateStart = moment(this.state.dateStart, 'DD/MM/YYYY').format('YYYY-MM-DD');
    const dateEnd = moment(this.state.dateEnd, 'DD/MM/YYYY').format('YYYY-MM-DD');

    const data = await fetchPdbDashboard(user.loggedIn.adOrgId, user.adUserId, user.name, false, dateStart, dateEnd);
    const result = data.map(x => [moment(x.dateAcct, 'DD/MM/YYYY').format('DD/MM/YY'), x.amtCrSource, x.amtDrSource, x.amtSourceRs]);

    // console.log(result);
    this.setState({ data: result });
  }

  onDateChange = (date) => {
    if (this.state.datePickerMode === 'start') {
      this.setState({ dateStart: date }, () => this.fetch());
    } else {
      this.setState({ dateEnd: date }, () => this.fetch());
    }
  }

  render() {
    const { dateStart, dateEnd, datePickerMode, data } = this.state;
    const datePickerValue = datePickerMode === 'start' ? dateStart : dateEnd;
    const datePickerTitle = datePickerMode === 'start' ? 'Ngày bắt đầu' : 'Ngày kết thúc';
    // const data = [
    //   ['05/01/20', 6000000, null, 1000000],
    //   ['04/01/20', 10000000, null, -5000000],
    //   ['03/01/20', null, 5000000, -15000000],
    //   ['02/01/20', null, 5000000, -10000000],
    //   ['01/01/20', null, 5000000, -5000000000],
    // 
    // ]

    let maxLen = 0;
    data.map((x) => x.map((y) => maxLen = y ? (y.toString().length > maxLen ? y.toString().length : maxLen) : maxLen));
    const fontSize = maxLen > 11 ? (11 / maxLen * getFontXD(36)) : getFontXD(36);
    const flexArr = [175, 276, 275, 275];
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.textTitle}>Đơn vị tiền tệ: VND</Text>
          <TouchableOpacity hitSlop={{ top: 20, bottom: 20, left: 20 }}
            onPress={() => {
              this.setState({ datePickerMode: 'start' })
              this.datePicker.onPressDate();
            }}>
            <Text style={styles.text_date}>{dateStart}</Text>
          </TouchableOpacity>
          <Text style={styles.text_date}> - </Text>
          <TouchableOpacity hitSlop={{ top: 20, bottom: 20, right: 20 }}
            onPress={() => {
              this.setState({ datePickerMode: 'end' })
              this.datePicker.onPressDate();
            }}>
            <Text style={styles.text_date}>{dateEnd}</Text>
          </TouchableOpacity>
          <Image style={styles.image_icon}
            source={require('../../../../assets/images/general/iconFilter.png')} />
        </View>
        <View style={{ paddingHorizontal: WIDTHXD(16), marginTop: HEIGHTXD(61), }}>
          <Table borderStyle={{ borderWidth: 0.5, borderColor: '#C1C1C1', }}>
            <Row data={['Ngày', 'Phát sinh tăng', 'Phát sinh giảm', 'Số dư']} flexArr={flexArr} style={styles.head} textStyle={styles.rowTittle} />
            {data.map((row, rowIndex) => (
              <TableWrapper style={styles.wrapper} key={rowIndex}>
                {row.map((cellData, cellIndex) => (
                  <Cell key={cellIndex} data={cellIndex > 0 ? numberWithCommas(cellData) : cellData} textStyle={[styles.text, { fontSize, color: cellIndex === 3 ? ((cellData && cellData) >= 0 ? '#A60014' : '#1777F1') : '#000' }]} style={{ ...styles.cell, flex: flexArr[cellIndex] }} />
                ))}
              </TableWrapper>
            ))}
          </Table>
        </View>
        {this.renderDatePicker(datePickerValue, datePickerTitle, this.onDateChange)}
      </View>
    );
  }

  renderDatePicker = (dateDefault, placeholder, onDateChange) => {
    return (
      <DatePicker
        ref={ref => this.datePicker = ref}
        confirmBtnText="Đồng ý"
        cancelBtnText="Huỷ"
        locale="vi"
        enabled={false}
        hideText={true}
        showIcon={false}
        style={[{ paddingHorizontal: 0, borderWidth: 0, width: WIDTHXD(0) }]}
        date={dateDefault}
        mode="date"
        placeholder={placeholder}
        format="DD/MM/YYYY"// you can change format of date in date picker
        onDateChange={(date) => {
          onDateChange && onDateChange(date);
        }}
        customStyles={{
          dateInput: {
            flex: 0,
            marginLeft: WIDTHXD(0),
            borderWidth: 0,
            color: R.colors.black0
          },
          dateText: {
            ...styles.textDate,
          }
        }}
      />
    )
  }
}

const styles = StyleSheet.create({
  head: { height: HEIGHTXD(100), backgroundColor: '#fff' },
  rowTittle: { textAlign: 'center', fontSize: getFontXD(35), fontFamily: R.fonts.RobotoBold },
  wrapper: { flexDirection: 'row' },
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
    height: HEIGHTXD(110),
  },
  text: {
    textAlign: 'center',
    fontSize: getFontXD(36),
    fontFamily: R.fonts.RobotoRegular,
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
    paddingBottom: HEIGHTXD(45),
    minHeight: HEIGHTXD(1484),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: HEIGHTXD(56.6),
    paddingHorizontal: WIDTHXD(44),
  },
  textTitle: {
    fontFamily: R.fonts.RobotoMedium,
    fontSize: getFontXD(R.fontsize.lableFieldTextSize),
    color: '#232425',
    flex: 1,
  },
  text_date: {
    color: '#232425',
    fontSize: getFontXD(36),
    fontFamily: R.fonts.RobotoMedium
  },
  image_icon: {
    width: WIDTHXD(30),
    height: WIDTHXD(30),
    resizeMode: 'contain',
    marginLeft: WIDTHXD(21.4)
  },
  textDate: {
    fontFamily: R.fonts.RobotoRegular,
    fontSize: getFontXD(42),
    color: R.colors.black0,
    paddingVertical: HEIGHTXD(25),
  }
});
