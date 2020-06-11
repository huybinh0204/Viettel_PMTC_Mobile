import React from 'react';
import { View, processColor, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import { BarChart } from 'react-native-charts-wrapper';
import { Picker } from 'native-base'
import R from '../../../../assets/R';
import { WIDTH, getWidth, WIDTHXD, getFontXD, getLineHeightXD, HEIGHTXD, NetworkSetting } from '../../../../config';
import { dataSetsBarChart } from '../../dataHome';
import { PostData } from '../../../../apis/helpers';
import { connect } from 'react-redux';
import NavigationService from 'routers/NavigationService';
import { ListStatement, ListApInvoiceGroupStatement, ListInvoice, AdvanceRequest } from '../../../../routers/screenNames';
import moment from 'moment';

const legendStatement = [
  {
    label: 'Tờ trình\nsắp quá hạn',
    number: '0',
    price: '0',
    color: R.colors.colorTuChoi
  },
  {
    label: 'ĐNTT\nchưa duyệt',
    number: '0',
    price: '0',
    color: R.colors.corlor9c
  },
  {
    label: 'BTHTT\nchưa duyệt',
    number: '0',
    price: '0',
    color: R.colors.colorMain
  },
];

export const onPressFilter = (key) => {
  const { screen, filter, quarter } = key;
  switch (screen) {
    case 'TO_TRINH':
      NavigationService.navigate(ListStatement, { filter });
      break;
    case 'DNTT':
      NavigationService.navigate(AdvanceRequest, { filter, quarter});
      break;
    case 'BTHTT':
      NavigationService.navigate(ListApInvoiceGroupStatement, { filter });
      break;
    case 'HOA_DON':
      NavigationService.navigate(ListInvoice, { filter });
      break;
  }
}

class HomeBarChart extends React.Component {
  constructor() {
    super();

    this.state = {
      data: {
        dataSets: dataSetsBarChart,
        config: {
          barWidth: 0.8,
          group: {
            fromX: 0.1,
            groupSpace: 0,
            barSpace: 0.9,
          },
          highlightAlpha: 90,
        },
      },
      xAxis: {
        granularityEnabled: true,
        granularity: 10,
        axisMaximum: 10,
        axisMinimum: 0,
        position: 'BOTTOM',
        enabled: false
      },
      yAxis: {
        left: {
          axisLineColor: processColor(R.colors.border),
          gridColor: processColor(R.colors.border),
          granularity: 5,
          axisMaximum: 25,
          axisMinimum: 0,
        },
        right: {
          enabled: false,
          granularity: 10,
          axisMaximum: 10,
          axisMinimum: 0,
          axisLineColor: processColor(R.colors.border),
          drawGridLines: false,
        }
      },
      description: {
        text: ''

      },
      legend: {
        enabled: false,
      },
      legendStatement
    }
  }

  componentDidMount() {
    // this.fetch();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.userData.loggedIn.adOrgId !== this.props.userData.loggedIn.adOrgId) {
      this.fetch();
    }
  }

  fetch = async () => {
    try {
      // console.log('fetchBarChar', this.props)
      const url = `${NetworkSetting.ROOT}/erp-service-mobile/dashboardReportRsServiceRest/dashboardReport/reportOverDue/`;
      const dataBody = {
        "orgId": this.props.userData.loggedIn.adOrgId,
        "userId": this.props.userData.adUserId
      }
      const response = await PostData(url, dataBody);
      let legendStatement = [
        {
          label: 'Tờ trình\nsắp quá hạn',
          number: `${response.data.cStatementCnt}`,
          color: R.colors.colorTuChoi,
          key: {
            screen: 'TO_TRINH',
            filter: {
              Approve_Date: moment().add(-10, 'days')
            }
          },
        },
        {
          label: 'ĐNTT\nchưa duyệt',
          number: `${response.data.cAdvanceRequestCnt}`,
          color: R.colors.corlor9c,
          key: {
            screen: 'DNTT',
            filter: [{
              value: '0',
              key: 'approveStatus',
              name: 'Chưa duyệt',
            },
            {
              value: 'CO',
              key: 'docstatus',
              name: 'Hoàn thành',
            }
            ]
          },
        },
        {
          label: 'BTHTT\nchưa duyệt',
          number: `${response.data.apInvoiceGroupCnt}`,
          color: R.colors.colorMain,
          key: {
            screen: 'BTHTT',
            filter: {
              approveStatus: 'DR',
            }
          },
        },
      ];

      let dataSets = [
        {
          values: [response.data.cStatementCnt],
          label: 'Huy luong',
          config: {
            drawValues: false,
            colors: [processColor('#A60014')],
          }
        },
        {
          values: [response.data.cAdvanceRequestCnt],
          label: 'Cho ky',
          config: {
            drawValues: false,
            colors: [processColor('#F39C12')],
          }
        },
        {
          values: [response.data.apInvoiceGroupCnt],
          label: 'Chua ky',
          config: {
            drawValues: false,
            colors: [processColor(R.colors.colorMain)],
          }
        },
      ]

      let yAxis = JSON.parse(JSON.stringify(this.state.yAxis));
      yAxis.left.axisMaximum = Math.max(response.data.cStatementCnt, response.data.cAdvanceRequestCnt, response.data.apInvoiceGroupCnt) + 5;

      let data = JSON.parse(JSON.stringify(this.state.data));
      data.dataSets = dataSets;
      this.setState({ data, legendStatement, yAxis });
    } catch (error) {
      console.log('fetch bar chart data error', error);
    }
  }


  render() {
    // console.log(this.state.data.dataSets)
    const { legendStatement } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.textTitle}>{this.props.title}</Text>
        </View>
        <BarChart
          style={styles.chart}
          data={this.state.data}
          xAxis={this.state.xAxis}
          yAxis={this.state.yAxis}
          animation={{ durationX: 2000 }}
          gridBackgroundColor={processColor('#ffffff')}
          visibleRange={{ x: { min: 5, max: 5 } }}
          drawBarShadow={false}
          drawValueAboveBar={true}
          drawHighlightArrow={true}
          marker={this.state.marker}
          chartDescription={this.state.description}
          legend={this.state.legend}
          // disable zoom, drag
          scaleEnabled={false}
          doubleTapToZoomEnabled={false}
          pinchZoom={false}
          dragEnabled={false}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: HEIGHTXD(79) }}>
          {
            legendStatement.map((item, index) => (
              <TouchableOpacity
                onPress={() => onPressFilter(item.key)}
                key={index.toString()}
                style={[styles.renderBox, { borderRightWidth: (index === legendStatement.length - 1) ? 0 : 1 }]}>
                <Text style={styles.number}>{item.number}</Text>
                <Text style={styles.legendText}>{item.label}</Text>
                <View style={[styles.legendBox, { backgroundColor: item.color }]} />
              </TouchableOpacity>
            ))
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
  },
  chart: {
    height: HEIGHTXD(600),
    width: WIDTHXD(1035 - 160),
    marginTop: HEIGHTXD(60),
    alignSelf: 'center',
  },
  textTitle: {
    color: R.colors.black0,
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
    width: WIDTHXD(1035 / 3),
    marginBottom: HEIGHTXD(68),
    minHeight: HEIGHTXD(130),
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
    textAlign: 'center'
    // marginLeft: WIDTHXD(50)
  },
  legendText: {
    color: R.colors.black0,
    fontSize: getFontXD(36),
    lineHeight: getLineHeightXD(44),
    fontFamily: R.fonts.RobotoRegular,
    opacity: 0.75,
    marginTop: HEIGHTXD(10),
    textAlign: 'center',
    paddingHorizontal: WIDTHXD(16)
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
  viewHachToan: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: HEIGHTXD(99),
    paddingHorizontal: WIDTHXD(50),
    width: WIDTHXD(1035),
  }
});

// export default HomeBarChart;

function mapStateToProps(state) {
  return {
    userData: state.userReducers.userData,
  }
}
export default connect(mapStateToProps, {})(HomeBarChart);
