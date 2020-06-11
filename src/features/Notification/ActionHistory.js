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
import ItemActionHistory from './item/ItemActionHistory'
import { getActionHistory } from '../../apis/Functions/notification'
import { connect } from 'react-redux'
import _ from 'lodash'
import ItemTrong from '../../common/Item/ItemTrong'
import i18n from '../../assets/languages/i18n';
import { TABLE_INVOICE_GROUP_ID, TABLE_ADVANCE_REQUEST_ID, TABLE_STATEMENT_ID_2, TABLE_INVOICE_ID, TABLE_DOCUMENT_SIGN_ID } from '../../config/constants'
import { TabAddApInvoiceGroupStatement, TabDetailStatement, AdvanceRequestInfo, DetailInvoice, CreateVOffice } from 'routers/screenNames';
import moment from 'moment';
import { setStatementID } from '../../actions/statement'

class ActionHistory extends React.Component {
  dataNotification = [];
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
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
    const body = { start: this.index, end: this.index + 10 }
    const response = await getActionHistory(body);
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
        case TABLE_INVOICE_ID:
          NavigationService.navigate(DetailInvoice, { idInvoice: item.recordId, refreshData: () => { } })
          break
        case TABLE_DOCUMENT_SIGN_ID:
          NavigationService.navigate(CreateVOffice, {
            cDocumentsignId: item.recordId,
            isEdit: true,
            viewOnly: true
          })
          break
      }
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
    let documentNo = ''
    switch (item.adTableId) {
      case TABLE_STATEMENT_ID_2:
        sourceIcon = R.images.toTrinh;
        documentNo = `Tờ trình số ${item.documentNo}`
        break
      case TABLE_INVOICE_GROUP_ID:
        sourceIcon = R.images.bangTHTT;
        documentNo = `BTHTT số ${item.documentNo}`
        break
      case TABLE_ADVANCE_REQUEST_ID:
        sourceIcon = R.images.deNghi;
        documentNo = `Đề nghị thanh toán số ${item.documentNo}`
        break
      case TABLE_INVOICE_ID:
        sourceIcon = R.images.hoaDon;
        documentNo = `Hoá đơn`
        break
      case TABLE_DOCUMENT_SIGN_ID:
        sourceIcon = R.images.iconSubmitdActive;
        documentNo = `Trình ký VOffice số ${item.documentNo}`
        break
    }
    let time = moment(item.updated).format('HH:mm - DD/MM/YYYY')
    let content = {
      userId: item.userId,
      documentNo: documentNo,
      updated: time,
      adOrgId: item.adOrgId,
      adTableId: item.adTableId,
      recordId: item.recordId,
      description: item.description,
    }
    return <ItemActionHistory
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
export default connect(mapStateToProps, { setStatementID })(ActionHistory);

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
