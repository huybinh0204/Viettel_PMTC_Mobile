import React, { Component } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux'
import _ from 'lodash';
import i18n from '../../../../assets/languages/i18n';
import InvoiceGroupRequest from '../../../../apis/Functions/apInvoiceGroupStatement';
import { LoadingComponent } from '../../../../common/Loading/LoadingComponent';
import ItemStatement from './ItemPayInfo';
import { HEIGHTXD, getFontXD, getWidth, getHeight } from '../../../../config';
import ItemTrong from '../../../../common/Item/ItemTrong'
import R from '../../../../assets/R';
import global from '../../global'

class InfomationDetails extends Component {
  constructor(props) {
    super(props);
    this.onEndReachedCalledDuringMomentum = true;
    this.state = {
      tabActive: 4,
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
      titleHeader: '',
      dataPayInfo: [],
      dataPayInfoTmp: [],
      dataDetail: [],
    }
    this.oldSearch = ''
    this.titlePopup = ''
  }

  renderItem = ({ item, index }: Object, d: Array<Object>) => {
    let content = {
      documentNo: item.apInvoiceDocumentNo,
      descriptionLine: item.description,
      amtAcct: item.amountDisplay,
      status: item.accountingDate,
      dateAcct: item.accountingDate,
    }
    return (
      <ItemStatement
        index={index}
        content={content}
        onPressIcon={(indexOfIcon) => { this.onPressIcon(indexOfIcon, index, item) }}
      />
    )
  }

  componentDidMount() {
    if (this.props.id) {
      this.refreshData();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.id !== this.props.id) {
      this._getListPayInfo(nextProps.id)
    }
    if (nextProps.filter !== this.props.filter) {
      this._search(this.props.keyword, nextProps.filter)
    }
    if (this.props.keyword !== nextProps.keyword) {
      this._search(nextProps.keyword, this.props.filter)
    }
  }

  _getListPayInfo = async (id) => {
    const body = {
      cAdvanceRequestId: id,
      documentNo: null,
      description: null,
      cDocumentTypeId: null,
      maxResult: 100,
      start: 0,
      status: 'N'
    }
    const response = await InvoiceGroupRequest.paymentInfoOfInvoiceGroup(body)
    if (response && response.status === 200) {
      this.setState({ dataPayInfo: response.data, dataPayInfoTmp: response.data })
    }
  }
  _search = (keyword, filter) => {
    let dataTmp = []
    let valueFilter = ''
    _.forEach(filter, (item) => {
      valueFilter = item.value
    })
    if (valueFilter) {
      dataTmp = this.state.dataPayInfoTmp.filter(item => (item.apInvoiceDocumentNo.includes(keyword) || item.description.includes(keyword) || item.amount.toString() === keyword) && item.accountingStatus === valueFilter)
    } else {
      dataTmp = this.state.dataPayInfoTmp.filter(item => item.apInvoiceDocumentNo.includes(keyword) || item.description.includes(keyword) || item.amount.toString() === keyword)
    }
    this.setState({ dataPayInfo: dataTmp })
  }


  _getData = async (start, documentNo, filter) => {
    const body = {
      cAdvanceRequestId: this.props.id,
      // apInvoiceGroupId: 112168,
      // start,
    }
    // if (filter) {
    //   _.forEach(filter, (item) => {
    //     body[item.key] = item.value
    //   })
    // }
    let response = await InvoiceGroupRequest.paymentInfoOfInvoiceGroup(body)
    return response
  }

  refreshData = async () => {
    this.setState({ refreshing: true }, async () => {
      let res = await this._getData(0, '');
      if (res.data) {
        this.setState({ dataPayInfo: res.data, dataPayInfoTmp: res.data })
      }
      this.setState({ refreshing: false, Firstloading: false })
    })
    this.setState({ refreshing: false, Firstloading: false })
  }

  _searchData = async (start, keyword, filter) => {
    this.setState({ refreshing: true }, async () => {
      let res = await this._getData(start, keyword, filter);
      if (res.data) {
        this.setState({ dataPayInfo: res.data, refreshing: false, })
      } else {
        this.setState({ refreshing: false, Firstloading: false })
      }
      this.setState({ refreshing: false, Firstloading: false })
    })
  }

  loadMoreData = async () => {
    let { search } = this.state;
    this.setState({ loading: true, showfooter: true }, async () => {
      let response = await this._getData(this.state.dataPayInfo.length, search)
      if (response.data) {
        this.setState({ dataPayInfo: response.data })
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

  onPressIcon = (indexOfIcon, index, item) => {
    this.setState({ isCreate: false, dataDetail: item })
    this.props.navigation.navigate('DetailedPayInfo', { dataDetail: item })
    this.props.returnData({ activeMenu: global.HIDE_BOTTOM_MENU, indexIcon: global.HIDE_ICON, toDetail: true })
  }

  // _getDetailApproval = async (id) => {
  //   try {
  //     const response = await InvoiceGroupRequest.getItemDepartmentApproval(id);
  //     if (response && response.status === 200) {
  //       this.setState({ dataDetail: response.data }, () => this.props.isCreateApproval({ isCreate: false, item: response.data }))
  //     }
  //   } catch (error) {
  //     //
  //   }
  // }

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
        <View style={styles.f1}>
          <View style={styles.view}>
            <FlatList
              data={this.state.dataPayInfo}
              extraData={this.state.dataPayInfo}
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
          </View>
        </View>

      </View>
    );
  }
}
function mapStateToProps(state) {
  return {
    keyword: state.advanceRequestReducer.keyword,
    filter: state.invoiceGroupReducer.filter,
    tabActive: state.advanceRequestReducer.tabActive,
  }
}
export default connect(mapStateToProps, {})(InfomationDetails);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  f1: {
    flex: 1,
    backgroundColor: R.colors.blueGrey51,
  },
  view: {
    width: getWidth(),
    flex: 1,
    height: getHeight() - HEIGHTXD(20),
    backgroundColor: R.colors.blueGrey51,
    paddingTop: HEIGHTXD(30),
  },
  item: {
    marginTop: HEIGHTXD(50),
  },
  title: {
    fontSize: getFontXD(42),
    fontFamily: R.fonts.MontserratMedium
  },
});
