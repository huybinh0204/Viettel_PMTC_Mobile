import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { updateStack } from 'actions';
import { HEIGHTXD, getWidth, NetworkSetting } from '../../config';
import { ListStatement, ListInvoice, AdvanceRequest, SoLieuChiTiet, ListApInvoiceGroupStatement } from '../../routers/screenNames';
import NavigationService from '../../routers/NavigationService';
import HeaderProfile from '../../common/Header/HeaderProfile';
import R from '../../assets/R';
import i18n, { setLocation } from '../../assets/languages/i18n';
import styles from './styles';
import HomePieChart from './Item/ItemChart/HomePieChart';
import { dataTT, dataDNCT, dataDNCTMUnit, dataHTHT, dataHTHTUnit, dataSetsBarChart } from './dataHome';
import ItemTabTopHome from './Item/TopMenu';
import ItemSurplus from './Item/Surplus';
import ListChartCustom from './Item/ItemChart/ListChartCustom';
import HomeBarChart, { onPressFilter } from './Item/ItemChart/HomeBarChart';
import { PostData } from 'apis/helpers';
import moment from 'moment';
import { fetchAmtDashboard } from './SoLieuChiTiet';
import { TABLE_INVOICE_GROUP_ID, TABLE_ADVANCE_REQUEST_ID, TABLE_STATEMENT_ID_2 } from '../../config/constants'
import { TabAddApInvoiceGroupStatement, TabDetailStatement, AdvanceRequestInfo } from 'routers/screenNames';


const convertDataDNTT = (data, uniType) => {
  const prefix = uniType ? 'cnt' : 'amt';
  const dataDNTT = [
    { data1: data[prefix + 'Approved'], data2: data[prefix + 'WaitApprove'], data3: data[prefix + 'ApprovedDenied'] },
    { data1: data[prefix + 'IsSignerRecordY'], data2: data[prefix + 'IsSignerRecordN'], data3: 0 },
    { data1: data[prefix + 'SignSuccess'], data2: 0, data3: data[prefix + 'SignFailure'] },
    { data1: data[prefix + 'Payment'], data2: data[prefix + 'NotEnoughPayment'], data3: data[prefix + 'NotPayment'] },
  ];
  // console.log(data[prefix + 'Approved'])
  // console.log(prefix, dataDNTT)
  return dataDNTT;
}

const DNTT_FILTER = [
  [
    [{ key: 'approveStatus', value: '1', name: 'Đã duyệt' }, { key: 'docstatus', value: 'CO', name: 'Hoàn thành' }],
    [{ key: 'approveStatus', value: '0', name: 'Chưa duyệt' }, { key: 'docstatus', value: 'CO', name: 'Hoàn thành' }],
    [{ key: 'approveStatus', value: '2', name: 'Từ chối' }, { key: 'docstatus', value: 'CO', name: 'Hoàn thành' }]
  ],

  [
    [{ key: 'issignerrecord', value: 'Y', name: 'Đã trình' }, { key: 'docstatus', value: 'CO', name: 'Hoàn thành' }, { key: 'approveStatus', value: '1', name: 'Đã duyệt' }],
    [{ key: 'issignerrecord', value: 'N', name: 'Chưa trình' }, { key: 'docstatus', value: 'CO', name: 'Hoàn thành' }, { key: 'approveStatus', value: '1', name: 'Đã duyệt' }]
  ],
  [
    [{ key: 'isSignSuccess', value: 'Y', name: 'Đã ban hành' }, { key: 'docstatus', value: 'CO', name: 'Hoàn thành' }, { key: 'approveStatus', value: '1', name: 'Đã duyệt' }, { key: 'issignerrecord', value: 'Y', name: 'Đã trình' }],
    [{ key: 'isSignDenied', value: 'Y', name: 'Từ chối' }, { key: 'docstatus', value: 'CO', name: 'Hoàn thành' }, { key: 'approveStatus', value: '1', name: 'Đã duyệt' }, { key: 'issignerrecord', value: 'Y', name: 'Đã trình' }]
  ],
  [
    [{ key: 'paymentStatus', value: '2', name: 'Chi đủ' }, { key: 'docstatus', value: 'CO', name: 'Hoàn thành' }, { key: 'approveStatus', value: '1', name: 'Đã duyệt' }, { key: 'issignerrecord', value: 'Y', name: 'Đã trình' }, { key: 'isSignSuccess', value: 'Y', name: 'Đã ban hành' }],
    [{ key: 'paymentStatus', value: '1', name: 'Chi chưa đủ' }, { key: 'docstatus', value: 'CO', name: 'Hoàn thành' }, { key: 'approveStatus', value: '1', name: 'Đã duyệt' }, { key: 'issignerrecord', value: 'Y', name: 'Đã trình' }, { key: 'isSignSuccess', value: 'Y', name: 'Đã ban hành' }],
    [{ key: 'paymentStatus', value: '0', name: 'Chưa chi' }, { key: 'docstatus', value: 'CO', name: 'Hoàn thành' }, { key: 'approveStatus', value: '1', name: 'Đã duyệt' }, { key: 'issignerrecord', value: 'Y', name: 'Đã trình' }, { key: 'isSignSuccess', value: 'Y', name: 'Đã ban hành' }]
  ],
]

