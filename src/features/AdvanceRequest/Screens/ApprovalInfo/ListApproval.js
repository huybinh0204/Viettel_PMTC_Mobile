import React, { Component } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux'
import _ from 'lodash';
import i18n from '../../../../assets/languages/i18n';
import AdvanceRequest from '../../../../apis/Functions/advanceRequest';
import Confirm from '../../../../common/ModalConfirm/Confirm';
import { showAlert, TYPE } from '../../../../common/DropdownAlert';
import { LoadingComponent } from '../../../../common/Loading/LoadingComponent';
import ItemStatement from './ItemApprovall';
import { HEIGHTXD, getFontXD, WIDTHXD } from '../../../../config';
import ItemTrong from '../../../../common/Item/ItemTrong'
import ButtonAdd from '../../../../common/Button/ButtonAdd';
import { showLoading, hideLoading } from '../../../../common/Loading/LoadingModal'
import R from '../../../../assets/R';
import global from '../../global'

class InfomationDetails extends Component {
  constructor(props) {
    super(props);
    this.onEndReachedCalledDuringMomentum = true;
    this.state = {
      tabActive: 3,
      refreshing: false,
      showfooter: false,
      idSelected: 0,
      item: {},
      index: 0,
      isCreate: false,
      search: '',
      loading: false,
      Firstloading: false,
      isLoadingFooter: false,
      showModal: false,
      isLoading: false,
      bodyFilter: {},
      showDetail: false,
      titleHeader: 'Đề Nghị Thanh Toán',
      dataApproval: [],
      dataDetail: {},
    }
    this.oldSearch = ''
    this.titlePopup = ''
  }

  renderItem = ({ item, index }: Object, d: Array<Object>) => {
    let { approveStatus, email, cAdvanceRequestId, cApprovalAdvanceRequestId, no, cDepartmentName } = item;
    return (
      <View style={{ paddingBottom: HEIGHTXD(24) }}>
        <ItemStatement
          index={index}
          color={this.props.color}
          content={{ approveStatus, email, cAdvanceRequestId, cApprovalAdvanceRequestId, no, cDepartmentName }}
          onSuccess={this._onSuccess}
          onDelete={this._onDelete}
          onPressIcon={(indexOfIcon) => { this.onPressIcon(indexOfIcon, index, item) }}
        />
      </View>
    )
  }

  componentDidMount() {
    if (this.props.id) {
      this.refreshData()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.id !== this.props.id) {
      this._getListDataApproval(nextProps.id)
    }
    if ((nextProps.filter !== this.props.filter) && (nextProps.tabActive === this.state.tabActive)) {
      showLoading()
      this._searchData(0, '', nextProps.filter)
    }
    if ((this.props.keyword !== nextProps.keyword) && (nextProps.tabActive === this.state.tabActive)) {
      showLoading()
      this._searchData(0, nextProps.keyword.trim())
    }
  }

  _updateItem = (item) => {
    this.refreshData()
  }

  _getListDataApproval = async (id) => {
    const body = {
      approveStatus: '0',
      cAdvanceRequestId: id,
      approveDate: null,
      cDepartmentId: null,
      start: 0,
      maxResult: 10,
      sortField: 'TRANS_DATE',
      sortDir: 'DESC',
    }
    const response = await AdvanceRequest.getListApproval(body)
    if (response && response.status === 200) {
      this.setState({ dataApproval: response.data.data })
    }
  }

  _getData = async (start, email, filter) => {
    const body = {
      approveStatus: '0',
      cAdvanceRequestId: this.props.id,
      approveDate: null,
      email,
      cDepartmentId: null,
      start,
      maxResult: 10,
      sortField: 'TRANS_DATE',
      sortDir: 'DESC',
    }
    if (filter) {
      _.forEach(filter, (item) => {
        body[item.key] = item.value
      })
    }
    let response = await AdvanceRequest.getListApproval(body)
    return response
  }

  refreshData = async () => {
    this.setState({ refreshing: true })
    let res = await this._getData(0, '');
    if (res.data.data) {
      this.setState({ dataApproval: res.data.data })
    }
    this.setState({ refreshing: false, Firstloading: false })
  }

  _searchData = async (start, keyword, filter) => {
    this.setState({ refreshing: true }, async () => {
      let res = await this._getData(start, keyword, filter);
      if (res.data.data) {
        this.setState({ dataApproval: res.data.data })
      }
      this.setState({ refreshing: false, Firstloading: false })
    })
    hideLoading()
  }

