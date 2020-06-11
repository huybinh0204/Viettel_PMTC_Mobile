import React, { Component } from 'react';
import { Text, View, StyleSheet, FlatList, ActivityIndicator, TouchableNativeFeedbackBase, TouchableHighlight, TouchableOpacity } from 'react-native';
import moment from 'moment'
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux'
import NavigationService from 'routers/NavigationService';
import { TabAddStatement, TabDetailStatement } from 'routers/screenNames';
import { setStatementID, setStatementLineID, setIsHideGroupStatement, setStatusCOStatement, setStatusStatement } from '../../actions/statement'
import i18n from '../../assets/languages/i18n';
import _ from "lodash";
import HeaderStatement from '../../common/Header/HeaderStatement';
import { getListInvoice, delInvoice } from '../../apis/Functions/invoice';
import Confirm from '../../common/ModalConfirm/Confirm';
import { showAlert, TYPE } from '../../common/DropdownAlert';
import { LoadingComponent } from '../../common/Loading/LoadingComponent';
import { getListStatement, deleteItemStatement, duplicateStatement, listStateMentForInvoiceGroup } from '../../apis/Functions/statement'
import ItemStatement from './ItemStatement';
import { WIDTHXD, HEIGHTXD, getFontXD, getWidth, getLineHeightXD, convertDataStatement, renderColorItem, getHeight, timeFormat, convertDataInvoice, getStartDateOfQuater, getEndDateOfQuater } from '../../config';
import HeaderBtnSearch from '../../common/Header/HeaderBtnSearch';
import ItemTrong from '../../common/Item/ItemTrong'
import ButtonAdd from '../../common/Button/ButtonAdd';
import R from '../../assets/R'
import DialogFilter from './DialogFilter';
import DialogSearch from '../AdvanceRequest/DialogFilter';
import SecsionListSwipe from '../../common/Swipe/SecsionListSwipe'
const listField = [
  {
    title: 'Trạng thái tài liệu',
    type: R.strings.TYPE_ITEM_DIALOGSEARCH.PICKER,
    value: '',
    data: R.strings.local.TRANG_THAI_TAI_LIEU_TO_TRINH
  },
  {
    title: 'Trạng thái duyệt',
    type: R.strings.TYPE_ITEM_DIALOGSEARCH.PICKER,
    value: '',
    data: R.strings.local.TRANG_THAI_DUYET_TO_TRINH
  },
  {
    title: 'Trạng thái ký',
    type: R.strings.TYPE_ITEM_DIALOGSEARCH.PICKER,
    value: '',
    data: R.strings.local.TRANG_THAI_KY
  },
]

const listField2 = [
  {
    title: 'Trạng thái duyệt',
    type: R.strings.TYPE_ITEM_DIALOGSEARCH.PICKER,
    value: '',
    data: R.strings.local.TRANG_THAI_DUYET_TO_TRINH
  },
  {
    title: 'Trạng thái ký',
    type: R.strings.TYPE_ITEM_DIALOGSEARCH.PICKER,
    value: '',
    data: R.strings.local.TRANG_THAI_KY
  },
]

