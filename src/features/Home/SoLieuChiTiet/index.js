import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { updateStack } from 'actions';
import { HEIGHTXD, getWidth, WIDTHXD, getFontXD, NetworkSetting, numberWithCommas } from '../../../config';
import HeaderProfile from '../../../common/Header/HeaderProfile';
import R from '../../../assets/R';
import styles from '../styles';
import ItemSurplus from '../Item/Surplus';
import CombinedChartView from './Item/CombinedChartView';
import TableData from './Item/TableData'
import TablePdbData from './Item/TablePdbData'
import { data2020, data2019, dataTable2019, dataTable2020 } from './dataDetailedNum';

import { showAlert, TYPE } from 'common/DropdownAlert';
import { showLoading, hideLoading } from 'common/Loading/LoadingModal';
import { PostData } from 'apis/helpers';
import moment from 'moment';
import NavigationService from 'routers/NavigationService';


export const fetchAmtDashboard = async (orgId, deptId, year = moment().years()) => {
  try {
    // showLoading();
    const data = {
      orgId,
      deptId,
      year
    };
    const response = await PostData(`${NetworkSetting.ROOT}/erp-service-mobile/dashboardReportRsServiceRest/dashboardReport/amtDashboard`, data);
    // hideLoading();
    if (response && response.status === 200) {
      return response.data;
    } else {
      throw Error('error when fetch data');
    }
  } catch (error) {
    // hideLoading();
    showAlert(TYPE.ERROR, 'Thông báo', 'Không thể tải dữ liệu ngân sách.')
  }
}

export const fetchPdbDashboard = async (adOrgId, adUserId, employeeCode, isTotal = false, dateAcctFr = moment().startOf('year').format('YYYY-MM-DD'), dateAcctTo = moment().format('YYYY-MM-DD')) => {
  try {
    const data = {
      adOrgId,
      adUserId,
      employeeCode, //mã nhân viên
      dateAcctFr, //từ ngày
      dateAcctTo, //đến ngày
      isTotal: isTotal ? 'Y' : undefined
    }
    const response = await PostData(`${NetworkSetting.ROOT}/erp-service-mobile/dashboardReportRsServiceRest/dashboardReport/factAcctDashboard`, data);
    // hideLoading();
    // console.log('fetchPdbDashboard', data, response)
    if (response && response.status === 200) {
      return response.data;
    } else {
      throw Error('error when fetch data');
    }
  } catch (error) {
    // hideLoading();
    showAlert(TYPE.ERROR, 'Thông báo', 'Không thể tải dữ liệu số dư công nợ cá nhân.');
    return [];
  }
}

