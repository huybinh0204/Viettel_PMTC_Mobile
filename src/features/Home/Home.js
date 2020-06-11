import React, { Component } from 'react';
import { View, Text, StatusBar } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ListStatement, ListApInvoiceGroupStatement, ListInvoice, AdvanceRequest } from '../../routers/screenNames';
import NavigationService from '../../routers/NavigationService';
import HeaderProfile from '../../common/Header/HeaderProfile';
import { WIDTHXD, HEIGHTXD } from '../../config';
import R from '../../assets/R';
import i18n, { setLocation } from '../../assets/languages/i18n';
import styles from './stylesHome';
import HomePieChart from '../../common/Item/ItemChart/HomePieChart';
import HomeBarChart from '../../common/Item/ItemChart/HomeBarChart';
import { dataTT, dataDNTT } from './dataHome';
import HalfPieChart from '../../common/Item/ItemChart/HalfPieChart';
import ItemTabTopHome from '../../common/Item/ItemTabTopHome';
import ItemSurplus from '../../common/Item/ItemSurplus';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      typeOfCount: true,
      dataTT,
      dataDNTT,
    };
  }

  onChangeBottomTab = (index) => {
    this.setState({ index })
  }

  onChangeTopTab = (index) => {
    if (index === 0) {
      NavigationService.navigate(ListStatement)
    }
    if (index === 1) {
      NavigationService.navigate(AdvanceRequest)
    }
    if (index === 2) {
      NavigationService.navigate(ListApInvoiceGroupStatement)
    }
    if (index === 3) {
      NavigationService.navigate(ListInvoice)
    }
    this.setState({ index })
  }

  componentWillMount = () => {
    setLocation(i18n, 'vi')
  }

  renderTTD = ({ item }) => (
    <View style={styles.renderBox}>
      <View style={{ flexDirection: 'row' }}>
        <View style={[styles.legendBox, { backgroundColor: item.color, }]} />
        <Text>{item.label}</Text>
      </View>
      <Text>{item.number}</Text>
    </View>
  )

  renderTTC = ({ item }) => (
    <View style={styles.renderBox}>
      <View style={{ flexDirection: 'row' }}>
        <View style={[styles.legendBox, { backgroundColor: item.color, }]} />
        <Text>{item.label}</Text>
      </View>
      <Text>{item.number}</Text>
    </View>
  )

    changeMode = () => {
      this.setState({ typeOfCount: !this.state.typeOfCount });
    }

    render() {
      return (
        <View>
          <StatusBar
            backgroundColor={R.colors.colorMain}
            barStyle="dark-content"
          />
          <ScrollView style={{ backgroundColor: R.colors.colorMain }}>
            <HeaderProfile fullName="Nguyễn Văn A" phongBan="Nhân viên kinh doanh" />
            <ItemTabTopHome onChange={this.onChangeTopTab} />
            <View style={{ backgroundColor: '#F1F3F6', borderTopLeftRadius: WIDTHXD(67), borderTopRightRadius: WIDTHXD(67), marginTop: HEIGHTXD(278) }}>
              <ItemSurplus />
              <View style={styles.line2} />
              <View style={styles.line} />
              <HomePieChart
                data={this.state.dataTT}
                title="TỜ TRÌNH"
                total="20"
                onPress={this.changeMode}
                mode={this.state.typeOfCount}
              />
              <View style={styles.line} />
              <HomeBarChart
                title="ĐỀ NGHỊ TT"
                onPress={this.changeMode}
                mode={this.state.typeOfCount}
              />
              <View style={styles.line} />
              <HalfPieChart
                data={this.state.dataDNTT}
                title="ĐỀ NGHỊ TT"
                total="30"
                onPress={this.changeMode}
                mode={this.state.typeOfCount}
              />
              <View style={styles.line} />
            </View>
          </ScrollView>
        </View>
      );
    }
}

export default Home;