class ListStatement extends Component {
  ConfirmPopup = {
  };
  dataStatement = [];
  timeoutSearch;
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      showfooter: false,
      cStatementId: 0,
      search: '',
      loading: true,
      Firstloading: true,
      isLoadingFooter: false,
      data: [],
      reRender: false,
      bodyFilter: {},
      isSearch: false,
      isFilter: true,
      adOrgId: this.props.adOrgId,
      maxResult: 10,
      sortField: "TRANS_DATE",
      sortDir: "DESC",
      oldSearch: "",
      searchKey: "",
      docstatus: null,
      approveStatus: null,
      signerStatus: null,
      isChooseStatement: false,
      transDateFrom: null,
      transDateTo: null,
      checkOverDue: null,
    }
    this.dataStatement = [];
    this.index = 0;
    this.indexOfItem = '0.0';
    this.getSearchStatement = _.debounce(this.getDataSearch, 500);
    this.filterParams = this.props.navigation.getParam('filter');
  }

  _onDelete = async (id) => {
    Alert.alert('', 'Bạn có muốn xóa bản ghi này không ?', [
      { text: 'HỦY BỎ', style: 'cancel' },
      {
        text: 'ĐỒNG Ý',
        onPress: async () => {
          try {
            const response = await deleteItemStatement(id)
            if (response && response.status === 200) {
              this.setState({ refreshing: false });
              const [section] = this.indexOfItem.split('.');
              const newData = [...this.dataStatement];
              const prevIndex = this.dataStatement[section].data.findIndex(
                items => items.key === this.indexOfItem
              );
              if (newData[section].data.length > 1) {
                newData[section].data.splice(prevIndex, 1);
              } else {
                newData[section] = { title: '', data: [] }
              }
              this.dataStatement = newData
              this.setState({ reRender: false });
              showAlert(TYPE.SUCCESS, 'Thông báo', 'Xóa thành công');
              this._onSuccess(id)
            } else {
              showAlert(TYPE.ERROR, 'Thông báo', 'Xóa thất bại');
            }
          } catch (err) {
            showAlert(TYPE.ERROR, 'Thông báo', 'Xóa thất bại')
          }
        }
      }
    ], { cancelable: false })
  }

  setIsSearch = (isSearch) => {
    this.setState({ isSearch })
  }

  setSearchHide = () => {
    this.setState({ isSearch: false })
  }

  _onPressConfirm = (value) => {
    this.index = 0;
    let isChooseStatement = this.state.isChooseStatement
    this.setState({
      loading: true,
      docstatus: isChooseStatement ? 'CO' : value[0].value,
      approveStatus: isChooseStatement ? value[0].value : value[1].value,
      signerStatus: isChooseStatement ? value[1].value : value[2].value,
      maxResult: 10,
    }, async () => {
      let resStatement = await this._getData();
      if (resStatement && resStatement.status === 200) {
        this.index = resStatement.data.data.length
        let data = convertDataInvoice([], resStatement.data.data, 'cStatementId')
        this.dataStatement = data
      }
      this.setState({ loading: false })
    })
  }
  _convertParams = (value) => {
    const start = 0;
    const body = { maxResult: 10, start };
    _.forEach(value, (item, index) => {
      switch (index) {
        case 0:
          _.forEach(R.strings.local.TRANG_THAI_TAI_LIEU, (itemChild) => {
            if (itemChild.name === item) {
              body.docstatus = itemChild.id
            }
          });
          break;
        case 1:
          _.forEach(R.strings.local.TRANG_THAI_DUYET, (itemChild) => {
            if (itemChild.name === item) {
              body.approveStatus = itemChild.id
            }
          });
          break;
        case 2:
          _.forEach(R.strings.local.TRANG_THAI_KY_FILTER, (itemChild) => {
            if (itemChild.name === item) {
              body.signerStatus = itemChild.value
            }
          });
          break;
        default:
          break;
      }
    })
    return body;
  }

  componentDidMount = async () => {
    if (this.filterParams) {
      // console.log('filter', this.filterParams)
      if (this.filterParams.approveStatus) {
        let transDateFrom = this.filterParams.quarter ? getStartDateOfQuater(this.filterParams.quarter) : null
        let transDateTo = this.filterParams.quarter ? getEndDateOfQuater(this.filterParams.quarter) : null
        this.setState({ docstatus: 'CO', approveStatus: this.filterParams.approveStatus, transDateFrom, transDateTo }, () => {
          this.refreshData();
        })
      } else {
        this.setState({ docstatus: 'CO', checkOverDue: 'Y' }, () => {
          this.refreshData();
        })
      }
    } else {
      let isChooseStatement = this.props.navigation.state.params && this.props.navigation.state.params.onPressItem ? true : false
      this.setState({ isChooseStatement }, () => {
        this.refreshData();
      })
    }
  }

  onChangeSearch = (search) => {
    this.setState({ reRender: true, search })
    this.getSearchStatement(search);
  }

  getDataSearch = (search) => {
    this.index = 0;
    this.setState({
      loading: true, searchKey: search, maxResult: 10
    }, async () => {
      let resStatement = await this._getData();
      if (resStatement && resStatement.status === 200) {
        this.index = resStatement.data.data.length
        let data = convertDataInvoice([], resStatement.data.data, 'cStatementId')
        this.dataStatement = data
      }
      this.setState({ loading: false, showfooter: false })
    })
  }

  _getData = async () => {
    let body
    let response;
    if (this.state.isChooseStatement) {
      let dateTo = moment(this.props.navigation.state.params.transDate, 'DD/MM/YYYY').format('YYYY-MM-DD')
      body = {
        adOrgId: this.state.adOrgId,
        cDepartmentId: this.props.cDepartmentId,
        transDateTo: dateTo,
        docstatus: 'CO',
        isFinish: 'N',
        start: this.index,
        maxResult: this.state.maxResult,
        sortField: this.state.sortField,
        sortDir: this.state.sortDir,
        searchKey: this.state.searchKey,
        approveStatus: this.state.approveStatus,
        signerstatus: this.state.signerStatus
      }
    } else {
      body = {
        adOrgId: this.state.adOrgId,
        start: this.index,
        maxResult: this.state.maxResult,
        sortField: this.state.sortField,
        sortDir: this.state.sortDir,
        searchKey: this.state.searchKey,
        docstatus: this.state.docstatus,
        approveStatus: this.state.approveStatus,
        signerstatus: this.state.signerStatus,
        transDateFrom: this.state.transDateFrom,
        transDateTo: this.state.transDateTo,
        checkOverDue: this.state.checkOverDue,
      }
    }
    response = await getListStatement(body);

    // console.log('body list statenent', body)
    // console.log('reponse list statenent', response)
    return response;
  }

  _deleteItemLoadMore = (result) => {
    _.forEach(result, (item, index) => {
      if (item.documentNo === 'Tìm kiếm thêm') {
        result.splice(index, 1)
      }
    })
    return result
  }


  refreshData = async () => {
    this.index = 0;
    this.setState({ refreshing: true, maxResult: 10 },
      async () => {
        let resStatement = await this._getData();
        if (resStatement && resStatement.status === 200) {
          this.index = resStatement.data.data.length;
          let data = convertDataInvoice([], resStatement.data.data, 'cStatementId')
          this.dataStatement = data
        }
        this.setState({ refreshing: false, Firstloading: false })
      })
  }

  loadMoreData = async () => {
    this.setState({
      loading: true, showfooter: true,
    }, async () => {
      let response = await this._getData();
      if (response.status === 200) {
        this.index += response.data.data.length
        let dataConvert = convertDataInvoice(this.dataStatement, response.data.data, 'cStatementId');
        this.dataStatement = dataConvert;
      }
      this.setState({ refreshing: false, loading: false, showfooter: false })
    })
  }

  renderFooter = () => (
    this.state.showfooter ? (
      <View style={{ height: HEIGHTXD(110) }}>
        <ActivityIndicator animating color="#1C1C1C" size="large" />
      </View>) : (
        <View style={{ height: HEIGHTXD(110) }} />)
  )

  alertDelSuccess = async () => {
    const { cStatementId } = this.state;
    this.setState({ loading: true });
    let res = await deleteItemStatement(cStatementId);
    if (res) {
      const [section] = this.indexOfItem.split('.');
      const newData = [...this.dataStatement];
      const prevIndex = this.dataStatement[section].data.findIndex(
        items => items.key === this.indexOfItem
      );
      if (newData[section].data.length > 1) {
        newData[section].data.splice(prevIndex, 1);
      } else {
        newData[section] = { title: '', data: [] }
      }
      this.dataStatement = newData
      this.setState({ loading: false });
      showAlert(TYPE.SUCCESS, i18n.t('NOTIFICATION_T'), i18n.t('Delete_successful'))
    } else {
      this.setState({ loading: false });
      showAlert(TYPE.ERROR, i18n.t('NOTIFICATION_T'), i18n.t('Delete_failed'))
    }
  }

  onPressIcon = async (indexOfIcon, indexOfItem) => {
    const [section] = indexOfItem.split('.');
    const newData = [...this.dataStatement];
    const prevIndex = this.dataStatement[section].data.findIndex(
      items => items.key === indexOfItem
    );

    let item = newData[section].data[prevIndex];
    if (indexOfIcon === 2) {
      this.indexOfItem = indexOfItem
      this.setState({ cStatementId: item.cStatementId })
      this.ConfirmPopup.setModalVisible(true);
    } else {
      if (indexOfIcon === 0) {
        try {
          const response = await duplicateStatement(item.cStatementId);
          if (response.status === 200) {
            if (newData[section].data.length > 1) {
              newData[section].data.splice(prevIndex + 1, 0, response.data);
              for (let i = prevIndex + 1; i < newData[section].data.length; i++) {
                let currentKey = `${section}.${i}`
                newData[section].data[i].key = currentKey
              }
            } else {
              newData[section] = { title: '', data: [] }
            }
            this.dataStatement = newData
            showAlert(TYPE.SUCCESS, 'Thông báo', 'Duplicate thành công')
          }
          else {
            showAlert(TYPE.WARN, 'Thông báo', 'Kiểm tra lại liên kết')
          }
          this.setState({ reRender: !this.state.reRender })
        }
        catch (e) {
        }
      }
      else {
        this.onPressItem(item);
        this.setState({ reRender: !this.state.reRender })
      }
    }
  }

  onPressItem = (content) => {
    if (this.state.isChooseStatement) {
      let indexTmp = -1
      _.forEach(this.props.navigation.state.params.dataStatement, (item, index) => {
        if (content.cStatementId === item.cStatementId) {
          indexTmp = index
        }
      })
      if (indexTmp >= 0) {
        this.props.navigation.state.params.dataStatement.splice(indexTmp, 1)
      } else {
        this.props.navigation.state.params.dataStatement.push(content)
      }
      this.setState({ reRender: !this.state.reRender })
    } else {
      const isDocstatus = content.docstatus === "DR" || content.docstatus === "RA" ? true : false
      this.props.setStatusCOStatement(isDocstatus)
      this.props.setStatusStatement(content)
      this.props.setIsHideGroupStatement({
        isHideGeneralInfo: true,
        isHideOfficeInfo: true,
        isHideMoneyInfo: true,
        isHideStatusInfo: true,
        isHideGeneralInfoLine: true,
        isHideAccountantLine: true,
        isHideBudgetLine: true,
        isHideDifferentLine: true,
      })
      this.props.setStatementID(content.cStatementId)
      NavigationService.navigate(TabDetailStatement
        , {
          callBackListStatement: (item) => {
            this.refreshData();
          }
        }
      );
    }
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
      transDateTo: null,
      transDateFrom: null,
      checkOverDue: null,
    },
      async () => {
        let resStatement = await this._getData();
        if (resStatement && resStatement.status === 200) {
          this.index = resStatement.data.data.length
          let data = convertDataInvoice([], resStatement.data.data, 'cStatementId')
          this.dataStatement = data
        }
        this.setState({ refreshing: false, loading: false, showfooter: false })
      })
  }

  renderItem = ({ item, index }) => {
    let day = moment(item.transDate, timeFormat).format('D');
    let month = moment(item.transDate, timeFormat).format('M');
    let year = moment(item.transDate, timeFormat).format('YYYY');
    let { isShowMonth, documentNo, price, description, deadline, vwamount, cAdvanceRequestId, vwstatus,
      docstatus, paymentStatus, cStatementId, transDate } = item;
    let color = renderColorItem(item.docstatus, item.approveStatus, item.signerstatus);
    let payStatus = paymentStatus ? R.strings.local.TRANG_THAI_CHI[paymentStatus].name : ''
    let isSelectItem = false;
    if (this.state.isChooseStatement) {
      let indexTmp = -1
      _.forEach(this.props.navigation.state.params.dataStatement, (itemTmp, index) => {
        if (item.cStatementId === itemTmp.cStatementId) {
          indexTmp = index
        }
      })
      if (indexTmp >= 0) {
        isSelectItem = true
      }
    }
    return (
      <ItemStatement
        isShowMonth={isShowMonth}
        time={{ day, month, year }}
        onPressItem={this.onPressItem}
        content={{ documentNo, docstatus, price, description, deadline, vwamount, cAdvanceRequestId, vwstatus, payStatus, cStatementId, transDate, color }}
        index={index}
        color={color}
        isSelectItem={isSelectItem}
        onPressIcon={(indexOfIcon) => { this.onPressIcon(indexOfIcon, index, item) }}
      />
    )
  }

  render() {
    const { Firstloading, search, isSearch, isFilter, isChooseStatement } = this.state
    let statementSelected = isChooseStatement ? this.props.navigation.state.params.dataStatement : []
    let textSelectSaveSelection = (isChooseStatement && statementSelected.length > 0) ? `Lưu (${statementSelected.length})` : "Lưu"
    if (Firstloading) {
      return (
        <View style={styles.container}>
          <HeaderBtnSearch
            title="Danh sách tờ trình"
            placeholderSearch="Số chứng từ, số tiền DN..."
            search={search}
            isSearch={isSearch}
            resetDataSearch={this._resetDataSearch}
            isFilter={isFilter}
            setIsSearch={this.setIsSearch}
            setSearchHide={this.setSearchHide}
            onChangeSearch={this.onChangeSearch}
            onButtonSearch={() => { this.setIsSearch(true) }}
            onButtonSetting={() => this.DialogFilter.setModalVisible(true)}
          />
          <View style={styles.view} />
          <LoadingComponent isLoading={true} />
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
          title="Danh sách tờ trình"
          placeholderSearch="Số chứng từ, số tiền DN..."
          search={search}
          resetDataSearch={this._resetDataSearch}
          isSearch={isSearch}
          isFilter={isFilter}
          setSearchHide={this.setSearchHide}
          setIsSearch={this.setIsSearch}
          onChangeSearch={this.onChangeSearch}
          onButtonSearch={() => { this.setIsSearch(true) }}
          onButtonSetting={() => this.DialogFilter.setModalVisible(true)}
        />
        <Confirm
          ref={ref => { this.ConfirmPopup = ref }}
          title="Bạn có muốn xóa bản ghi này không ?"
          titleLeft="HUỶ"
          titleRight="ĐỒNG Ý"
          onPressLeft={() => { }}
          onPressRight={() => this.alertDelSuccess()}
        />
        <View style={styles.view}>
          <SecsionListSwipe
            useSectionList={true}
            data={this.dataStatement}
            sections={this.dataStatement}
            extraData={this.state.reRender}
            renderItem={({ item, index }) => this.renderItem({ item, index })}
            ListEmptyComponent={!this.state.refreshing && <ItemTrong title={i18n.t('NULL_DATA_SEARCH')} />}
            onEndReached={this.loadMoreData}
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

          {/* <View style={{ width: getWidth(), backgroundColor:'cyan', height: HEIGHTXD(80) }}> */}
          {isChooseStatement && statementSelected.length > 0 ?
            <TouchableOpacity
              style={styles.btIcon}
              onPress={() => {
                this.props.navigation.state.params.onPressItem(this.statementSelected)
                NavigationService.pop()

              }
              }
              underlayColor="transparent"
            >
              <View style={{ alignItems: 'center' }}>
                <FastImage source={R.images.iconSave} style={styles.icIcon} />
                <Text style={styles.txtIcon}>{textSelectSaveSelection}</Text>
              </View>
            </TouchableOpacity> : null
          }

          {/* </View> */}
        </View>
        {/* <DialogFilter
          title="Lọc tờ trình"
          ref={ref => { this.DialogFilter = ref }}
          onPressConfirm={this._onPressConfirm}
          titleStyle={styles.titleStyle}
          buttonStyle={styles.buttonStyle}
          textButtonStyle={styles.textButtonStyle}
          textButton="ĐỒNG Ý"
          data={listField}
        /> */}
        <DialogSearch
          title="Lọc tờ trình"
          ref={ref => { this.DialogFilter = ref }}
          isFilterChooseStatement={isChooseStatement}
          onPressConfirm={this._onPressConfirm}
          titleStyle={styles.titleStyle}
          buttonStyle={styles.buttonStyle}
          textButtonStyle={styles.textButtonStyle}
          textButton="ĐỒNG Ý"
          data={isChooseStatement ? listField2 : listField}
        />
        {isChooseStatement ? null :
          <ButtonAdd
            onButton={() => {
              this.props.setStatementLineID(0);
              this.props.setStatementID(0);
              NavigationService.navigate(TabAddStatement
                , {
                  callBackListStatement: (item) => {
                    this.refreshData();
                  }
                }
              );
            }
            }
            bottom={HEIGHTXD(150)}
          />
        }

      </View>
    );
  }
}


function mapStateToProps(state) {
  return {
    listInvoice: state.invoiceReducer.listInvoice,
    listInvoiceA: state,
    adOrgId: state.userReducers.userData.loggedIn.adOrgId,
    cDepartmentId: state.userReducers.userData.loggedIn.adUserDepartmentId,
  }
}
export default connect(mapStateToProps, { setStatementID, setStatementLineID, setIsHideGroupStatement, setStatusCOStatement, setStatusStatement })(ListStatement);
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
  btIcon: {
    flexDirection: 'column',
    alignItems: 'center',
    height: HEIGHTXD(200),
    backgroundColor: R.colors.white,
    justifyContent: 'space-around',
  },
  icIcon: {
    width: WIDTHXD(57),
    height: WIDTHXD(57)
  },

  txtIcon: {
    fontFamily: R.fonts.RobotoRegular,
    fontSize: getFontXD(33),
    color: R.colors.colorNameBottomMenu,
    marginTop: WIDTHXD(20)
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
