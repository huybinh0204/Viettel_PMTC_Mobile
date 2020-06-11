import React, { Component } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux'
import NavigationService from 'routers/NavigationService';
import { CreateCustomer } from 'routers/screenNames';
import { setTypeOfIcon } from 'actions/invoice';
import i18n from 'assets/languages/i18n';
import apiInvoice from 'apis/Functions/invoice'
import Confirm from '../../../../../common/ModalConfirm/Confirm';
import { showAlert, TYPE } from '../../../../../common/DropdownAlert';
import ItemTrong from '../../../../../common/Item/ItemTrong';
import ButtonAdd from '../../../../../common/Button/ButtonAdd';
import { HEIGHTXD, WIDTHXD } from '../../../../../config';
import R from '../../../../../assets/R'
import ItemDetailInvoice from './item';
import FlatListSwipe from '../../../../../common/Swipe/FlatListSwipe'

class ListInvoice extends Component {
  reachEnd = false;

  constructor(props) {
    super(props);
    this.state = {
      reRender: true,
      loading: false,
      query: '',
      typing: false,
      typingTimeout: 0,
      search: '',
      refreshing: false,
      showfooter: false,
      idSelected: 0,
      isSearch: false,
      Firstloading: true,
    }
    this.maxData = 0
    this.dataDetailInvoice = []
  }

  componentDidMount = async () => {
    if (this.props.dataInvoice.isEdit) {
      this._refreshData()
    }
  }

  _changeName = (event) => {
    this.setState({ search: event })
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }

