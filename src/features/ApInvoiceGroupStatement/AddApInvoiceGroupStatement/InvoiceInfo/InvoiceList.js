import React, { PureComponent } from 'react'
import { View, StyleSheet, ActivityIndicator, FlatList } from 'react-native'
import ButtonAdd from '../../../../common/Button/ButtonAdd'
import { WIDTHXD, HEIGHTXD, getWidth, getHeight, getFontXD, mapTimeVNToWorld } from '../../../../config';
import R from '../../../../assets/R';
import ItemTrong from '../../../../common/Item/ItemTrong';
import ItemInvoice from './ItemView/item';
import moment from 'moment';
import NavigationService from '../../../../routers/NavigationService';
import { ListInvoice, CreateInvoice, DetailInvoice } from 'routers/screenNames';
import ApInvoiceGroupStatement from '../../../../apis/Functions/apInvoiceGroupStatement'
import { connect } from 'react-redux';
import FlatListSwipe from '../../../../common/Swipe/FlatListSwipe'
import { showAlert, TYPE } from '../../../../common/DropdownAlert';
class InvoiceList extends PureComponent {
  ConfirmPopup = {

  };
  dataInvoice = []
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      showfooter: false,
      idSelected: 0,
      reRender: false,
      isSearch: false,
      search: '',
      index: 1,
      loading: false,
      Firstloading: true,
      isReadOnly: false,
      isOnlyViewInvoice: false,
      apInvoiceGroupId: null,
      docStatus: null,
    }
    this.index = 0;
    this.total = 0
    // this.dataInvoice = []
    this.oldSearch = ''
  }

  componentDidMount() {
    if (this.props.screenProps.id !== null && this.props.screenProps.id !== 0) {
      this.setState({ isReadOnly: this.props.screenProps.isReadOnly, apInvoiceGroupId: this.props.screenProps.id, isOnlyViewInvoice: this.props.screenProps.isOnlyViewInvoice }, () => {
        this._getInvoiceData('');
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if ((nextProps.keyword !== this.props.keyword) && (nextProps.screenProps.tabActive === this.state.index)) {
      this.index = 0
      this.setState({ search: nextProps.keyword.trim() })
      this._getInvoiceData(nextProps.keyword.trim())
    }
    if (nextProps.screenProps.isReadOnly !== this.props.screenProps.isReadOnly) {
      this.setState({ isReadOnly: nextProps.screenProps.isReadOnly })
    }

    if (nextProps.screenProps.id !== this.props.screenProps.id) {
      this.index = 0
      this.setState({ apInvoiceGroupId: nextProps.screenProps.id }, () => { this._getInvoiceData('') })
    }

    if (nextProps.screenProps.isOnlyViewInvoice !== this.props.screenProps.isOnlyViewInvoice) {
      this.setState({ isOnlyViewInvoice: nextProps.screenProps.isOnlyViewInvoice })
    }
  }

  _getData = async (searchKey) => {
    let body = {
      adOrgId: this.props.userData.adOrgId,
      apInvoiceGroupId: this.state.apInvoiceGroupId,
      start: this.index,
      searchKey: searchKey,
      maxResult: R.strings.PAGE_LIMIT.PAGE_INVOICE,
      sortField: 'TRANS_DATE',
      sortDir: 'DESC'
    }
    const response = await ApInvoiceGroupStatement.getInvoiceList(body);
    return response
  }

  _getInvoiceData = async (searchKey) => {
    const response = await this._getData(searchKey);
    if (response.data) {
      this.dataInvoice = response.data.data
      this.index += response.data.data.length
      this.setState({ reRender: !this.state.reRender })
      if (this.dataInvoice.length > 0) {
        this.props.screenProps.setCOActive(true)
      }
    }
  }

  _onDel = async (indexs, indexDel) => {
    let id = this.dataInvoice[indexDel].apInvoiceId
    if (id) {
      let body = {
        apInvoiceGroupId: this.state.apInvoiceGroupId,
        apInvoiceId: id
      }
      const response = await ApInvoiceGroupStatement.delInvoice(body);
      if (response.status === 200) {
        showAlert(TYPE.SUCCESS, 'Thông báo', 'Xoá thành công');
        this.dataInvoice.splice(indexDel, 1);
        this.setState({ reRender: !this.state.reRender })
        if (this.dataInvoice.length === 0) {
          this.props.screenProps.setCOActive(false)
        }
        this.props.screenProps.reloadInfo()

      }
      else {
        showAlert(TYPE.WARN, 'Thông báo', 'Kiểm tra lại đường truyền');
      }
    }
  };

  _onPressItem = (apInvoiceId) => {
    if (this.state.isOnlyViewInvoice) {
      NavigationService.navigate(DetailInvoice, { idInvoice: apInvoiceId, refreshData: this._refreshData })
    } else {
      NavigationService.navigate(CreateInvoice, { idInvoice: apInvoiceId, refreshData: this._refreshData })
    }
  }

  _refreshData = () => {
    this.index = 0;
    this.setState({ search: '' })
    if (this.state.apInvoiceGroupId !== 0) {
      this._getInvoiceData('');
    }
  }

  _renderItem = ({ item, index }) => {
    let day = moment(mapTimeVNToWorld(item.transDate)).format('D');
    let month = moment(mapTimeVNToWorld(item.transDate)).format('M');
    let year = moment(mapTimeVNToWorld(item.transDate)).format('YYYY');
    let c = R.strings.TRANG_THAI_TO_TRING[0].color;
    return (
      <ItemInvoice
        isFromApInvoiceGroupStatement='true'
        isShowMonth={item.isShowMonth}
        time={{ day, month, year }}
        content={item}
        index={index}
        colorStatus={c}
        onPressItem={(apInvoiceId) => { this._onPressItem(apInvoiceId) }}
      />
    )
  }

  _resetDataSearch = () => {
    this.index = 0;
    this.setState({
      refreshing: true,
      maxResult: 10,
      search: ""
    },
      async () => {
        let resInvoice = await this._getInvoiceData('');
        if (resInvoice && resInvoice.status === 200) {
          this.index = resInvoice.data.data.length
          let data = resInvoice.data.data
          this.dataInvoice = data
        }
        this.setState({ refreshing: false, loading: false, showfooter: false })
      })
  }

  /**
   * load more item 
   */
  _loadMoreData = async () => {
    if (this.total == this.index) {
      return;
    }
    this.setState({ loading: true, showfooter: true }, async () => {
      let response = await this._getData(this.state.search)
      if (response.data) {
        this.index += response.data.data.length
        _.forEach(response.data, (item) => {
          this.dataInvoice.push(item)
        })
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

  render() {
    const { reloadInfo } = this.props.screenProps
    return (
      <View style={styles.container}>
        {this.state.isReadOnly ? (
          <View style={styles.container}>
            <FlatList
              data={this.dataInvoice}
              extraData={this.state}
              renderItem={({ item, index }) => this._renderItem({ item, index })}
              ListEmptyComponent={!this.state.refreshing && !this.state.loading && <ItemTrong />}
              onEndReached={this._loadMoreData}
              ListFooterComponent={this._renderFooter}
              onRefresh={this._refreshData}
              refreshing={this.state.refreshing}
              onEndReachedThreshold={0.1}
            />
          </View>
        ) : (
            <View style={styles.container}>
              <View style={styles.view}>
                <FlatListSwipe
                  data={this.dataInvoice}
                  extraData={this.state}
                  renderItem={({ item, index }) => this._renderItem({ item, index })}
                  ListEmptyComponent={!this.state.refreshing && !this.state.loading && <ItemTrong />}
                  onEndReached={this._loadMoreData}
                  ListFooterComponent={this._renderFooter}
                  onRefresh={this._refreshData}
                  refreshing={this.state.refreshing}
                  onEndReachedThreshold={0.1}
                  listIcons={[R.images.iconDelete]}
                  widthListIcon={WIDTHXD(129)}
                  rightOfList={WIDTHXD(30)}
                  styleOfIcon={{}}
                  onPressIcon={(indexOfIcon, indexOfItem, adAttachmentId) => {
                    this._onDel(indexOfIcon, indexOfItem);
                  }}
                />
              </View>
              <ButtonAdd
                onButton={() => NavigationService.navigate(ListInvoice, {
                  onPressItem: (items) => {
                    this._refreshData()
                    reloadInfo()
                  }, id: this.state.apInvoiceGroupId
                })}
                bottom={HEIGHTXD(150)}
              />
            </View>

          )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});

function mapStateToProps(state) {
  return {
    userData: state.userReducers.userData.loggedIn,
    keyword: state.advanceRequestReducer.keyword,
  }
}
export default connect(mapStateToProps, {})(InvoiceList);