  loadMoreData = async () => {
    let { search, dataApproval } = this.state;
    this.setState({ loading: true, showfooter: true }, async () => {
      let response = await this._getData(this.state.dataApproval.length, search)
      if (response.data.data) {
        this.setState({ dataApproval: [...dataApproval, ...response.data.data] })
      }
      this.setState({ loading: false, showfooter: false })
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
    let res = await AdvanceRequest.deleteItemDepartmentApproval(idSelected);
    if (res) {
      this.state.dataApproval = this.state.dataApproval.filter(item => item.cApprovalAdvanceRequestId !== idSelected)
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
      const response = await AdvanceRequest.duplicateItemDepartmentApproval(this.state.idSelected);
      if (response && response.status === 200) {
        this.state.dataApproval.splice(this.state.index + 1, 0, response.data)
        this.setState({ refreshing: false, item: {} })
        showAlert(TYPE.SUCCESS, 'Thông báo', 'Nhân đôi bản ghi thành công')
      } else {
        this.setState({ refreshing: false })
        showAlert(TYPE.ERROR, 'Thông báo', 'Nhân đôi bản ghi thất bại')
      }
    } catch (error) {
      this.setState({ refreshing: false })
      showAlert(TYPE.ERROR, 'Thông báo', 'Nhân đôi bản ghi thất bại')
    }
  }

  _onPressAlert = () => {
    if (this.state.index !== -1) {
      this._duplicateItem()
    } else {
      this._deleteItem()
    }
  }

  onPressIcon = (indexOfIcon, index, item) => {
    if (indexOfIcon === 2) {
      this.titlePopup = 'Bạn có muốn xóa bản ghi này không ?'
      this.setState({ idSelected: item.cApprovalAdvanceRequestId, index: -1 })
      this.ConfirmPopup.setModalVisible(true);
    }
    if (indexOfIcon === 0) {
      this.titlePopup = 'Bạn có muốn nhân đôi bản ghi này không ?'
      this.setState({ idSelected: item.cApprovalAdvanceRequestId, item, index })
      this.ConfirmPopup.setModalVisible(true);
    }
    if (indexOfIcon === 1) {
      this._getDetailApproval(item.cApprovalAdvanceRequestId)
    }
    if (indexOfIcon === -1) {
      this.props.navigation.navigate('ItemDetail', { detail: {}, updateItem: this._updateItem, adOrgId: this.props.adOrgId, adUserId: this.props.adUserId, length: this.state.dataApproval.length })
    }
    if (indexOfIcon === 4) {
      this._getDetailApproval(item.cApprovalAdvanceRequestId)
    }
  }

  _getDetailApproval = async (id) => {
    try {
      const response = await AdvanceRequest.getItemDepartmentApproval(id);
      if (response && response.status === 200) {
        this.setState({ dataDetail: response.data },
          () => {
            this.props.navigation.navigate('ItemDetail', { detail: response.data, updateItem: this._updateItem, adOrgId: this.props.adOrgId, adUserId: this.props.adUserId })
            this.props.returnData({ activeMenu: global.SHOW_BOTTOM_MENU, indexIcon: global.HIDE_ICON, toDetail: true })
          })
      }
    } catch (error) {
      //
    }
  }

  render() {
    const { Firstloading } = this.state
    if (Firstloading) {
      return (
        <View style={styles.container}>
          <View style={styles.view} />
          <LoadingComponent isLoading={true} />
        </View>
      )
    }
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
        <FlatList
          style={{ paddingTop: HEIGHTXD(24) }}
          data={this.state.dataApproval}
          extraData={this.state.dataApproval}
          onMomentumScrollBegin={() => {
            if (!this.state.loading) {
              this.setState({ showfooter: true }, () => this.loadMoreData());
            }
          }}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => this.renderItem({ item, index })}
          ListEmptyComponent={!this.state.refreshing && !this.state.loading && <ItemTrong />}
          ListFooterComponent={this.renderFooter}
          onRefresh={this.refreshData}
          refreshing={this.state.refreshing}
          onEndReachedThreshold={0.5}
        />
        <ButtonAdd
          onButton={() => {
            this.onPressIcon(-1)
            this.props.returnData({ activeMenu: global.SHOW_BOTTOM_MENU, indexIcon: global.HIDE_ICON, toDetail: true })
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
    filter: state.advanceRequestReducer.filter,
    tabActive: state.advanceRequestReducer.tabActive,
    adOrgId: state.userReducers.userData.loggedIn.adOrgId,
    adUserId: state.userReducers.userData.adUserId,
  }
}
export default connect(mapStateToProps, {})(InfomationDetails);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: R.colors.blueGrey51,
    // paddingTop: WIDTHXD(24)
  },
  item: {
    marginTop: HEIGHTXD(50),
  },
  title: {
    fontSize: getFontXD(42),
    fontFamily: R.fonts.MontserratMedium
  },
});
