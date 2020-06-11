import React, { Component } from 'react'
import { StyleSheet, View, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import R from '../../../../assets/R';
import { HEIGHTXD, WIDTHXD } from '../../../../config/Function';
import ItemGeneralInfo from './ItemViews/ItemGeneralInfo';
import ItemMoneyInfo from './ItemViews/ItemMoneyInfo';
import ItemManagerInfo from './ItemViews/ItemManagerInfo';
import apiInvoice from '../../../../apis/Functions/invoice'

class DetailedInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      reRender: false,
      loading: false
    };
    this.dataItem = {}
  }

  componentDidMount() {
    this.getDetailByID()
  }

  getDetailByID = async () => {
    let idInvoice = this.props.idInvoice ? this.props.idInvoice : '54289'
    let body = { id: idInvoice }
    this.setState({
      loading: true
    }, async () => {
      let resDetail = await apiInvoice.getDetailsInvoice(body)
      if (resDetail && resDetail.data) {
        this.dataItem = resDetail.data
        this.setState({ reRender: !this.state.reRender })
      }
      this.setState({ loading: false })
    })
  }

  onChangeBottomTab = (index) => {
    this.setState({ index })
  }

  render() {
    const { nextToDetail } = this.props
    const { loading } = this.state
    if (loading) {
      return (
        <View style={styles.container}>
          <View>
            <ActivityIndicator animating color="#1C1C1C" size="large" />
          </View>
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ marginVertical: HEIGHTXD(24) }}>
            <ItemGeneralInfo
              item={this.dataItem}
            />
          </View>
          <View>
            <ItemMoneyInfo item={this.dataItem} detail={false} />
          </View>
          <View style={{ marginTop: HEIGHTXD(24) }}>
            <ItemManagerInfo
              item={this.dataItem}
              detail={false}
            />
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => { nextToDetail() }}
              style={{ alignItems: 'flex-end' }}
            >
              <View style={styles.button}>
                <Icon name="arrow-right" size={WIDTHXD(60)} color={R.colors.colorMain} />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: R.colors.blueGrey51,
  },
  button: {
    marginTop: HEIGHTXD(42),
    marginBottom: HEIGHTXD(67),
    marginRight: WIDTHXD(86),
    width: WIDTHXD(137),
    height: WIDTHXD(137),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: WIDTHXD(137),
    elevation: 5,
    backgroundColor: R.colors.white
  }
})

export default DetailedInfo;
