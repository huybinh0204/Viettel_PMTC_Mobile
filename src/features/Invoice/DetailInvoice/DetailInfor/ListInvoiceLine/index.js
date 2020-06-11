import React, { Component } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux'
import { setTypeOfIcon } from 'actions/invoice';
import i18n from 'assets/languages/i18n';
import apiInvoice from 'apis/Functions/invoice'
import ItemTrong from '../../../../../common/Item/ItemTrong';
import { HEIGHTXD, WIDTHXD } from '../../../../../config';
import R from '../../../../../assets/R'
import ItemDetailInvoice from './item';

class ListInvoice extends Component {
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
    this._refreshData()
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
      apInvoiceId: this.props.idInvoice ? this.props.idInvoice : 54227,
    }
    let resInvoice = await apiInvoice.getListDetailInvoice(body);
    return resInvoice;
  }

  _loadMoreData = async () => {
    let { search } = this.state;
    this.setState({ showfooter: true }, async () => {
      let resInvoice = await this._getData(this.dataDetailInvoice.length, search)
      if (resInvoice.data) {
        this.maxData += resInvoice.data.data.length
        if (resInvoice.data.total >= this.maxData) {
          this.dataDetailInvoice = [...this.dataDetailInvoice, ...resInvoice.data.data];
        }
      }
      this.setState({ showfooter: false })
    })
  }

  _renderFooter = () => (
    this.state.showfooter ? (
      <View style={{ height: HEIGHTXD(110) }}>
        <ActivityIndicator animating color="#1C1C1C" size="large" />
      </View>) : (
        <View style={{ height: HEIGHTXD(110) }} />)
  )

  render() {
    const { isSearch } = this.state
    return (
      <View style={styles.container}>
        <FlatList
          data={this.dataDetailInvoice}
          extraData={this.dataDetailInvoice}
          renderItem={({ item, index }) => <ItemDetailInvoice
            index={index}
            nameInvoice={item.description}
            requestAmount={item.requestAmount}
            quantum={item.qty}
            cUomId={item.cUomId}
            price={item.price}
            onPressItem={() => {
              this.props.setTypeOfIcon(1)
              this.props.navigation.navigate('DetailedInvoice', { item })
            }}
          />
        }
          ListEmptyComponent={!this.state.refreshing && <ItemTrong title={isSearch ? i18n.t('NULL_DATA_SEARCH') : i18n.t('NULL_T')} />}
          onEndReachedThreshold={0.1}
          listIcons={[R.images.iconCoppy, R.images.iconEdit, R.images.iconDelete]}
          widthListIcon={WIDTHXD(387)}
          rightOfList={WIDTHXD(30)}
          styleOfIcon={{}}
          onEndReached={this._loadMoreData}
          ListFooterComponent={this._renderFooter}
          onRefresh={this._refreshData}
          refreshing={this.state.refreshing}
        />
      </View>
    )
  }
}
function mapStateToProps() {
  return {
  }
}
export default connect(mapStateToProps, { setTypeOfIcon

})(ListInvoice);
const styles = StyleSheet.create({
  container: {
    backgroundColor: R.colors.blueGrey51,
    flex: 1
  },
});