    this.setState({
      query: event,
      typing: false,
      typingTimeout: setTimeout(async () => {
        this._findDebtSubject(this.state.query)
      }, 500)
    });
  }

  _refreshData = async () => {
    this.reachEnd = false;
    this.setState({ refreshing: true }, async () => {
      let resInvoice = await this._getData(0, '');
      if (resInvoice.data) {
        this.maxData = resInvoice.data.data.length
        this.dataDetailInvoice = resInvoice.data.data
      }
      this.setState({ refreshing: false, Firstloading: false })
    })
  }

  _getData = async (start, description) => {
    let body = {
      start,
      maxResult: R.strings.PAGE_LIMIT.PAGE_DETAIL_INVOICE,
      description,
      sortField: 'TRANS_DATE',
      sortDir: 'DESC',
      apInvoiceId: this.props.dataInvoice.self.idInvoice ? this.props.dataInvoice.self.idInvoice : 0,
    }
    let resInvoice = await apiInvoice.getListDetailInvoice(body);
    return resInvoice;
  }

  _loadMoreData = async () => {
    let { search, showfooter } = this.state;
    if (showfooter || this.reachEnd) return;
    // console.log('_loadMoreData')

    this.setState({ showfooter: true }, async () => {
      let resInvoice = await this._getData(this.dataDetailInvoice.length, search)
      if (resInvoice.data) {
        this.maxData += resInvoice.data.data.length
        if (resInvoice.data.total >= this.maxData) {
          this.dataDetailInvoice = [...this.dataDetailInvoice, ...resInvoice.data.data];
        }

        if (resInvoice.data.data.length < R.strings.PAGE_LIMIT.PAGE_DETAIL_INVOICE) {
          this.reachEnd = true;
        }
      } else {
        this.reachEnd = true;
      }
      this.setState({ showfooter: false })
    })
  }

  _renderFooter = () => (
    (this.state.showfooter && this.maxData > R.strings.PAGE_LIMIT.PAGE_DETAIL_INVOICE) ? (
      <View style={{ height: HEIGHTXD(110), paddingTop: HEIGHTXD(50) }}>
        <ActivityIndicator animating color="#1C1C1C" size="large" />
      </View>) : (
        <View style={{ height: HEIGHTXD(110) }} />)
  )

  _alertDelSuccess = async () => {
    const { idSelected } = this.state;
    this.setState({ reRender: true });
    let res = await apiInvoice.delDetailInvoice(this.dataDetailInvoice[idSelected].apInvoiceLineId);
    if (res.data) {
      this.dataDetailInvoice.splice(idSelected, 1)
      this.setState({ reRender: false });
      showAlert(TYPE.SUCCESS, i18n.t('NOTIFICATION_T'), i18n.t('Delete_successful'))
    } else {
      this.setState({ reRender: false });
      showAlert(TYPE.ERROR, i18n.t('NOTIFICATION_T'), i18n.t('Delete_failed'))
    }
  }

  _addDuplicate = async (indexOfItem) => {
    this.setState({ reRender: true });
    let res = await apiInvoice.duplDetailInvoice(this.dataDetailInvoice[indexOfItem].apInvoiceLineId);
    if (res && res.data) {
      this._refreshData()
      this.setState({ reRender: false });
      showAlert(TYPE.SUCCESS, i18n.t('NOTIFICATION_T'), i18n.t('Duplicate_successful'))
    } else {
      this.setState({ reRender: false });
      showAlert(TYPE.ERROR, i18n.t('NOTIFICATION_T'), i18n.t('Duplicate_failed'))
    }
  }

  _onPressIcon = (indexOfIcon, indexOfItem) => {
    this.setState({ reRender: !this.state.reRender })
    if (indexOfIcon === 1) {
      this.props.navigation.navigate('DetailedInvoice', {
        item: this.dataDetailInvoice[indexOfItem],
        isEdit: this.props.dataInvoice.isEdit,
        serviceTypeId: this.props.serviceTypeId,
        refreshData: () => this._refreshData()
      })
    } else
      if (indexOfIcon === 2) {
        this.setState({ idSelected: indexOfItem })
        this.indexOfItem = indexOfItem
        this.ConfirmPopup.setModalVisible(true);
      } else {
        // showAlert(TYPE.WARN, i18n.t('NOTIFICATION_T'), i18n.t('FUCTION_UPDATE'))
        this._addDuplicate(indexOfItem)
        this.setState({ reRender: !this.state.reRender })
      }
  }

  _onButtonAdd = () => {
    // console.log('this.props.dataInvoice.self.idInvoice', this.props.dataInvoice.self.idInvoice)
    if (this.props.dataInvoice.self.idInvoice) {
      this.props.setTypeOfIcon(1)
      this.props.navigation.navigate('DetailedInvoice', { invoiceInfo: this.props.dataInvoice.invoiceInfo, idInvoice: this.props.dataInvoice.self.idInvoice, refreshData: () => this._refreshData() })
    } else {
      showAlert(TYPE.WARN, i18n.t('NOTIFICATION_T'), 'Vui lòng lưu hóa đơn để tiếp tục!')
    }
  }

  render() {
    const { isSearch } = this.state
    let List = this.props.dataInvoice.tabIndex === 1 ? FlatListSwipe : FlatList;

    return (
      <View style={styles.container}
        needsOffscreenAlphaCompositing={false} >
        <Confirm
          ref={ref => { this.ConfirmPopup = ref }}
          title="Bạn có muốn xóa bản ghi này không ?"
          titleLeft="HUỶ BỎ"
          titleRight="ĐỒNG Ý"
          onPressLeft={() => { }}
          onPressRight={() => this._alertDelSuccess()}
        />
        <List
          data={this.dataDetailInvoice}
          extraData={this.dataDetailInvoice}
          renderItem={({ item, index }) => <ItemDetailInvoice
            index={index}
            onPressIcon={this._onPressIcon}
            nameInvoice={item.description}
            requestAmount={item.requestAmount}
            quantum={item.qty}
            cUomId={item.cUomName}
            price={item.price}
            onPressItem={() => {
              this.props.setTypeOfIcon(1)
              this.props.navigation.navigate('DetailedInvoice', { item, isEdit: this.props.dataInvoice.isEdit, refreshData: () => this._refreshData() })
            }}
          />
          }
          keyExtractor={(item, index) => `detail-invoice-${index}`}
          ListEmptyComponent={!this.state.refreshing && <ItemTrong title={isSearch ? i18n.t('NULL_DATA_SEARCH') : i18n.t('NULL_T')} />}
          onEndReachedThreshold={0.1}
          onPressIcon={(indexOfIcon, indexOfItem) => { this._onPressIcon(indexOfIcon, indexOfItem) }}
          listIcons={[R.images.iconCoppy, R.images.iconEdit, R.images.iconDelete]}
          widthListIcon={WIDTHXD(387)}
          rightOfList={WIDTHXD(30)}
          styleOfIcon={{}}
          onEndReached={this._loadMoreData}
          ListFooterComponent={this._renderFooter}
          onRefresh={this._refreshData}
          refreshing={this.state.refreshing}
        />

        <ButtonAdd
          onButton={() => {
            this._onButtonAdd()
          }}
          bottom={HEIGHTXD(150)}
        />
      </View>
    )
  }
}

function mapStateToProps() {
  return {
  }
}

export default connect(mapStateToProps, {
  setTypeOfIcon

})(ListInvoice);
const styles = StyleSheet.create({
  container: {
    backgroundColor: R.colors.blueGrey51,
    flex: 1
  },
});
