import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { HEIGHTXD } from '../../config';
import R from '../../assets/R';
import NavigationService from '../../routers/NavigationService';
import ItemNotification from './item/ItemNotification'
import { getNotificationListRequest, readNotificationRequest } from '../../apis/Functions/notification'
import { connect } from 'react-redux'
import _ from 'lodash'
import ItemTrong from '../../common/Item/ItemTrong'
import i18n from '../../assets/languages/i18n';
import { TABLE_INVOICE_GROUP_ID, TABLE_ADVANCE_REQUEST_ID, TABLE_STATEMENT_ID_2 } from '../../config/constants'
import { TabAddApInvoiceGroupStatement, TabDetailStatement, AdvanceRequestInfo } from 'routers/screenNames';
import moment from 'moment';
import { setStatementID } from '../../actions/statement'


class Notification extends React.Component {
  dataNotification = [];
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      maxResult: 10,
      sortField: "CREATED",
      sortDir: "DESC",
      refreshing: false,
      loading: true,
      reRender: false,
      showfooter: false,
    }
    this.dataNotification = []
    this.total = 0
    this.index = 0;
  }

  componentDidMount() {
    this._getDataFirst()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.refreshList !== this.props.refreshList) {
      _.forEach(this.dataNotification, (item, index) => {
        this.dataNotification[index].isRead = 1
      })
      this.setState({ reRender: !this.state.reRender })
    }

    if (nextProps.index !== this.props.index && nextProps.index === 2) {
      this._refreshData()
    }
  }

  _getDataFirst = async () => {
    let dataNotify = await this._getData()
    this.index = dataNotify.data.data.length
    this.dataNotification = dataNotify.data.data
    this.setState({ loading: false, refreshing: false })
  }

  _refreshData = async () => {
    this.index = 0
    this.setState({
      refreshing: true
    })
    this._getDataFirst()
  }

  _getData = async () => {
    const { maxResult, sortDir, sortField } = this.state;
    const body = { userId: this.props.userData.adUserId, start: this.index, maxResult, sortDir, sortField }
    const response = await getNotificationListRequest(body);
    return response;
  }

  loadMoreData = async () => {
    this.setState({ loading: true, showfooter: true }, async () => {
      let response = await this._getData()
      console.log('reponse notifi', response)
      if (response.data) {
        this.index += response.data.data.length
        let dataConvert = this.dataNotification.concat(response.data.data)
        this.dataNotification = dataConvert;
      }
      this.setState({ loading: false, showfooter: false })
    })
  }

  _onPressItem = (item, index) => {
    if (item.isRead === 0) {
      this._readNotify(item.notificationId, item.userId, index)
    }
    if (item.adTableId && item.recordId) {
      switch (item.adTableId) {
        case TABLE_STATEMENT_ID_2:
          this.props.setStatementID(item.recordId)
          NavigationService.navigate(TabDetailStatement, { cStatementId: item.recordId });
          break
        case TABLE_ADVANCE_REQUEST_ID:
          NavigationService.navigate(AdvanceRequestInfo, { id: item.recordId });
          break
        case TABLE_INVOICE_GROUP_ID:
          NavigationService.navigate(TabAddApInvoiceGroupStatement, { id: item.recordId, docStatus: '', keyItem: '' });
          break
      }
    }
  }

  _goToProfile = () => {
    NavigationService.navigate('Profile')
  }

  /**
   * mark notification as read
   */
  _readNotify = async (notificationId, userId, index) => {
    let body = {
      userId,
      notificationId
    }
    const response = await readNotificationRequest(body)
    if (response && response.status === 200) {
      this.dataNotification[index].isRead = 1
      this.setState({
        reRender: !this.state.reRender
      })
    }
  }

  renderFooter = () => (
    this.state.showfooter ? (
      <View style={{ height: HEIGHTXD(110) }}>
        <ActivityIndicator animating color="#1C1C1C" size="large" />
      </View>) : (
        <View style={{ height: HEIGHTXD(110) }} />)
  )

  _renderItem = (item, index) => {
    let sourceIcon = R.images.iconAvatarNoti
    let textNotify = ''
    switch (item.adTableId) {
      case TABLE_STATEMENT_ID_2:
        sourceIcon = R.images.toTrinh;
        textNotify = `Tờ trình số ${item.documentNo}`
        break
      case TABLE_INVOICE_GROUP_ID:
        sourceIcon = R.images.bangTHTT;
        textNotify = `BTHTT số ${item.documentNo}`
        break
      case TABLE_ADVANCE_REQUEST_ID:
        sourceIcon = R.images.deNghi;
        textNotify = `ĐNTT số ${item.documentNo}`
        break
    }
    let status = ''
    switch (item.type) {
      case 0:
        if (item.adTableId === TABLE_INVOICE_GROUP_ID) {
          _.forEach(R.strings.local.APPROVE_STATUS_INVOICE_GROUP_FILTER, (itemAprrove) => {
            if (itemAprrove.value === item.status) {
              status = `${itemAprrove.name} ngày ${moment(item.created).format('DD/MM/YYYY')}`
            }
          })
        } else {
          _.forEach(R.strings.local.TRANG_THAI_DUYET_ADVANCE_REQUEST, (itemAprrove) => {
            if (itemAprrove.value === item.status) {
              status = `${itemAprrove.name} ngày ${moment(item.created).format('DD/MM/YYYY')}`
            }
          })
        }
        break
      case 1:
        _.forEach(R.strings.local.TRANG_THAI_CHI, (itemPay) => {
          if (itemPay.value === item.status) {
            status = `${itemPay.name} ngày ${moment(item.created).format('DD/MM/YYYY')}`
          }
        })
        break
      case 2:
        status = 'Đã quá hạn thanh toán'
        break
    }
    let time = moment(item.created).format('HH:mm - DD/MM/YYYY')
    let content = {
      notificationId: item.notificationId,
      type: item.type,
      statusContent: status,
      contentFull: item.contentFull,
      description: item.description,
      userId: item.userId,
      isRead: item.isRead,
      textNotify: textNotify,
      created: time,
      price: item.approveAmount,
      adOrgId: item.adOrgId,
      adTableId: item.adTableId,
      recordId: item.recordId,
    }
    return <ItemNotification
      item={content} index={index}
      sourceIcon={sourceIcon}
      onPressItem={(item, index) => this._onPressItem(item, index)} />
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.dataNotification}
          renderItem={({ item, index }) =>
            this._renderItem(item, index)}
          style={styles.flatList}
          extraData={this.state}
          ListFooterComponent={() => <View style={{ height: HEIGHTXD(26) }} />}
          ListEmptyComponent={!this.state.refreshing && <ItemTrong title={i18n.t('NULL_DATA_SEARCH')} />}
          onRefresh={this._refreshData}
          refreshing={this.state.refreshing}
          onEndReached={this.loadMoreData.bind(this)}
          ListFooterComponent={this.renderFooter}
          onEndReachedThreshold={0.1}
        />
      </View>
    )
  }
}


function mapStateToProps(state) {
  return {
    userData: state.userReducers.userData.loggedIn,
  }
}
export default connect(mapStateToProps, { setStatementID })(Notification);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: R.colors.blueGrey51,

  },
  flatList: {
    flex: 0,
    backgroundColor: R.colors.blueGrey51,
    paddingBottom: HEIGHTXD(3),
    paddingTop: HEIGHTXD(26)
  }
})
