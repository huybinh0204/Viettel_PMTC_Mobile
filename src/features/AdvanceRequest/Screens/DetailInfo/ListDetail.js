import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { connect } from 'react-redux'
import moment from 'moment';
import i18n from '../../../../assets/languages/i18n';
import AdvanceRequest from '../../../../apis/Functions/advanceRequest';
import Confirm from '../../../../common/ModalConfirm/Confirm';
import { showAlert, TYPE } from '../../../../common/DropdownAlert';
import { LoadingComponent } from '../../../../common/Loading/LoadingComponent';
import ItemInvoice from './ItemDetail';
import { HEIGHTXD, getFontXD, getWidth, getHeight, WIDTHXD, getLineHeightXD, convertDataInvoice, timeFormat } from '../../../../config';
import ItemTrong from '../../../../common/Item/ItemTrong'
import ButtonAdd from '../../../../common/Button/ButtonAdd';
import R from '../../../../assets/R';
import { updateRequestAmount, updateListAdvanceRequest } from '../../../../actions/advanceRequest'
import SecsionListSwipe from '../../../../common/Swipe/SecsionListSwipe'
import { showLoading, hideLoading } from '../../../../common/Loading/LoadingModal'
import global from '../../global'

class InfomationDetails extends Component {
  details = []

  constructor(props) {
    super(props);
    this.state = {
      showDetail: false,
      refreshing: false,
      showfooter: false,
      idSelected: 0,
      item: {},
      index: 1,
      indexOfIcon: '',
      isCreate: false,
      reRender: false,
      isSearch: false,
      search: '',
      loading: false,
      Firstloading: false,
      dataDetail: {},
      details: [],
      isUpdate: false,
      requestAmount: 0,
      id: 0,
      color: null
    }

    this.titlePopup = ''
    this.oldSearch = ''
    this.index = 0;
    this.indexOfItem = '0.0'
    this.maxData = 0
  }

  componentDidMount() {
    const { id } = this.props
    if (id) {
      this._getListDetail(id)
      showLoading()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.id !== this.props.id) {
      this._getListDetail(nextProps.id)
    }
    if ((nextProps.keyword !== this.props.keyword) && (nextProps.tabActive === this.state.index)) {
      this._searchData(0, nextProps.keyword.trim())
    }
  }

  _updateItem = () => {
    this.refreshData()
  }

  _getListDetail = async (id) => {
    const body = {
      cAdvanceRequestId: id,
      start: 0,
      maxResult: 10,
      sortField: 'TRANS_DATE',
      sortDir: 'DESC',
      description: ''
    }
    const response = await AdvanceRequest.getListDetailAdvanceRequest(body)
    if (response && response.status === 200) {
      this.details = convertDataInvoice([], response.data.data)
      this.setState({ Firstloading: false })
    }
    hideLoading()
  }

  _getData = async (start, keyword) => {
    const { id } = this.props
    const body = {
      cAdvanceRequestId: id,
      start: start || 0,
      maxResult: 10,
      sortField: 'TRANS_DATE',
      sortDir: 'DESC',
      searchKey: keyword
    }
    const response = await AdvanceRequest.getListDetailAdvanceRequest(body)
    return response
  }

  _getDeatailLine = async (id) => {
    const response = await AdvanceRequest.getDetailLineAdvanceRequest(id);
    return response;
  }

  refreshData = async () => {
    this.setState({ refreshing: true }, async () => {
      let res = await this._getData(0, '');
      if (res.data.data) {
        this.index = res.data.data.length
        this.details = convertDataInvoice([], res.data.data)
        this.setState({ refreshing: false })
      } else {
        this.setState({ refreshing: false })
      }
    })
  }

  _searchData = async (start, keyword) => {
    this.setState({ refreshing: true }, async () => {
      let res = await this._getData(start, keyword);
      if (res.data.data) {
        this.index = res.data.data.length
        this.details = convertDataInvoice([], res.data.data)
        this.setState({ refreshing: false, Firstloading: false })
      } else {
        this.setState({ refreshing: false, Firstloading: false })
      }
    })
  }