const INVOICE_GROUP_FILTER = [
  [{ 'approveStatus': 'PO' }, { 'approveStatus': 'DR' }, { 'approveStatus': 'DN' }],
  [{ 'issignerrecord': 'Y' }, { 'issignerrecord': 'N' }],
  [{ 'isSignSuccess': 'Y' }, { 'isSignDenied': '2' }],
  [{ 'paymentStatus': '2' }, { 'paymentStatus': '1' }, { 'paymentStatus': '0' }],
]

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      typeChart: 0,
      typeOfCount: true,
      dataTT,
      dataDNTT: dataDNCT,
      dataTHTT: dataHTHT,
      quarterDNTT: moment().quarter(),
      quarterTHTT: moment().quarter(),
      unitDNTT: true,
      unitTHTT: true,
      dataAtm: [0, 0, 0],
    };
  }

  _onChangeTopTab = (index) => {
    switch (index) {
      case 0:
        NavigationService.navigate(ListStatement)
        break;
      case 1:
        NavigationService.navigate(AdvanceRequest)
        break;
      case 2:
        NavigationService.navigate(ListApInvoiceGroupStatement)
        break;
      case 3:
        NavigationService.navigate(ListInvoice)
        break;
      default:
        break;
    }
    this.setState({ index })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // console.log('nextProps', prevProps)
    if (prevProps.userData.loggedIn.adOrgId !== this.props.userData.loggedIn.adOrgId) {
      this.reloadDashboard();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.notification && nextProps.notification !== this.props.notification) {
      let notification = nextProps.notification.data
      if (notification.adTableId && notification.recordId) {
        switch (parseInt(notification.adTableId, 10)) {
          case TABLE_STATEMENT_ID_2:
            NavigationService.navigate(TabDetailStatement, { cStatementId: parseInt(notification.recordId, 10) });
            break
          case TABLE_ADVANCE_REQUEST_ID:
            NavigationService.navigate(AdvanceRequestInfo, { id: parseInt(notification.recordId, 10) });
            break
          case TABLE_INVOICE_GROUP_ID:
            NavigationService.navigate(TabAddApInvoiceGroupStatement, { id: parseInt(notification.recordId, 10), docStatus: '', keyItem: '' });
            break
        }
      }
    }
  }

  componentWillMount() {
    setLocation(i18n, 'vi');
  }

  componentDidMount = () => {
    this.reloadDashboard();
    // this.props.navigation.navigate(SoLieuChiTiet, { type: 'CNCN' })
  }

  reloadDashboard = () => {
    // console.log('props home', this.props)
    this.fetchDNTT();
    this.fetchTHTT();
    fetchAmtDashboard(this.props.userData.loggedIn.adOrgId, this.props.userData.loggedIn.adUserDepartmentId).then(data => {
      let dataAtm = [0, 0, 0];
      // console.log('data', data)
      let dataSum = data.filter(x => x.quarterNo === null);
      if (dataSum.length > 0) {
        dataAtm[0] = dataSum[0].planAmount;
        dataAtm[1] = dataSum[0].useAmount;
        dataAtm[2] = dataSum[0].remainAmount;
      }
      this.setState({ dataAtm })
    })
  }

  fetchDNTT = async () => {
    try {
      const url = `${NetworkSetting.ROOT}/erp-service-mobile/dashboardReportRsServiceRest/dashboardReport/reportTable/1000176/`;
      const dataBody = {
        "orgId": this.props.userData.loggedIn.adOrgId,
        "quarterType": this.state.quarterDNTT,
      }
      const response = await PostData(url, dataBody);
      // console.log('fetchDNTT', dataBody, response.data, this.state.unitDNTT);

      const dataDNTT = convertDataDNTT(response.data, this.state.unitDNTT)
      this.setState({ dataDNTT });
    } catch (error) {
      console.log('fetch bar chart data error', error);
    }
  }

  fetchTHTT = async () => {
    try {
      const url = `${NetworkSetting.ROOT}/erp-service-mobile/dashboardReportRsServiceRest/dashboardReport/reportTable/1000071`;
      const dataBody = {
        "orgId": this.props.userData.loggedIn.adOrgId,
        "quarterType": this.state.quarterTHTT,
      }
      const response = await PostData(url, dataBody);
      // console.log('fetchTHTT', dataBody, response.data);

      const dataTHTT = convertDataDNTT(response.data, this.state.unitTHTT)
      this.setState({ dataTHTT });
    } catch (error) {
      console.log('fetch bar chart data error', error);
    }
  }

  onFilterChange = (chartName, quarter, unit) => {
    // console.log(chartName, quarter, unit);
    if (chartName === 'DNTT') {
      this.setState({
        quarterDNTT: quarter,
        unitDNTT: unit
      }, () => this.reloadDashboard());
    } else {
      this.setState({
        quarterTHTT: quarter,
        unitTHTT: unit
      }, () => this.reloadDashboard());
    }
  }

  _changeMode = (isLeft) => {
    if (isLeft) {
      this.setState({ typeChart: this.state.typeChart === 0 ? 2 : this.state.typeChart - 1 })
    } else this.setState({ typeChart: this.state.typeChart === 2 ? 0 : this.state.typeChart + 1 })
  }

  _updateStackRedux = () => {
    this.props.updateStack({
      exitApp: false,
      navigationHome: this.props.navigation
    })
  }

  _renderChart = (typeChart) => {
    switch (typeChart) {
      case 0:
        return (
          <HomePieChart
            data={this.state.dataTT}
            title="TỜ TRÌNH"
            total="20"
            onPress={this._changeMode}
            mode={true}
          />
        );
      case 1:
        return (
          <ListChartCustom
            title="ĐN THANH TOÁN"
            key="DNTT"
            data={this.state.dataDNTT}
            total={45}
            onPress={this._changeMode}
            onFilterChange={(quarter, unit) => this.onFilterChange('DNTT', quarter, unit)}
            isShowUnit={true}
            quarter={this.state.quarterDNTT}
            unit={this.state.unitDNTT}
            onPressFilter={(x, y) => onPressFilter({ screen: 'DNTT', filter: { ...DNTT_FILTER[x][y] }, quarter: this.state.quarterDNTT })}
          />
        )
      case 2:
        return (
          <ListChartCustom
            title="BẢNG THTT"
            key="BTHTT"
            data={this.state.dataTHTT}
            total={45}
            onPress={this._changeMode}
            onFilterChange={(quarter, unit) => this.onFilterChange('THTT', quarter, unit)}
            isShowUnit={true}
            quarter={this.state.quarterTHTT}
            unit={this.state.unitTHTT}
            onPressFilter={(x, y) => onPressFilter({ screen: 'BTHTT', filter: { ...INVOICE_GROUP_FILTER[x][y], quarter: this.state.quarterTHTT } })}
          />
        )
      default:
        break;
    }
  }

  render() {
    const loggedIn = this.props.userData ? this.props.userData.loggedIn : null;
    const fullName = loggedIn ? loggedIn.userFullName : '';
    const departmentName = loggedIn ? loggedIn.departmentName : '';
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
              data={this.state.dataAtm}
              onPress={(type) => {
                this.props.navigation.navigate(SoLieuChiTiet, { type })
                this._updateStackRedux()
              }}
              {...this.props}
            />
            <View style={styles.line2} />
            <ItemTabTopHome onChange={this._onChangeTopTab} />

            <View style={styles.line} />
            <HomeBarChart
              data={dataSetsBarChart}
              title="CẢNH BÁO"
              total="25"
              scrollEnable={false}
              mode={this.state.typeOfCount}
            />
            <View style={styles.line} />
            {this._renderChart(this.state.typeChart)}
          </View>
        </ScrollView>
      </View>
    );
  }
}
function mapStateToProps(state) {
  return {
    userData: state.userReducers.userData,
    notification: state.userReducers.notification
  }
}
export default connect(mapStateToProps, { updateStack })(Home);
