import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { connect } from 'react-redux'
import _ from 'lodash'
import i18n from 'assets/languages/i18n';
import FlatListSwipe from '../../../common/Swipe/FlatListSwipe';
import { showAlert, TYPE } from '../../../common/DropdownAlert';
import HeaderBtnSearch from '../../../common/Header/HeaderBtnSearch';
import Confirm from '../../../common/ModalConfirm/Confirm';
import { HEIGHTXD, WIDTHXD } from '../../../config';
import NavigationService from '../../../routers/NavigationService';
import { setListInvoice } from '../../../actions/invoice'
import R from '../../../assets/R'
import ItemCustomer from './item';
import ButtonAdd from '../../../common/Button/ButtonAdd';
import { CreateCustomer } from '../../../routers/screenNames'
import ApiInvoice from '../../../apis/Functions/invoice'
import ItemTrong from '../../../common/Item/ItemTrong';

class ListCustomer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      showfooter: false,
      reRender: false,
      query: '',
      typing: false,
      typingTimeout: 0,
      search: '',
      Firstloading: true,
      isSearch: false,
    }
    this.listPartner = []
    this.maxData = 0
    this.oldSearch = '';

    this.timeoutSearch;
    this.indexOfItem = 0;
  }

  _reRender = () => {
    this.setState({ reRender: !this.state.reRender })
  }

  componentDidMount = () => {
    this._refreshData()
  }

  _refreshData = async () => {
    this.setState({ refreshing: true }, async () => {
      let res = await this._getListPartner(0, '')
      if (_.has(res, 'data.data')) {
        this.listPartner = res.data.data
        this.maxData = this.listPartner.length
      } else {
        this.listPartner = []
      }
      this.setState({ refreshing: false, Firstloading: false })
    })
  }

  _getListPartner = async (start, searchKey) => {
    let body = {
      cRequestPartnerId: null,
      adOrgId: null,
      start,
      maxResult: R.strings.PAGE_LIMIT.PAGE_PARTNER,
      partnerName: searchKey,
      address: null,
      taxCode: null,
      identify: null,
      docstatus: null
    }
    let res = await ApiInvoice.getListPartner(body)
    return res
  }

  _loadMoreData = async () => {
    let { search, showfooter } = this.state;

    !showfooter && this.setState({ showfooter: true }, async () => {
      let res = await this._getListPartner(this.maxData, search)
      if (_.has(res, 'data.data')) {
        this.listPartner = [...this.listPartner, ...res.data.data]
        console.log('list request partners', this.listPartner)
        this.maxData += R.strings.PAGE_LIMIT.PAGE_PARTNER
      }
      this.setState({ showfooter: false })
    })
  }


  _renderLoadding = () => (
    <View style={{ height: HEIGHTXD(110) }}>
      <ActivityIndicator animating color="#1C1C1C" size="large" />
    </View>
  )

  _onPressHidenButton = (indexOfIcon, indexOfItem) => {
    switch (indexOfIcon) {
      case 2:
        this.ConfirmPopup.setModalVisible(true);
        this.indexOfItem = indexOfItem
        // this._delPartner(indexOfItem)
        break;
      case 1:
        this._editPartner(indexOfItem)
        break;
      case 0:
        this._dupPartner(indexOfItem)
        break;
      default:
        break;
    }
  }

  _delPartner = async () => {
    let { indexOfItem } = this
    let resDel = await ApiInvoice.deleteRequestPartner(this.listPartner[indexOfItem].cRequestPartnerId)
    if (resDel.data && resDel.data === 'NO_CONTENT') {
      showAlert(TYPE.SUCCESS, 'Thông báo', 'Xóa thành công');
      this.listPartner.splice(indexOfItem, 1);
      this._reRender()
    } else showAlert(TYPE.ERROR, 'Thông báo', 'Xóa thất bại');
  }

  _checkEditable = (indexOfItem) => this.listPartner[indexOfItem].updatedby !== this.props.userData.adUserId

  _editPartner = (indexOfItem) => {
    this._reRender()
    NavigationService.navigate(CreateCustomer, {
      disabled: this._checkEditable(indexOfItem),
      isUpdate: true,
      item: this.listPartner[indexOfItem],
      refreshData: () => { this._getListPartner(0, '') },
      reRender: () => { this._reRender() }
    })
  }

  _dupPartner = async (indexOfItem) => {
    let body = {
      cRequestPartnerId: this.listPartner[indexOfItem].cRequestPartnerId
    }
    let resDup = await ApiInvoice.duplicateRequestPartner(body)
    if (resDup.data && resDup.data.returnMessage === null) {
      showAlert(TYPE.SUCCESS, 'Thông báo', 'Sao chép thành công');
      this.listPartner.unshift(this.listPartner[indexOfItem]);
      this._reRender()
    } else showAlert(TYPE.ERROR, 'Thông báo', 'Sao chép thất bại');
  }

  _renderFooter = () => (
    this.state.showfooter ? (
      <View style={{ height: HEIGHTXD(110) }}>
        <ActivityIndicator animating color="#1C1C1C" size="large" />
      </View>) : (
        <View style={{ height: HEIGHTXD(110) }} />)
  )

  _setIsSearch = (isSearch) => {
    this.setState({ isSearch })
  }


  _onChangeSearch = async (search) => {
    clearTimeout(this.timeoutSearch);
    this.timeoutSearch = setTimeout(async () => {
      if (search === '') this._refreshData()
      if (this.oldSearch === search) {
        let res = await this._getListPartner(0, search);
        if (res.data) {
          this.listPartner = res.data.data;
        }
        this._reRender()
      }
    }, 500);
    this.oldSearch = search;
    this.setState({ search })
  }

  render() {
    const { refreshing, Firstloading, search, isSearch } = this.state
    return (
      <KeyboardAvoidingView
        keyboardVerticalOffset={-HEIGHTXD(400)}
        behavior={Platform.Os === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.container}>
          <HeaderBtnSearch
            title="Danh sách khai báo đối tượng"
            placeholderSearch="Tên đối tượng"
            search={search}
            isSearch={isSearch}
            setIsSearch={this._setIsSearch}
            onChangeSearch={this._onChangeSearch}
            onButtonSearch={() => { this._setIsSearch(true) }}
          />
          {Firstloading && (this._renderLoadding())}
          {!Firstloading && (
            <FlatListSwipe
              data={this.listPartner}
              style={{ marginTop: HEIGHTXD(30) }}
              extracData={this.state.loading}
              ListEmptyComponent={!refreshing && <ItemTrong title={i18n.t('NULL_DATA_SEARCH')} />}
              onPressIcon={this._onPressHidenButton}
              listIcons={[R.images.iconCoppy, R.images.iconEdit, R.images.iconDelete]}
              widthListIcon={WIDTHXD(129) * 3}
              rightOfList={WIDTHXD(30)}
              styleOfIcon={{ alignSelf: 'center', }}
              onEndReached={this._loadMoreData}
              ListFooterComponent={this._renderFooter}
              onRefresh={this._getListPartner}
              refreshing={this.state.refreshing}
              onEndReachedThreshold={0.1}
              renderItem={({ item, index }) => {
                let phone = item.taxCode ? item.taxCode : item.identify;
                
                return (
                <ItemCustomer
                  onPressItem={() => this._editPartner(index)}
                  companyName={_.isNull(item.partnerName) ? i18n.t('NULL_T') : item.partnerName}
                  phone={phone}
                  companyAdd={_.isNull(item.address) ? i18n.t('NULL_ADDRESS') : item.address}
                  index={index}
                />
              )}}
            />
          )
          }

          <ButtonAdd
            onButton={() => NavigationService.navigate(CreateCustomer, { isUpdate: false, refreshData: () => { this._getListPartner(0, '') }, reRender: () => { this._reRender() } })}
            bottom={HEIGHTXD(150)}
          />
          <Confirm
            ref={ref => { this.ConfirmPopup = ref }}
            title="Bạn có muốn xóa đối tượng này không ?"
            titleLeft="HUỶ BỎ"
            titleRight="ĐỒNG Ý"
            onPressLeft={() => { }}
            onPressRight={() => this._delPartner()}
          />
        </View>
      </KeyboardAvoidingView>
    )
  }
}
function mapStateToProps(state) {
  return {
    userData: state.userReducers.userData
  }
}
export default connect(mapStateToProps, { setListInvoice })(ListCustomer);
const styles = StyleSheet.create({
  container: {
    backgroundColor: R.colors.blueGrey51,
    flex: 1
  },

});
