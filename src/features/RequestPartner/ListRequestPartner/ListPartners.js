import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { connect } from 'react-redux'
import { FlatList } from 'react-native-gesture-handler';
import _ from 'lodash'
import i18n from 'assets/languages/i18n';
import { HEIGHTXD } from '../../../config';
import HeaderBtnSearch from '../../../common/Header/HeaderBtnSearch';
import NavigationService from '../../../routers/NavigationService';
import { setListInvoice } from '../../../actions/invoice'
import R from '../../../assets/R'
import ItemCustomer from './item';
import ButtonAdd from '../../../common/Button/ButtonAdd';
import { CreateCustomer } from '../../../routers/screenNames'
import { getPartner } from '../../../apis/Functions/statement'
import ItemTrong from '../../../common/Item/ItemTrong';

class ListCustomer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reRender: false,
      loading: false,
      query: '',
      typing: false,
      typingTimeout: 0,
      search: ''
    }
    this.listCustomer = []
  }

  _reRender = () => {
    this.setState({ reRender: !this.state.reRender })
  }

  componentDidMount = () => {
    this._findDebtSubject(0, '')
  }

  _renderLoadding = () => (
    <View style={{ height: HEIGHTXD(110) }}>
      <ActivityIndicator animating color="#1C1C1C" size="large" />
    </View>
  )

  _changeName = (event) => {
    this.setState({ search: event })
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }

    this.setState({
      query: event,
      typing: false,
      typingTimeout: setTimeout(async () => {
        this._findDebtSubject(0, this.state.query)
      }, 500)
    });
  }

  _findDebtSubject = async (start, query) => {
    // let body = {
    //   isSize: 'true',
    //   name: query
    // }
    this.setState({ loading: true }, async () => {
      let body = {
        isSize: true,
        adOrgId: this.props.adOrgId,
        name: query
      }
      let res = await getPartner(body);
      // console.log(res)
      // let res = await ApiInvoice.searchDebtSubject(body)
      if (res && res.data) {
        this.listCustomer = res.data
      } else {
        this.listCustomer = []
      }
      this.setState({ loading: false })
    })
  }

  render() {
    const { loading, search } = this.state
    const { onPressItem } = this.props.navigation.state.params
    let fromHome = this.props.navigation.getParam('fromHome')
    // console.log(this.listCustomer)
    return (
      <KeyboardAvoidingView
        keyboardVerticalOffset={-HEIGHTXD(400)}
        behavior={Platform.Os === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.container}>

          <HeaderBtnSearch
            title="Danh sách đối tượng"
            placeholderSearch="Tên đối tượng, MST, CMT"
            search={search}
            setIsSearch={this._setIsSearch}
            onChangeSearch={this._changeName}
            onButtonSearch={() => { this._setIsSearch(true) }}
          />
          {loading && (this._renderLoadding())}
          {!loading && this.listCustomer.length === 1 && <ItemTrong title={i18n.t('NULL_DATA_SEARCH')} />}
          {!loading && this.listCustomer.length > 1 && (
            <FlatList
              data={this.listCustomer}
              style={{ marginTop: HEIGHTXD(30), paddingBottom: HEIGHTXD(30) }}
              extracData={this.state.loading}
              ListEmptyComponent={!this.state.refreshing && <ItemTrong title={i18n.t('NULL_DATA_SEARCH')} />}
              renderItem={({ item, index }) => {
                if (index !== this.listCustomer.length - 1) {
                  let phone = item.taxCode ? item.taxCode : item.identifyId;

                  return (
                    <ItemCustomer
                      onPressItem={() => {
                        if (fromHome) {

                        } else {
                          NavigationService.pop(); onPressItem && onPressItem(item)
                        }
                      }}
                      companyName={_.isNull(item.name) ? i18n.t('NULL_T') : item.name}
                      phone={phone}
                      companyAdd={_.isNull(item.address) ? i18n.t('NULL_ADDRESS') : item.address}
                      key={index}
                    />
                  )
                } else return null
              }}
            />
          )
          }
          <ButtonAdd
            onButton={() => NavigationService.navigate(CreateCustomer, { isUpdate: false, refreshData: () => { } })}
            bottom={HEIGHTXD(150)}
          />
        </View>
      </KeyboardAvoidingView>
    )
  }
}
function mapStateToProps(state) {
  return {
    userData: state.userReducers.userData.loggedIn
  }
}
export default connect(mapStateToProps, { setListInvoice })(ListCustomer);
const styles = StyleSheet.create({
  container: {
    backgroundColor: R.colors.blueGrey51,
    flex: 1
  },

});
