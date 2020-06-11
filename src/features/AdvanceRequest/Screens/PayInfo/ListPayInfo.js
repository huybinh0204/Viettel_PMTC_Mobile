import React, { Component } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux'
import _ from 'lodash';
import i18n from '../../../../assets/languages/i18n';
import AdvanceRequest from '../../../../apis/Functions/advanceRequest';
import { LoadingComponent } from '../../../../common/Loading/LoadingComponent';
import ItemStatement from './ItemPayInfo';
import { HEIGHTXD, getFontXD, getWidth, getHeight } from '../../../../config';
import ItemTrong from '../../../../common/Item/ItemTrong'
import { showLoading, hideLoading } from '../../../../common/Loading/LoadingModal'
import R from '../../../../assets/R';
import global from '../../global';

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
      titleHeader: 'Đề Nghị Thanh Toán',
      dataPayInfo: [],
      dataDetail: [],
    }
    this.oldSearch = ''
    this.titlePopup = ''
  }

  renderItem = ({ item, index }: Object, d: Array<Object>) => {
    let { documentNo, descriptionLine, amtAcct, status, dateAcct } = item;
    return (
      <ItemStatement
        index={index}
        content={{ documentNo, descriptionLine, amtAcct, status, dateAcct }}
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
    if ((nextProps.filter !== this.props.filter) && (nextProps.tabActive === this.state.tabActive)) {
      showLoading()
      this._searchData(0, '', nextProps.filter)
    }
    if ((this.props.keyword !== nextProps.keyword) && (nextProps.tabActive === this.state.tabActive)) {
    }
  }

  _getListPayInfo = async (id) => {
    const body = {
      cAdvanceRequestId: id,
      documentNo: null,
      description: null,
      cDocumentTypeId: null,
      maxResult: 10,
      start: 0,
      status: 'N'
    }
    const response = await AdvanceRequest.getListPayIndo(body)
    if (response && response.status === 200) {
      this.setState({ dataPayInfo: response.data })
    }
  }


  _getData = async (start, documentNo, filter) => {
    const body = {
      cAdvanceRequestId: this.props.id,
      documentNo: null,
      description: null,
      cDocumentTypeId: null,
      maxResult: 10,
      start,
      status: 'N'
    }
    if (filter) {
      _.forEach(filter, (item) => {
        body[item.key] = item.value
      })
    }
    let response = await AdvanceRequest.getListPayIndo(body)
    return response
  }

  refreshData = async () => {
    this.setState({ refreshing: true }, async () => {
      let res = await this._getData(0, '');
      if (res.data) {
        this.setState({ dataPayInfo: res.data })
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
    hideLoading()
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

  _getDetailApproval = async (id) => {
    try {
      const response = await AdvanceRequest.getItemDepartmentApproval(id);
      if (response && response.status === 200) {
        this.setState({ dataDetail: response.data }, () => this.props.isCreateApproval({ isCreate: false, item: response.data }))
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
    filter: state.advanceRequestReducer.filter,
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
