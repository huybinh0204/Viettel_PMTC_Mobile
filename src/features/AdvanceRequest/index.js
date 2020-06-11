import React, { Component } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, StatusBar, BackHandler } from 'react-native';
import { connect } from 'react-redux'
import moment from 'moment';
import _ from 'lodash';
import i18n from '../../assets/languages/i18n';
import NavigationService from '../../routers/NavigationService';
import AdvanceRequest from '../../apis/Functions/advanceRequest';
import Confirm from '../../common/ModalConfirm/Confirm';
import { showAlert, TYPE } from '../../common/DropdownAlert';
import ItemStatement from './Item';
import { WIDTHXD, HEIGHTXD, getFontXD, getWidth, getHeight, getLineHeightXD, timeFormat, convertDataInvoice, renderColorItem, getStartDateOfQuater, getEndDateOfQuater } from '../../config';
import ItemTrong from '../../common/Item/ItemTrong'
import ButtonAdd from '../../common/Button/ButtonAdd';
import { showLoading, hideLoading } from '../../common/Loading/LoadingModal'
import R from '../../assets/R';
import HeaderAdvanceRequest from './Headers';
import SecsionListSwipe from '../../common/Swipe/SecsionListSwipe'
import { actionInputSearch, filterAdvanceRequest } from '../../actions/advanceRequest'
import global from './global'

class InfomationDetails extends Component {
  dataAdvanceRequest = [];

  readEnd = false;

  constructor(props) {
    super(props);
    this.state = {
      image: {},
      tabActive: -1,
      refreshing: false,
      showfooter: false,
      idSelected: 0,
      action: 0,
      reRender: false,
      isSearch: false,
      search: '',
      loading: false,
      Firstloading: false,
      isLoadingFooter: false,
      showModal: false,
      isLoading: false,
      bodyFilter: {},
      demoData: [1],
    }
    this.index = 0;
    this.indexOfItem = '0.0'
    this.oldSearch = ''
    this.titlePopup = ''
    this.maxData = 0
    this.backHandle = this.backHandle.bind(this)
    this.filterParams = this.props.navigation.getParam('filter');
    this.quarter = this.props.navigation.getParam('quarter');
    this.onEndReachedCalledDuringMomentum = true;
  }

  renderItem = ({ item, index }) => {
    let day = moment(item.transDate, timeFormat).format('D');
    let month = moment(item.transDate, timeFormat).format('M');
    let year = moment(item.transDate, timeFormat).format('YYYY');
    let { isShowMonth, documentNo, price, description, deadline, vwAmount, cAdvanceRequestId, signerstatus,
      vwstatus, paymentStatus, docstatus, approveStatus } = item;
    let payStatus = paymentStatus ? R.strings.local.TRANG_THAI_CHI[paymentStatus].name : ''
    let color = renderColorItem(docstatus, approveStatus, signerstatus)
    return (
      <ItemStatement
        isShowMonth={isShowMonth}
        time={{ day, month, year }}
        index={index}
        color={color}
        content={{ documentNo, price, description, deadline, vwAmount, cAdvanceRequestId, vwstatus, payStatus }}
        onSuccess={this._onSuccess}
        onDelete={this._onDelete}
        onPressItem={(id) => { this.onPressItem(id, color) }}
      />
    )
  }

  onPressItem = (id, color) => {
    NavigationService.navigate('AdvanceRequestInfo', { id, color });
  }