  loadMoreData = async () => {
    let { search } = this.state;
    this.setState({ loading: true, showfooter: true }, async () => {
      let response = await this._getData(this.index, search)
      if (response.data.data) {
        this.index += response.data.data.length
        this.details = convertDataInvoice(this.details, response.data.data)
        this.setState({ loading: false, showfooter: false })
      } else {
        this.setState({ loading: false, showfooter: false })
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

  _duplicateDetailLine = async (id) => {
    try {
      this.setState({ refreshing: true })
      const response = await AdvanceRequest.duplicateDetailLineAdvanceRequest(id);
      if (response && response.status === 200) {
        this.refreshData()
        this.props.updateRequestAmount(this.props.requestAmount + response.data.requestAmount)
        this.props.updateListAdvanceRequest()
        this.setState({ refreshing: false, item: {}, isUpdate: true })
        showAlert(TYPE.SUCCESS, 'Thông báo', 'Nhân đôi bản ghi thành công')
      } else {
        this.setState({ refreshing: false });
        showAlert(TYPE.ERROR, 'Thông báo', 'Nhân đôi bản ghi thất bại')
      }
    } catch (err) {
      this.setState({ refreshing: false });
      showAlert(TYPE.ERROR, 'Thông báo', 'Nhân đôi bản ghi thất bại')
    }
  }

  _onPressAlert = async () => {
    if (this.state.indexOfIcon === 1) {
      this._deleteDetailLine()
    } else {
      this._duplicateDetailLine(this.state.id)
    }
  }

  _viewDetailLine = async (item) => {
    const response = await this._getDeatailLine(item)
    console.log('DETAIL LINE---', response)
    if (response && response.status === 200) {
      this.setState({ dataDetail: response.data, isCreate: false },
        () => {
          this.props.navigation.navigate('DetailedInvoice', { dataDetail: this.state.dataDetail, updateItem: this._updateItem, adOrgId: this.props.adOrgId, adUserId: this.props.adUserId })
          this.props.returnData({ activeMenu: global.SHOW_BOTTOM_MENU, indexIcon: global.SHOW_ICON_EYE, toDetail: true })
        })
    }
  }

  _onPressIcon = (indexOfIcon, indexOfItem) => {
    const [section] = indexOfItem.split('.');
    const newData = [...this.details];
    const prevIndex = this.details[section].data.findIndex(
      items => items.key === indexOfItem
    );
    if (indexOfIcon === 1) {
      this._viewDetailLine(newData[section].data[prevIndex].cAdvanceRequestLineId)
    } else if (indexOfIcon === 2) {
      this.titlePopup = 'Bạn có muốn xóa bản ghi này không ?'
      this.setState({ idSelected: newData[section].data[prevIndex].cAdvanceRequestLineId, indexOfIcon: 1 })
      this.indexOfItem = indexOfItem
      this.ConfirmPopup.setModalVisible(true);
    } else {
      this.titlePopup = 'Bạn có muốn nhân đôi bản ghi này không ?'
      this.setState({ indexOfIcon: 0, id: newData[section].data[prevIndex].cAdvanceRequestLineId })
      this.ConfirmPopup.setModalVisible(true);
    }
  }

  _deleteDetailLine = async () => {
    let { idSelected } = this.state;
    this.setState({ refreshing: true });
    let res = await AdvanceRequest.deleteDeatailadvanceRequest(idSelected);
    if (res) {
      this.props.updateListAdvanceRequest()
      let requestAmountDelete = 0
      const [section] = this.indexOfItem.split('.');
      this.details[section].data.filter(item => {
        if (item.cAdvanceRequestLineId === idSelected) {
          requestAmountDelete = item.requestAmount
        }
      })
      const newData = [...this.details];
      const prevIndex = this.details[section].data.findIndex(
        items => items.key === this.indexOfItem
      );
      if (newData[section].data.length > 1) {
        newData[section].data.splice(prevIndex, 1);
      } else {
        newData[section] = { title: '', data: [] }
      }
      this.details = newData
      this.setState({ refreshing: false, isUpdate: true });
      this.props.updateRequestAmount(this.props.requestAmount - requestAmountDelete)
      showAlert(TYPE.SUCCESS, i18n.t('NOTIFICATION_T'), i18n.t('Delete_successful'))
    } else {
      this.setState({ refreshing: false });
      showAlert(TYPE.ERROR, i18n.t('NOTIFICATION_T'), i18n.t('Delete_failed'))
    }
  }

  renderItem = ({ item, index }) => {
    let day = item.transDate ? moment(item.transDate, timeFormat).format('D') : ''
    let month = item.transDate ? moment(item.transDate, timeFormat).format('M') : ''
    let year = item.transDate ? moment(item.transDate, timeFormat).format('YYYY') : ''
    let content = {
      name: item.description,
      id: item.cAdvanceRequestLineId,
      price: item.requestAmount,
    }
    return (
      <ItemInvoice
        isShowMonth={item.isShowMonth}
        color={this.props.color}
        time={{ day, month, year }}
        content={content}
        index={index}
        onPressIcon={(id) => this._viewDetailLine(id)}
      />
    )
  }

  render() {
    const renderSectionHeader = ({ section }) => {
      if (section.title === '' || !section.title) return []
      return (<Text style={styles.txtMonth}>{section.title}</Text>)
    };
    return (
      <View style={styles.container}>
        <Confirm
          ref={ref => { this.ConfirmPopup = ref }}
          title={this.titlePopup}
          titleLeft="HUỶ"
          titleRight="ĐỒNG Ý"
          onPressLeft={() => { }}
          onPressRight={() => this._onPressAlert()}
        />
        <SecsionListSwipe
          useSectionList={true}
          data={this.details}
          sections={this.details}
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
          onPressIcon={(indexOfIcon, indexOfItem) => { this._onPressIcon(indexOfIcon, indexOfItem) }}
          listIcons={[R.images.iconCoppy, R.images.iconEdit, R.images.iconDelete]}
          widthListIcon={WIDTHXD(387)}
          rightOfList={WIDTHXD(30)}
          styleOfIcon={{}}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={renderSectionHeader}
        />
        <ButtonAdd
          onButton={() => {
            this.props.navigation.navigate('DetailedInvoice', { dataDetail: {}, updateItem: this._updateItem, adOrgId: this.props.adOrgId, adUserId: this.props.adUserId })
            this.props.returnData({ activeMenu: global.SHOW_BOTTOM_MENU, indexIcon: global.SHOW_ICON_EYE, toDetail: true })
          }}
          bottom={HEIGHTXD(150)}
        />
      </View>
    );
  }
}
function mapStateToProps(state) {
  return {
    keyword: state.advanceRequestReducer.keyword,
    tabActive: state.advanceRequestReducer.tabActive,
    requestAmount: state.advanceRequestReducer.requestAmount,
    adOrgId: state.userReducers.userData.loggedIn.adOrgId,
    adUserId: state.userReducers.userData.adUserId,
  }
}
export default connect(mapStateToProps, { updateListAdvanceRequest, updateRequestAmount })(InfomationDetails);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: R.colors.blueGrey51,
    paddingBottom: 0,
    marginBottom: 0
  },
  f1: {
    flex: 1,
    backgroundColor: R.colors.blueGrey51,
    paddingBottom: 0,
    marginBottom: 0
  },
  view: {
    width: getWidth(),
    flex: 1,
    height: getHeight() - HEIGHTXD(20),
    backgroundColor: R.colors.blueGrey51,
    paddingTop: HEIGHTXD(30),
    paddingBottom: 0,
    marginBottom: 0
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
    fontFamily: R.fonts.RobotoMedium,
  },
})
