import React, { Component } from 'react';
import { Text, View, StyleSheet, FlatList, ActivityIndicator, BackHandler } from 'react-native';
import moment from 'moment'
import { connect } from 'react-redux'
import { TabAddApInvoiceGroupStatement } from 'routers/screenNames';
import NavigationService from '../../../routers/NavigationService';
import { setListInvoiceGroup } from '../../../actions/invoiceGroup'
import i18n from '../../../assets/languages/i18n';
import _ from "lodash";
import Confirm from '../../../common/ModalConfirm/Confirm';
import { showAlert, TYPE } from '../../../common/DropdownAlert';
import { LoadingComponent } from '../../../common/Loading/LoadingComponent';
import { getListApInvoiceGroupStatement, delApInvoiceGroupStatement, duplicateItemApInvoiceGroupStatement } from '../../../apis/Functions/apInvoiceGroupStatement'
import ApInvoiceGroupStatement from '../../../apis/Functions/apInvoiceGroupStatement'
import { WIDTHXD, HEIGHTXD, getFontXD, getWidth, convertDataStatement, mapTimeVNToWorld, getHeight, getLineHeightXD, convertDataInvoiceGroup, renderColorInvoiceGroupItem, getStartDateOfQuater, getEndDateOfQuater } from '../../../config';
import HeaderBtnSearch from '../../../common/Header/HeaderBtnSearch';
import ItemTrong from '../../../common/Item/ItemTrong'
import ButtonAdd from '../../../common/Button/ButtonAdd';
import R from '../../../assets/R'
import DialogSearch from '../../AdvanceRequest/DialogFilter';
import ItemApInvoiceGroupStatement from './ItemApInvoiceGroupStatement';
import SecsionListSwipe from '../../../common/Swipe/SecsionListSwipe'
import { pathForBundle } from 'react-native-fs';


const listField = [
  {
    title: 'Trạng thái tài liệu',
    data: R.strings.local.TRANG_THAI_TAI_LIEU_ADVANCE_REQUEST,
    key: 'docstatus'
  },
  {
    title: 'Trạng thái duyệt',
    data: R.strings.local.APPROVE_STATUS_INVOICE_GROUP_FILTER,
    key: 'approveStatus'
  },
  {
    title: 'Trạng thái ký',
    data: R.strings.local.TRANG_THAI_KY_FILTER,
    key: 'signerstatus'
  },
  {
    title: 'Trạng thái chi',
    data: R.strings.local.TRANG_THAI_CHI_FILTER,
    key: 'paymentStatus'
  },
]


class ListApInvoiceGroupStatement extends Component {
  ConfirmPopup = {
  };

  dataApInvoiceGroup = [];
  total = 0;