  async componentDidMount() {
    showLoading()
    if (this.filterParams) {
      console.log(this.filterParams)
      this.props.filterAdvanceRequest(Object.assign({}, this.filterParams), this.state.tabActive)
    } else {
      this.refreshData();
    }
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backHandle)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backHandle)
  }

  componentWillReceiveProps(nextProps) {
    if ((nextProps.filter !== this.props.filter) && (nextProps.tabActive === this.state.tabActive)) {
      showLoading()
      this._searchData(0, '', nextProps.filter)
    }
    if ((nextProps.keyword !== this.props.keyword) && (nextProps.tabActive === this.state.tabActive)) {
      showLoading()
      this._searchData(0, nextProps.keyword.trim(), '')
    }
    if (nextProps.isReloadList !== this.props.isReloadList) {
      showLoading()
      this.refreshData()
    }
  }

  backHandle = () => {
    if (this.props.inputSearch) {
      this.props.actionInputSearch(false)
    } else {
      NavigationService.pop()
    }
    return true
  }

  _getData = async (start, searchKey, filter) => {
    const body = {
      adOrgId: this.props.adOrgId,
      cDepartmentId: this.props.cDepartmentId,
      sortField: 'TRANS_DATE',
      sortDir: 'DESC',
      searchKey,
      start,
      maxResult: 10
    }
    if (filter) {
      _.forEach(filter, (item) => {
        body[item.key] = item.value
      })
    }
    if (this.quarter) {
      body['transDateFrom'] = getStartDateOfQuater(this.quarter)
      body['transDateTo'] = getEndDateOfQuater(this.quarter)
    }
    console.log('body', body)
    let response = await AdvanceRequest.filterAdvanceRequest(body)
    return response
  }

  refreshData = async () => {
    this.index = 0
    let res = await this._getData(0, '', '');
    if (res.data.data) {
      this.index = res.data.data.length
      let data = convertDataInvoice([], res.data.data)
      this.dataAdvanceRequest = data
      this.setState({ refreshing: false }, () => hideLoading())
    } else hideLoading()
  }

  _searchData = async (start, keyword, filter) => {
    this.index = start
    let res = await this._getData(start, keyword, filter);
    if (res.data.data) {
      this.index = res.data.data.length
      let data = convertDataInvoice([], res.data.data)
      this.dataAdvanceRequest = data
    }
    this.setState({ refreshing: false })
    hideLoading()
  }

  loadMoreData = async () => {
    let { search } = this.state;
    this.setState({ showfooter: true }, async () => {
      let response = await this._getData(this.index, search, this.props.filter)
      if (response.data.data) {
        this.index += response.data.data.length
        let data = convertDataInvoice(this.dataAdvanceRequest, response.data.data)
        this.dataAdvanceRequest = data
        this.setState({ showfooter: false })
      } else {
        this.setState({ showfooter: false })
      }
    })
  }

  renderFooter = () => (
    this.state.showfooter ? (
      <View style={{ height: HEIGHTXD(110) }}>
        <ActivityIndicator animating color={R.colors.colorMain} size="large" />
      </View>) : (
        <View style={{ height: HEIGHTXD(110) }} />)
  )

  _deleteItem = async () => {
    const { idSelected } = this.state;
    this.setState({ refreshing: true });
    let res = await AdvanceRequest.deleteItemAdvanceRequest(idSelected);
    if (res) {
      this.setState({ refreshing: false });
      const [section] = this.indexOfItem.split('.');
      const newData = [...this.dataAdvanceRequest];
      const prevIndex = this.dataAdvanceRequest[section].data.findIndex(
        items => items.key === this.indexOfItem
      );
      if (newData[section].data.length > 1) {
        newData[section].data.splice(prevIndex, 1);
      } else {
        newData[section] = { title: '', data: [] }
      }
      this.dataAdvanceRequest = newData
      this.setState({ refreshing: false });
      showAlert(TYPE.SUCCESS, i18n.t('NOTIFICATION_T'), i18n.t('Delete_successful'))
    } else {
      this.setState({ refreshing: false });
      showAlert(TYPE.ERROR, i18n.t('NOTIFICATION_T'), i18n.t('Delete_failed'))
    }
  }

  _duplicateItem = async () => {
    try {
      this.setState({ refreshing: true })
      const response = await AdvanceRequest.duplicateItemAdvanceRequest(this.state.idSelected);
      if (response && response.status === 200) {
        this.setState({ reRender: false });
        const [section] = this.indexOfItem.split('.');
        const newData = [...this.dataAdvanceRequest];
        const prevIndex = this.dataAdvanceRequest[section].data.findIndex(
          items => items.key === this.indexOfItem
        );
        if (newData[section].data.length > 1) {
          newData[section].data.splice(prevIndex + 1, 0, response.data);
          for (let i = prevIndex + 1; i < newData[section].data.length; i++) {
            let currentKey = `${section}.${i}`
            newData[section].data[i].key = currentKey
          }
        } else {
          newData[section] = { title: '', data: [] }
        }
        this.dataAdvanceRequest = newData
        this.setState({ refreshing: false })
        showAlert(TYPE.SUCCESS, 'Thông báo', 'Sao chép đề nghị thanh toán thành công')
      } else {
        this.setState({ refreshing: false })
        showAlert(TYPE.ERROR, 'Thông báo', 'Sao chép đề nghị thanh toán thất bại')
      }
    } catch (error) {
      this.setState({ refreshing: false })
      showAlert(TYPE.ERROR, 'Thông báo', 'Sao chép đề nghị thanh toán thất bại')
    }
  }

  _onPressAlert = () => {
    if (this.state.action !== -1) {
      this._duplicateItem()
    } else {
      this._deleteItem()
    }
  }

  onPressIcon = (indexOfIcon, indexOfItem) => {
    const [section] = indexOfItem.split('.');
    const newData = [...this.dataAdvanceRequest];
    const prevIndex = this.dataAdvanceRequest[section].data.findIndex(
      items => items.key === indexOfItem
    );

    let item = newData[section].data[prevIndex];
    if (indexOfIcon === 1) {
      NavigationService.navigate('AdvanceRequestInfo', { id: item.cAdvanceRequestId });
    }
    if (indexOfIcon === 2) {
      if (item.docstatus === 'DR') {
        this.titlePopup = 'Bạn có muốn xóa bản ghi này không ?'
        this.indexOfItem = indexOfItem
        this.setState({ idSelected: item.cAdvanceRequestId, action: -1 })
        this.ConfirmPopup.setModalVisible(true);
      } else {
        showAlert(TYPE.ERROR, i18n.t('NOTIFICATION_T'), i18n.t('CAN_NOT_DELETE_CO_RECORD'))
      }
    }
    if (indexOfIcon === 0) {
      this.titlePopup = 'Bạn có muốn sao chép đề nghị thanh toán này không ?'
      this.indexOfItem = indexOfItem
      this.setState({ idSelected: item.cAdvanceRequestId, action: 1 })
      this.ConfirmPopup.setModalVisible(true);
    }
  }

  render() {
    const renderSectionHeader = ({ section }) => {
      if (section.title === '' || !section.title) return []
      if (section.key === 0) {
        return (<Text style={styles.txtMonth}>{section.title}</Text>)
      } else {
        return (
          <View>
            <Text style={styles.txtMonthTopBorder}>{section.title}</Text>
          </View>
        )
      }
    };
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={R.colors.colorMain} />
        <HeaderAdvanceRequest
          tabActive={this.state.tabActive}
          indexIcon={global.SHOW_DOUBLE_ICON}
          colorTab={false}
          title="Danh sách Đề nghị TT"
          onButtonSearch={() => this._searchAdvanceRequest()}
          search={this.state.search}
          onDismissSearch={this._dimissSearch}
          onValueSearchChange={this._onValueSearchSubmit}
          checkSave={() => NavigationService.pop()}
        />
        <Confirm
          ref={ref => { this.ConfirmPopup = ref }}
          title={this.titlePopup}
          titleLeft="HUỶ"
          titleRight="ĐỒNG Ý"
          onPressLeft={() => { }}
          onPressRight={() => this._onPressAlert()}
        />
        <View style={styles.f1}>
          <View style={styles.view}>
            <SecsionListSwipe
              useSectionList={true}
              data={this.dataAdvanceRequest}
              sections={this.dataAdvanceRequest}
              extraData={this.state.reRender}
              onMomentumScrollBegin={() => {
                if (!this.state.loading) {
                  this.setState({ showfooter: true }, () => this.loadMoreData());
                }
              }}
              renderItem={({ item, index }) => this.renderItem({ item, index })}
              ListEmptyComponent={!this.state.refreshing && <ItemTrong title={i18n.t('NULL_DATA_SEARCH')} />}
              ListFooterComponent={this.renderFooter}
              onRefresh={this.refreshData}
              refreshing={this.state.refreshing}
              onEndReachedThreshold={0.1}
              onPressIcon={(indexOfIcon, indexOfItem) => { this.onPressIcon(indexOfIcon, indexOfItem) }}
              listIcons={[R.images.iconCoppy, R.images.iconEdit, R.images.iconDelete]}
              widthListIcon={WIDTHXD(387)}
              rightOfList={WIDTHXD(30)}
              styleOfIcon={{ height: WIDTHXD(105), width: WIDTHXD(105) }}
              stickySectionHeadersEnabled={false}
              renderSectionHeader={renderSectionHeader}
            />
          </View>
          <ButtonAdd
            onButton={() => {
              NavigationService.navigate('AdvanceRequestInfo', 'create')
            }}
            bottom={HEIGHTXD(150)}
          />
        </View>
      </View>
    );
  }
}
function mapStateToProps(state) {
  return {
    adOrgId: state.userReducers.userData.loggedIn.adOrgId,
    cDepartmentId: state.userReducers.userData.loggedIn.adUserDepartmentId,
    adUserId: state.userReducers.userData.adUserId,
    keyword: state.advanceRequestReducer.keyword,
    filter: state.advanceRequestReducer.filter,
    tabActive: state.advanceRequestReducer.tabActive,
    inputSearch: state.advanceRequestReducer.inputSearch,
    isReloadList: state.advanceRequestReducer.isReloadList,
  }
}
export default connect(mapStateToProps, { actionInputSearch, filterAdvanceRequest })(InfomationDetails);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: R.colors.blueGrey51,
  },
  f1: {
    flex: 1
  },
  view: {
    width: getWidth(),
    flex: 1,
    height: getHeight() - HEIGHTXD(20),
    backgroundColor: R.colors.colorf1f,
    paddingTop: HEIGHTXD(30),
  },
  item: {
    marginTop: HEIGHTXD(50),
  },
  title: {
    fontSize: getFontXD(42),
    fontFamily: R.fonts.MontserratMedium
  },
  txtMonth: {
    marginLeft: WIDTHXD(32),
    lineHeight: getLineHeightXD(43),
    color: R.colors.black0,
    fontSize: getFontXD(36),
    marginTop: HEIGHTXD(23),
    opacity: 1,
    fontFamily: R.fonts.RobotoMedium
  },
  txtMonthTopBorder: {
    paddingHorizontal: WIDTHXD(46),
    paddingTop: getLineHeightXD(25),
    lineHeight: getLineHeightXD(43),
    color: R.colors.black0,
    fontSize: getFontXD(36),
    marginTop: HEIGHTXD(23),
    opacity: 1,
    fontFamily: R.fonts.RobotoMedium,
    borderTopColor: R.colors.grey300,
    borderTopWidth: 1,
  },
});