class SoLieuChiTiet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataCombinedChart: data2020,
      dataTable: dataTable2020,
      showChi: true,
      type: this.props.navigation.getParam('type', 'SDNS'),
      year: moment().years().toString()
    };
  }


  componentWillUnmount = () => {
    this.props.updateStack({
      exitApp: true,
      navigationHome: this.props.navigation
    })
  }



  componentDidMount() {
    this.refresh();
  }

  refresh = async () => {
    const data = await fetchAmtDashboard(this.props.userData.loggedIn.adOrgId, this.props.userData.loggedIn.adUserDepartmentId, this.state.year);
    if (data && data.length === 5) {
      let data4q = data.filter(x => x.quarterNo !== null);
      let dataCombinedChart = {
        dataQuy: [],
        dataChiQuy: [],
        valueSoDu: [],
        valueDaChi: []
      };
      let dataTable = [
        ['0', '0', '0', '0'],
        ['0', '0', '0', '0'],
        ['0', '0', '0', '0'],
        ['0', '0', '0'],
        [0, 0, 0, 0]
      ];
      data4q.map((x, index) => {
        dataCombinedChart.dataQuy[index] = x.useAmount;
        dataCombinedChart.dataChiQuy[index] = x.remainAmount;
        dataCombinedChart.valueDaChi[index] = x.useAmount;
        dataCombinedChart.valueSoDu[index] = x.remainAmount;
        dataTable[0][index] = numberWithCommas(x.planAmount);
        dataTable[1][index] = numberWithCommas(x.useAmount);
        dataTable[2][index] = numberWithCommas(x.remainAmount);
      })
      let dataSum = data.filter(x => x.quarterNo === null);
      if (dataSum.length > 0) {
        dataTable[3][0] = numberWithCommas(dataSum[0].planAmount);
        dataTable[3][1] = numberWithCommas(dataSum[0].useAmount);
        dataTable[3][2] = numberWithCommas(dataSum[0].remainAmount);
        dataTable[4][0] = dataSum[0].planAmount;
        dataTable[4][1] = dataSum[0].useAmount;
        dataTable[4][2] = dataSum[0].remainAmount;
      }
      this.setState({ dataCombinedChart, dataTable });
    }
  }

  renderAtm = () => {
    const { showChi } = this.state
    return (
      <>
        <View style={styles.line2} />
        <View style={{ backgroundColor: R.colors.white, alignSelf: 'center', flexDirection: 'row', width: WIDTHXD(478), height: HEIGHTXD(90), borderRadius: WIDTHXD(20) }}>
          <TouchableOpacity
            onPress={() => this.setState({ showChi: !this.state.showChi })}
            style={{ width: WIDTHXD(478 / 2), height: HEIGHTXD(90), backgroundColor: showChi ? R.colors.colorMain : R.colors.white, borderRadius: WIDTHXD(20), alignItems: 'center', justifyContent: 'center', }}
          >
            <Text style={{ fontSize: getFontXD(42), fontFamily: R.fonts.RobotoMedium, color: showChi ? R.colors.white : R.colors.gray5b71 }}>Đã chi</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.setState({ showChi: !this.state.showChi })}
            style={{ width: WIDTHXD(478 / 2), height: HEIGHTXD(90), backgroundColor: showChi ? R.colors.white : R.colors.corlor9c, borderRadius: WIDTHXD(20), alignItems: 'center', justifyContent: 'center', }}
          >
            <Text style={{ fontSize: getFontXD(42), fontFamily: R.fonts.RobotoMedium, color: !showChi ? R.colors.white : R.colors.gray5b71 }}>Còn lại</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.line} />

        <CombinedChartView
          title="TỜ TRÌNH"
          year={this.state.year}
          dataQuy={showChi ? this.state.dataCombinedChart.dataQuy : this.state.dataCombinedChart.dataChiQuy}
          valueSoDu={this.state.dataCombinedChart.valueSoDu}
          valueDaChi={this.state.dataCombinedChart.valueDaChi}
          showChi={showChi}
          onValueChange={(val, item) => {
            this.setState({ year: item.name }, () => this.refresh());
          }}
        />
        <View style={styles.line} />
        <TableData
          title="SỐ LIỆU CHI TIẾT"
          dataTable={this.state.dataTable}
          onFilterDatePress={() => {
            this.datePicker.onPressDate();
          }}
          onValueChange={(val, item) => {
            this.setState({ year: item.name }, () => this.refresh());
          }}
        />
        <View style={styles.line} />
      </>
    )
  }

  renderPdb = () => {

    return (
      <>
        <View style={styles.line} />
        <TablePdbData
          {...this.props}
          title="SỐ LIỆU CHI TIẾT"
          dataTable={this.state.dataTable}
          onValueChange={(val) => { val === '0' ? this.setState({ dataTable: dataTable2020 }) : this.setState({ dataTable: dataTable2019 }) }}
        />
        <View style={styles.line} />
      </>
    )
  }

  render() {
    const { type } = this.state;
    const loggedIn = this.props.userData ? this.props.userData.loggedIn : null;
    const fullName = loggedIn ? loggedIn.userFullName : '';
    const departmentName = loggedIn ? loggedIn.departmentName : '';

    // console.log(this.state.dataTable);
    return (
      <View>
        <ScrollView style={{ backgroundColor: R.colors.colorMain }}>
          <LinearGradient
            colors={R.colors.colorHeaderGradien}
            style={{ height: HEIGHTXD(750), width: getWidth(), position: 'absolute', left: 0, top: 0 }}
          />
          <HeaderProfile
            onPress={() => NavigationService.navigate('Profile')}
            fullName={fullName}
            department={departmentName} />
          <View style={styles.body}>
            <ItemSurplus
              type={this.state.type}
              onTypeChange={(type) => this.setState({ type })}
              {...this.props} />

            {type === 'SDNS' ? this.renderAtm() : this.renderPdb()}
          </View>
        </ScrollView>
      </View>
    );
  }
}
function mapStateToProps(state) {
  return {
    userData: state.userReducers.userData
  }
}
export default connect(mapStateToProps, {
  updateStack
})(SoLieuChiTiet);