  timeoutSearch;
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      showfooter: false,
      apInvoiceGroupId: 0,
      search: '',
      loading: true,
      Firstloading: true,
      isLoadingFooter: false,
      reRender: false,
      bodyFilter: {},
      isSearch: false,
      maxResult: 10,
      sortField: "TRANS_DATE",
      sortDir: "DESC",
      action: -1,
      docstatus: null,
      approveStatus: null,
      issignerrecord: null,
      isSignSuccess: null,
      isSignDenied: null,
      signerstatus: null,
      paymentStatus: null,
      keyItem: '',
      param_TrinhKy: null,
      transDateFrom: null,
      transDateTo: null,
    }
    this.dataApInvoiceGroup = []
    this.total = 0
    this.index = 0;
    this.indexOfItem = '0.0'
    this.getSearchApInvoiceGroup = _.debounce(this.getDataSearch, 500);

    this.filterParams = this.props.navigation.getParam('filter');
  }
  componentWillReceiveProps(nextProps) {

    if (nextProps.isReloadList !== this.props.isReloadList) {
      this.refreshData()
    }

    if (nextProps.reloadItem !== this.props.reloadItem) {
      if (this.state.apInvoiceGroupId === 0) {
        this.refreshData()
      } else {
        this._reloadItem()
      }
    }

  }
  /**
   * This method to delete a apInvoice group statement
   * It called when user perform click on delete button in SwipeableRowItem 
   */
  _deleteItem = async () => {
    const { apInvoiceGroupId } = this.state;
    this.setState({ refreshing: true });
    let res = await delApInvoiceGroupStatement(apInvoiceGroupId);
    if (res) {
      this.setState({ refreshing: false });
      const [section] = this.indexOfItem.split('.');
      const newData = [...this.dataApInvoiceGroup];
      const prevIndex = this.dataApInvoiceGroup[section].data.findIndex(
        items => items.key === this.indexOfItem
      );
      if (newData[section].data.length > 1) {
        newData[section].data.splice(prevIndex, 1);
      } else {
        newData[section] = { title: '', data: [] }
      }
      this.dataApInvoiceGroup = newData
      this.setState({ reRender: false });
      showAlert(TYPE.SUCCESS, i18n.t('NOTIFICATION_T'), i18n.t('Delete_successful'))
    } else {
      this.setState({ refreshing: false });
      showAlert(TYPE.ERROR, i18n.t('NOTIFICATION_T'), i18n.t('Delete_failed'))
    }
  }

  _reloadItem = async () => {
    const response = await ApInvoiceGroupStatement.getItemApInvoiceGroup(this.state.apInvoiceGroupId)
    if (response && response.status === 200) {
      const [section] = this.indexOfItem.split('.');
      const newData = [...this.dataApInvoiceGroup];
      const prevIndex = this.dataApInvoiceGroup[section].data.findIndex(
        items => items.key === this.indexOfItem
      );
      if (newData[section].data.length > 1) {
        let item = response.data
        item.key = this.indexOfItem
        newData[section].data.splice(prevIndex, 1, item);
      } else {
        newData[section] = { title: '', data: [] }
      }
      this.dataApInvoiceGroup = newData
      this.setState({ reRender: !this.state.reRender })
    }
  }

  setIsSearch = (isSearch) => {
    this.setState({ isSearch })
  }

  _onPressConfirm = async (value) => {
    this.setState({
      docstatus: value[0].value,
      approveStatus: value[1].value,
      signerstatus: value[2].value,
      paymentStatus: value[3].value,
    })
    this.index = 0;
    this.setState({ refreshing: true }, async () => {
      const response = await this._getData(0, this.state.search);
      if (response && response.status === 200) {
        this.index = response.data.data.length
        let data = convertDataInvoiceGroup([], response.data.data)
        this.dataApInvoiceGroup = data
      }
      this.setState({ refreshing: false })
    })
  }
  _convertParams = (value) => {
    this.index = 0;
    const start = 0;
    const body = {
      maxResult: 10, start,
      docstatus: value[0].value,
      approveStatus: value[1].value,
      signerstatus: value[2].value,
      paymentStatus: value[3].value,
      searchKey: this.state.search
    };


    return body;
  }
  componentDidMount = async () => {
    if (this.filterParams) {
      console.log('filter', this.filterParams)
      let { docstatus, approveStatus, signerstatus, paymentStatus, issignerrecord, isSignSuccess, isSignDenied, transDateFrom, transDateTo } = this.state
      docstatus = 'CO'
      if (this.filterParams.quarter) {
        transDateFrom = getStartDateOfQuater(this.filterParams.quarter)
        transDateTo = getEndDateOfQuater(this.filterParams.quarter)
      }
      if (this.filterParams.approveStatus) {
        approveStatus = this.filterParams.approveStatus
      }
      if (this.filterParams.issignerrecord) {
        approveStatus = 'PO'
        issignerrecord = this.filterParams.issignerrecord
      }
      if (this.filterParams.isSignSuccess) {
        approveStatus = 'PO'
        issignerrecord = 'Y'
        isSignSuccess = this.filterParams.isSignSuccess
      }

      if (this.filterParams.isSignDenied) {
        approveStatus = 'PO'
        issignerrecord = 'Y'
        isSignDenied = this.filterParams.isSignDenied
      }

      if (this.filterParams.paymentStatus) {
        approveStatus = 'PO'
        issignerrecord = 'Y'
        isSignSuccess = 'Y'
        paymentStatus = this.filterParams.paymentStatus
      }

      this.setState({ docstatus, approveStatus, signerstatus, paymentStatus, issignerrecord, isSignSuccess, isSignDenied, transDateFrom, transDateTo }, () => {
        this.refreshData()
      })
    } else {
      this.refreshData()
    }
    BackHandler.addEventListener('hardwareBackPress', this.handleAndroidBackButton);
  }




  onChangeSearch = (search) => {
    this.setState({ reRender: true, search })
    this.getSearchApInvoiceGroup(search);
  }
  getDataSearch = async (search) => {
    // let resApInvoiceGroup = await this._getData(0, search);
    // if (resApInvoiceGroup && resApInvoiceGroup.status === 200) {
    //   this.data
    //   ApInvoiceGroup = convertDataInvoice([], resApInvoiceGroup.data.data)
    // }

    this.index = 0;
    this.setState({
      loading: true, documentNo: search, maxResult: 10
    }, async () => {
      let resInvoiceGroup = await this._getData(0, search);
      if (resInvoiceGroup && resInvoiceGroup.status === 200) {
        this.index = resInvoiceGroup.data.data.length
        let data = convertDataInvoiceGroup([], resInvoiceGroup.data.data)
        this.dataApInvoiceGroup = data
      }
      this.setState({ loading: false, showfooter: false })
    })
  }
  _getData = async (start, searchKey) => {
    const { maxResult, sortField, sortDir, docstatus, approveStatus, signerstatus,
      paymentStatus, issignerrecord, isSignSuccess, isSignDenied,
      transDateFrom, transDateTo } = this.state;
    const body = {
      adOrgId: this.props.userData.adOrgId,
      start,
      maxResult,
      sortField, sortDir, searchKey, docstatus,
      approveStatus, signerstatus, paymentStatus,
      issignerrecord, isSignSuccess,
      isSignDenied, transDateFrom, transDateTo
    }
    // console.log('body get group invoice', body)
    const response = await getListApInvoiceGroupStatement(body);
    return response;
  }

  refreshData = async () => {
    if (!this.state.Firstloading) {
      this._resetDataSearch()
    }
    this.setState({ refreshing: true }, async () => {
      let resApInvoiceGroup = await this._getData(0, '');
      if (resApInvoiceGroup && resApInvoiceGroup.status === 200) {
        this.index = resApInvoiceGroup.data.data.length
        let data = convertDataInvoiceGroup([], resApInvoiceGroup.data.data)
        this.dataApInvoiceGroup = data
      }
      this.setState({ refreshing: false, Firstloading: false })
    })
  }

  /**
   * load more item 
   */
  loadMoreData = async () => {
    if (this.total == this.index) {
      return;
    }
    let { search } = this.state;
    this.setState({ loading: true, showfooter: true }, async () => {
      let response = await this._getData(this.index, search)
      if (response.data) {
        this.index += response.data.data.length
        let dataConvert = convertDataInvoiceGroup(this.dataApInvoiceGroup, response.data.data)
        this.dataApInvoiceGroup = dataConvert;
      }
      this.setState({ loading: false, showfooter: false })
    })
  }

  renderFooter = () => (
    this.state.showfooter ? (
      <View style={{ height: HEIGHTXD(110) }}>
        <ActivityIndicator animating color="#1C1C1C" size="large" />
      </View>) : (
        <View style={{ height: HEIGHTXD(110) }} />)
  )

  onPressIcon = (indexOfIcon, indexOfItem) => {
    const [section] = indexOfItem.split('.');
    const newData = [...this.dataApInvoiceGroup];
    const { userData } = this.props
    const prevIndex = this.dataApInvoiceGroup[section].data.findIndex(
      items => items.key === indexOfItem
    );

    let item = newData[section].data[prevIndex];
    this.indexOfItem = indexOfItem
    this.setState({ reRender: true });
    if (indexOfIcon === 0) {
      // this.titlePopup = i18n.t("DUPLICATE_CONFIRM")
      this.setState({
        apInvoiceGroupId: item.apInvoiceGroupId,
        // action: 0
      }, () => this._duplicateItem()
      )
      // this.ConfirmPopup.setModalVisible(true);
    } else if (indexOfIcon === 1) {
      if (item.createdby != this.props.userData.adUserId) {
        showAlert(TYPE.INFO, i18n.t('NOTIFICATION_T'), i18n.t('HAVE_NOT_EDIT_PERMISSION'))
        return
      }
      this.setState({
        apInvoiceGroupId: item.apInvoiceGroupId,
      })
      NavigationService.navigate(TabAddApInvoiceGroupStatement, { id: item.apInvoiceGroupId, docStatus: item.docstatus, keyItem: indexOfItem });
    } else if (indexOfIcon === 2) {
      if (item.createdby != this.props.userData.adUserId) {
        showAlert(TYPE.INFO, i18n.t('NOTIFICATION_T'), i18n.t('HAVE_NOT_DELETE_PERMISSION'))
        return
      }
      if (item.docstatus === 'CO') {
        showAlert(TYPE.INFO, i18n.t('NOTIFICATION_T'), i18n.t('CAN_NOT_DELETE_CO_RECORD'))
        return
      }
      this.titlePopup = i18n.t("DELETE_CONFIRM")
      this.setState({
        apInvoiceGroupId: item.apInvoiceGroupId,
        action: 1,
      })
      this.ConfirmPopup.setModalVisible(true);
    }
  }

  _onPressAlert = () => {
    if (this.state.action == 0) {
      this._duplicateItem()
    } else {
      this._deleteItem()
    }
  }

  /**
   * This method to duplicate a apInvoice group statement
   * It called when user perform click on duplicate button in SwipeableRowItem 
   */
  _duplicateItem = async () => {
    try {
      this.setState({ refreshing: true })
      const response = await duplicateItemApInvoiceGroupStatement(this.state.apInvoiceGroupId);
      if (response && response.status === 200) {
        this.setState({ reRender: false });
        const [section] = this.indexOfItem.split('.');
        const newData = [...this.dataApInvoiceGroup];
        const prevIndex = this.dataApInvoiceGroup[section].data.findIndex(
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
        this.dataApInvoiceGroup = newData
        // this.setState(prevState => {
        //   const { dataApInvoiceGroup } = prevState;
        //   dataApInvoiceGroup.splice(this.state.index + 1, 0, response.data)
        //   return dataApInvoiceGroup;
        // })
        this.setState({ refreshing: false })
        showAlert(TYPE.SUCCESS, i18n.t('NOTIFICATION_T'), i18n.t('DUPLICATE_SUCCESS'))
      } else {
        this.setState({ refreshing: false })
        showAlert(TYPE.ERROR, i18n.t('NOTIFICATION_T'), i18n.t('DUPLICATE_FAILED'))
      }
    } catch (error) {
      this.setState({ refreshing: false })
      showAlert(TYPE.ERROR, i18n.t('NOTIFICATION_T'), i18n.t('DUPLICATE_FAILED'))
    }
  }

  renderItem = ({ item, index }) => {
    let day = moment(mapTimeVNToWorld(item.transDate)).format('D');
    let month = moment(mapTimeVNToWorld(item.transDate)).format('M');
    let year = moment(mapTimeVNToWorld(item.transDate)).format('YYYY');
    let content = {
      documentNo: item.documentNo,
      docStatus: item.docstatus,
      description: item.description,
      paymentStatus: item.paymentStatus,
      amount: item.approveStatus == 1 ? item.approvedAmount : item.requestAmount,
      apInvoiceId: item.apInvoiceId,
      signerstatus: item.signerstatus,
      vwStatus: item.vwStatus,
      vwAmount: item.vwAmount,
      vwPayment: item.vwPayment,
      apInvoiceGroupId: item.apInvoiceGroupId,
      key: item.key
    }
    let color = renderColorInvoiceGroupItem(item.docstatus, item.approveStatus, item.signerstatus)
    return (
      <ItemApInvoiceGroupStatement
        time={{ day, month, year }}
        content={content}
        index={index}
        color={color}
        isEndItem={index == this.total - 1}
        createAdvanceRequest={this._createAdvanceRequest}
        onPressItem={(id, docStatus, indexOfItem) => { this.onPressItem(id, color, docStatus, indexOfItem) }}
      />
    )
  }

  _createAdvanceRequest = async (id) => {
    try {
      const response = await ApInvoiceGroupStatement.getItemApInvoiceGroup(id)
      if (response && response.status === 200) {
        NavigationService.navigate('AdvanceRequestInfo', { type: 'create', data: response.data })
      } else {
        showAlert(TYPE.ERROR, 'Thông báo', 'Không thể tạo đề nghị thanh toán')
      }
    } catch (err) {
      showAlert(TYPE.ERROR, 'Thông báo', 'Không thể tạo đề nghị thanh toán')
    }
  }

  onPressItem = (id, color, docStatus, indexOfItem) => {
    this.setState({
      apInvoiceGroupId: id,
    })
    this.indexOfItem = indexOfItem
    NavigationService.navigate(TabAddApInvoiceGroupStatement, { id, color, docStatus: docStatus });
  }

  goBackToList = () => {
    this.setState({
      reRender: false,
      search: '',
      isSearch: 'false'
    })
    this.refreshData();

  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleAndroidBackButton)
  }

  handleAndroidBackButton = () => {
    if (this.state.isSearch) {
      this.goBackToList()
    } else {
      NavigationService.pop()
    }
    return true
  }

  _resetDataSearch = () => {
    this.DialogFilter.resetArrayResult();
    this.index = 0;
    this.setState({
      refreshing: true,
      maxResult: 10,
      searchKey: "",
      docstatus: null,
      approveStatus: null,
      signerStatus: null,
      paymentStatus: null,
      issignerrecord: null,
      isSignSuccess: null,
      isSignDenied: null,
      transDateFrom: null,
      transDateTo: null,
    },
      async () => {
        let resInvoiceGroup = await this._getData();
        if (resInvoiceGroup && resInvoiceGroup.status === 200) {
          this.index = resInvoiceGroup.data.data.length
          let data = convertDataInvoiceGroup([], resInvoiceGroup.data.data)
          this.dataApInvoiceGroup = data
        }
        this.setState({ refreshing: false, loading: false, showfooter: false })
      })
  }


  render() {
    const { Firstloading, search, isSearch } = this.state
    if (Firstloading) {
      return (
        <View style={styles.container}>
          <HeaderBtnSearch
            title="Danh sách BTHTT"
            placeholderSearch="Số chứng từ, số tiền DN..."
            search={search}
            resetDataSearch={this._resetDataSearch}
            isSearch={isSearch}
            isFilter={'true'}
            setIsSearch={this.setIsSearch}
            setSearchHide={this.setSearchHide}
            onChangeSearch={this.onChangeSearch}
            onButtonSearch={() => { this.setIsSearch(true) }}
            onButtonSetting={() => this.DialogFilter.setModalVisible(true)}
          />
          <View style={styles.view} />
          <LoadingComponent isLoading={true} />
          <ButtonAdd
            onButton={() => {
              this.setState({ apInvoiceGroupId: 0 })
              this.indexOfItem = ''
              NavigationService.navigate(TabAddApInvoiceGroupStatement, { id: 0 })
            }
            }
            bottom={HEIGHTXD(150)}
          />
        </View>
      )
    }

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
        <HeaderBtnSearch
          title="Danh sách BTHTT"
          placeholderSearch="Số chứng từ, số tiền DN..."
          search={search}
          isSearch={isSearch}
          resetDataSearch={this._resetDataSearch}
          isFilter={'true'}
          setIsSearch={this.setIsSearch}
          setSearchHide={this.setSearchHide}
          onChangeSearch={this.onChangeSearch}
          onButtonSearch={() => { this.setIsSearch(true) }}
          onButtonSetting={() => this.DialogFilter.setModalVisible(true)}
        />

        <Confirm
          ref={ref => { this.ConfirmPopup = ref }}
          title={this.titlePopup}
          titleLeft="HUỶ"
          titleRight="ĐỒNG Ý"
          onPressLeft={() => { }}
          onPressRight={() => this._onPressAlert()}
        />
        <View style={styles.view}>
          <SecsionListSwipe
            useSectionList={true}
            data={this.dataApInvoiceGroup}
            sections={this.dataApInvoiceGroup}
            extraData={this.state.reRender}
            renderItem={({ item, index }) => this.renderItem({ item, index })}
            ListEmptyComponent={!this.state.refreshing && <ItemTrong title={i18n.t('NULL_DATA_SEARCH')} />}
            onEndReached={this.loadMoreData.bind(this)}
            ListFooterComponent={this.renderFooter}
            onRefresh={this.refreshData}
            refreshing={this.state.refreshing}
            onEndReachedThreshold={0.1}
            onPressIcon={(indexOfIcon, indexOfItem) => { this.onPressIcon(indexOfIcon, indexOfItem) }}
            listIcons={[R.images.iconCoppy, R.images.iconEdit, R.images.iconDelete]}
            widthListIcon={WIDTHXD(387)}
            rightOfList={WIDTHXD(30)}
            styleOfIcon={{}}
            stickySectionHeadersEnabled={false}
            renderSectionHeader={renderSectionHeader}
          />
        </View>
        <DialogSearch
          title="Lọc BTHTT"
          ref={ref => { this.DialogFilter = ref }}
          onPressConfirm={this._onPressConfirm}
          titleStyle={styles.titleStyle}
          buttonStyle={styles.buttonStyle}
          textButtonStyle={styles.textButtonStyle}
          textButton="ĐỒNG Ý"
          data={listField}
        />
        <ButtonAdd
          onButton={() => {
            this.setState({ apInvoiceGroupId: 0 })
            this.indexOfItem = ''
            NavigationService.navigate(TabAddApInvoiceGroupStatement, { id: 0 })
          }}
          bottom={HEIGHTXD(150)}
        />
      </View>
    );
  }
}


function mapStateToProps(state) {
  return {
    userData: state.userReducers.userData.loggedIn,
    isReloadList: state.invoiceGroupReducer.isReloadList,
    reloadItem: state.invoiceGroupReducer.reloadItem,

  }
}
export default connect(mapStateToProps, { setListInvoiceGroup })(ListApInvoiceGroupStatement);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: R.colors.colorMain
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
    marginLeft: WIDTHXD(46),
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
