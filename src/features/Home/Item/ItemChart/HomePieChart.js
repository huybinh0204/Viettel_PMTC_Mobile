import React, { Component } from 'react';
import { View, processColor, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { PieChart } from 'react-native-charts-wrapper';
import moment from 'moment';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import PickerItem from '../../../../common/Picker/PickerItem';
import { WIDTH, getWidth, WIDTHXD, getFontXD, getLineHeightXD, HEIGHTXD, NetworkSetting, numberWithCommas } from '../../../../config';
import R from '../../../../assets/R';
import { PostData } from '../../../../apis/helpers';
import AsyncStorage from '@react-native-community/async-storage';
import { QUARTER_NAME } from './ListChartCustom';
import { onPressFilter } from './HomeBarChart';
import { connect } from 'react-redux';


const legendToTrinh = [
  {
    label: 'Đã duyệt',
    number: '0',
    price: '0',
    color: R.colors.colorMain,
    key: {
      screen: 'TO_TRINH',
      filter: {
        approveStatus: '1'
      }
    },
  },
  {
    label: 'Chưa duyệt',
    number: '0',
    price: '0',
    color: '#F39C12',
    key: {
      screen: 'TO_TRINH',
      filter: {
        approveStatus: '0'
      }
    },
  },
  {
    label: 'Từ chối',
    number: '0',
    price: '0',
    color: '#A60014',
    key: {
      screen: 'TO_TRINH',
      filter: {
        approveStatus: '2'
      }
    },
  },
];

class HomePieChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: true,
      legend: {
        enabled: false,
      },
      data: this.props.data,
      highlights: [{ x: 0 }],
      description: {
        text: '',
      },
      quy: QUARTER_NAME[moment().quarter() - 1],
      loai: 'Số lượng',
      legendToTrinh,
      total: 0,
      quarterType: moment().quarter(),
    };
  }

  componentDidMount() {
    this.fetch();
    AsyncStorage.getItem('dashboard_1000471').then(data => {
      // console.log('data', data)
      if (data) this.setState({ ...JSON.parse(data) });
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.userData.loggedIn.adOrgId !== this.props.userData.loggedIn.adOrgId) {
      this.fetch();
    }
  }


  fetch = async () => {
    try {
      const url = `${NetworkSetting.ROOT}/erp-service-mobile/dashboardReportRsServiceRest/dashboardReport/reportTable/1000471/`;
      const dataBody = {
        "orgId": this.props.userData.loggedIn.adOrgId,
        "quarterType": this.state.quarterType,
      }
      const response = await PostData(url, dataBody);
      const valuesTT = [
        { value: response.data.cntApproved, label: 'Da duyet' },
        { value: response.data.cntWaitApprove, label: 'Chua duyet' },
        { value: response.data.cntApprovedDenied, label: 'Tu choi' }
      ]

      const dataTT = {
        dataSets: [{
          values: valuesTT,
          label: '',
          config: {
            colors: [processColor(R.colors.colorMain), processColor('#F39C12'), processColor('#A60014')],
            drawValues: false,
            sliceSpace: 3,
            selectionShift: 10,
          }
        }],
      }

      const legendToTrinh = [
        {
          label: 'Đã duyệt',
          number: response.data.cntApproved,
          price: response.data.amtApproved,
          color: R.colors.colorMain,
          key: {
            screen: 'TO_TRINH',
            filter: {
              approveStatus: '1',
              quarter: this.state.quarterType
            }
          },
        },
        {
          label: 'Chưa duyệt',
          number: response.data.cntWaitApprove,
          price: response.data.amtWaitApprove,
          color: '#F39C12',
          key: {
            screen: 'TO_TRINH',
            filter: {
              approveStatus: '0',
              quarter: this.state.quarterType
            }
          },
        },
        {
          label: 'Từ chối',
          number: response.data.cntApprovedDenied,
          price: response.data.amtApprovedDenied,
          color: '#A60014',
          key: {
            screen: 'TO_TRINH',
            filter: {
              approveStatus: '2',
              quarter: this.state.quarterType
            }
          },
        },
      ];

      const total = response.data.cntApproved + response.data.cntWaitApprove + response.data.cntApprovedDenied;
      // console.log(response)
      this.setState({ data: dataTT, legendToTrinh, total, quy: QUARTER_NAME[this.state.quarterType - 1] }, () => {
        AsyncStorage.setItem('dashboard_1000471', JSON.stringify(this.state));
      });
    } catch (error) {
      console.log('fetch bar chart data error', error);
    }
  }

  render() {
    const { legendToTrinh } = this.state;
    // console.log(JSON.stringify(this.state.data))
    let unit = 'Triệu';
    let unitNumber = 1000000;
    if (this.state.total >= 1000000000) {
      unit = 'Tỉ';
      unitNumber = 1000000000;
    } else if (this.state.total >= 1000000) {
      unit = 'Triệu';
      unitNumber = 1000000;
    } else {
      unit = ' VND';
      unitNumber = 1;
    }

    let textCenter = this.state.mode ? `${this.state.total}` : `${numberWithCommas(Math.round(this.state.total / unitNumber, 1))}`;
    let enableUnit = !this.state.mode

    // console.log(this.state.quy)
    return (
      <View style={{ ...styles.container }}>
        <View style={styles.header}>
          <Text style={styles.textTitle} numberOfLines={1}>{this.props.title}</Text>
          <PickerItem
            data={[{ name: 'Quý I' }, { name: 'Quý II' }, { name: 'Quý III' }, { name: 'Quý IV' }]}
            defaultValue={this.state.quy}
            width={WIDTHXD(260)}
            height={HEIGHTXD(66)}
            textStyle={{ textAlign: 'right', color: '#042C5C', fontSize: getFontXD(R.fontsize.lableFieldTextSize), width: WIDTHXD(230), textAlign: 'right', paddingRight: WIDTHXD(20) }}
            iconDropdown={R.images.drop}
            iconDropdownStyle={{ width: WIDTHXD(30), height: HEIGHTXD(30) }}
            containerStyle={{ borderWidth: 0, paddingHorizontal: 0, justifyContent: 'flex-end' }}
            onValueChange={(index, item) => {
              this.setState({ quy: item.name, quarterType: parseInt(index, 10) + 1 }, () => {
                this.fetch();
              })
            }}

          />
          <PickerItem
            defaultValue={this.state.loai}
            data={[{ name: 'Số lượng', value: '1' }, { name: 'Số tiền', value: '2' }]}
            width={WIDTHXD(270)}
            height={HEIGHTXD(66)}
            iconDropdown={R.images.drop}
            iconDropdownStyle={{ width: WIDTHXD(30), height: HEIGHTXD(30) }}
            containerStyle={{ borderWidth: 0, paddingHorizontal: 0, justifyContent: 'flex-end' }}
            textStyle={{ textAlign: 'right', color: '#042C5C', fontSize: getFontXD(R.fontsize.lableFieldTextSize), width: WIDTHXD(240), textAlign: 'right', paddingRight: WIDTHXD(20) }}
            onValueChange={(index, item) => {
              this.setState({ mode: item.name !== this.state.loai ? !this.state.mode : this.state.mode, loai: item.name }, () => {
                let data = this.state.data;
                let mode = this.state.mode;

                data.dataSets.values = [
                  { value: (mode ? legendToTrinh[0].number : legendToTrinh[0].price), label: 'Da duyet' },
                  { value: (mode ? legendToTrinh[1].number : legendToTrinh[1].price), label: 'Chua duyet' },
                  { value: (mode ? legendToTrinh[2].number : legendToTrinh[2].price), label: 'Tu choi' }
                ];

                let total = legendToTrinh[0].number + legendToTrinh[1].number + legendToTrinh[2].number;
                if (!mode) {
                  total = legendToTrinh[0].price + legendToTrinh[1].price + legendToTrinh[2].price
                }
                this.setState({ data: { ...data }, total });
              })
            }}
          />
        </View>
        <View style={{ ...styles.containerChart, width: WIDTHXD(1035), flexDirection: 'row', justifyContent: 'space-between', height: HEIGHTXD(750) }}>
          <TouchableOpacity
            style={{ ...styles.iconCirle, marginLeft: WIDTHXD(28) }}
            onPress={() => this.props.onPress(true)}
          >
            <Icon name="left" size={WIDTHXD(31)} />
          </TouchableOpacity>
          <PieChart
            style={styles.chart}
            logEnabled={false}
            data={this.state.data}
            legend={this.state.legend}
            drawEntryLabels={false}
            rotationEnabled={true}
            // styledCenterText={{ text: textCenter, color: processColor('#232425'), size: getFontXD(69), fontFamily: R.fonts.RobotoRegular }}
            holeRadius={66}
            holeColor={processColor('#fff')}
            chartDescription={this.state.description}
            // highlights={this.state.highlights}
            // rotationAngle={45}
            centerTextRadiusPercent={100}
            highlightPerTapEnabled={false}
            maxAngle={360}
          />
          <Text style={{
            position: 'absolute',
            alignSelf: 'center',
            width: '100%',
            color: '#232425',
            fontSize: getFontXD(69),
            fontFamily: R.fonts.RobotoRegular,
            textAlign: 'center'
          }}>{textCenter}{enableUnit && (<Text style={{ fontSize: getFontXD(30) }}>{'\n' + unit}</Text>)}</Text>
          <TouchableOpacity
            style={{ ...styles.iconCirle, marginRight: WIDTHXD(28) }}
            onPress={() => this.props.onPress(false)}
          >
            <Icon name="right" size={WIDTHXD(31)} />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center'}}>
          {
            legendToTrinh.map((item, index) => {
              let numberBot = numberWithCommas(item.number);
              let enableUnit = false;
              let unit = ' VND';
              let unitNumber = 1;

              if (item.price >= 1000000000) {
                unit = 'Tỉ';
                unitNumber = 1000000000;
              } else if (item.price >= 1000000) {
                unit = 'Triệu';
                unitNumber = 1000000;
              }

              if (!this.state.mode) {
                numberBot = item.price > 999999 ? `${numberWithCommas(Math.round(item.price / unitNumber, 1))} ` : numberWithCommas(item.price)
                enableUnit = true;
              }

              return (
                <TouchableOpacity
                  onPress={() => onPressFilter(item.key)}
                  key={index.toString()}
                  style={[styles.renderBox, { borderRightWidth: (index === legendToTrinh.length - 1) ? 0 : 1 }]}>
                  <Text style={styles.number}>{numberBot}{enableUnit && (<Text style={{ fontSize: getFontXD(30) }}>{unit}</Text>)}</Text>
                  <Text style={styles.legendText}>{item.label}</Text>
                  <View style={[styles.legendBox, { backgroundColor: item.color, }]} />
                </TouchableOpacity>
              )
            })
          }
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    userData: state.userReducers.userData,
  }
}
export default connect(mapStateToProps, {})(HomePieChart);

const styles = StyleSheet.create({

  containerChart: {
    flexDirection: 'row',
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
    height: HEIGHTXD(1125),
  },
  chart: {
    
    width: WIDTHXD(550),
  },
  textTitle: {
    fontSize: getFontXD(48),
    //  lineHeight: getLineHeightXD(56),
    fontFamily: R.fonts.RobotoMedium,
    opacity: 1,
    marginLeft: WIDTHXD(50),
    flex: 1,
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
    width: WIDTHXD(1035 / 3),
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
    marginTop: HEIGHTXD(13)
  },
  number: {
    color: R.colors.indigoA701,
    fontSize: getFontXD(48),
    lineHeight: getLineHeightXD(58),
    fontFamily: R.fonts.RobotoMedium,
    opacity: 1,
  },
  legendText: {
    marginLeft: WIDTHXD(15),
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
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
