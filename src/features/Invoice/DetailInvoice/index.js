import React, { Component } from 'react';
import { SafeAreaView, TouchableHighlight, StyleSheet, View, Animated } from 'react-native';
import { TabView } from 'react-native-tab-view';
import i18n from 'assets/languages/i18n';
import LinearGradient from 'react-native-linear-gradient';
import NavigationService from 'routers/NavigationService';
import { HEIGHTXD, getFontXD, WIDTHXD, getWidth } from '../../../config/Function';
import R from '../../../assets/R';
import HeaderForTabInvoice from '../../../common/Header/HeaderForTabInvoice';
import GeneralInfo from './GeneralInfor';
import DetailedInfo from './DetailInfor';
import Attackments from './Attackments';


const initialLayout = {
  height: 0,
  width: getWidth(),
};

class DetailInvoice extends Component {
  state = {
    index: 0,
    routes: [
      { key: 1, title: i18n.t('GENERAL_INFORMATION') },
      { key: 2, title: i18n.t('DETAIL_INFORMATION') },
      { key: 3, title: i18n.t('ATTACK_T') },
    ],
    loading: true,
    indexBottom: 0,
    behavior: 'padding',
    search: '',
    attachmentTabIndex: 0
  };

  _renderFooter = props => {
    const inputRange = props.navigationState.routes.map((key, i) => i)
    return (
      <LinearGradient
        colors={R.colors.colorHeaderGradienMenuTab}
        style={styles.tab}
      >
        <View style={{ flexDirection: 'row' }}>
          {props.navigationState.routes.map((route, i) => {
            const opacity = props.position.interpolate({
              inputRange,
              outputRange: inputRange.map(
                inputIndex => (inputIndex === i ? 1 : 0.5)
              ),
            });
            const bcolor = props.position.interpolate({
              inputRange,
              outputRange: inputRange.map(
                inputIndex => (inputIndex === i ? '#fff' : '#22AEFB')
              ),
            });
            let width = WIDTHXD(411)
            switch (i) {
              case 1: {
                width = WIDTHXD(435)
                break
              }
              case 2: {
                width = WIDTHXD(280)
                break
              }
              default: {
              }
            }
            return (
              <TouchableHighlight
                activeOpacity={0.6}
                underlayColor="transparent"
                onPress={() => { this.setState({ index: i }) }}
              >
                <Animated.View style={[styles.tabBar, { borderBottomColor: bcolor }, { width }]}>
                  <Animated.Text style={[styles.textTab, { opacity }]}>{route.title}</Animated.Text>
                </Animated.View>
              </TouchableHighlight>
            );
          })}

        </View>
      </LinearGradient>
    )
  };

  _onChangeBottomTab = (indexBottom) => {
    this.setState({ indexBottom })
  }

  _renderScene = ({ route }) => {
    let idInvoice = this.props.navigation.getParam('idInvoice')
    switch (route.key) {
      case 1: {
        return <GeneralInfo nextToDetail={() => { this.setState({ index: 1 }) }} idInvoice={idInvoice} />;
      }
      case 2:
        return <DetailedInfo screenProps={idInvoice} />;
      case 3:
        return <Attackments
          screenProps={{
            idInvoice: idInvoice,
            swiping: true,
            isReadOnly: true,
            setRefreshAttachmentList: (refresh) => {},
            onAttachmentTabChange: (attachmentTabIndex) => this.setState({ attachmentTabIndex }),
            tabIndex: this.state.index,
          }}
          navigationOptions={{
            dataItem: null
          }} />
      default:
        return null;
    }
  };

  _onChangeSearch = (search) => {
    this.setState({ search })
  }

  render() {
    const { index, search } = this.state

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <HeaderForTabInvoice
          title={i18n.t('INVOICE_T')}
          onPressLeft={() => {
            this.props.navigation.state.params.refreshData()
            NavigationService.pop()
          }}
          onChangeSearch={(searchs) => { this._onChangeSearch(searchs) }}
          placeholderSearch="Tìm kiếm"
          search={search}
          indexOfTab={index}
          attachmentTabIndex={this.state.attachmentTabIndex}
          setAttachmentTabIndex={() => this.setState({ attachmentTabIndex: 0 })}
          onPressRight={() => { }}
        />
        <TabView
          renderTabBar={this._renderFooter}
          navigationState={this.state}
          renderScene={this._renderScene}
          onIndexChange={index => this.setState({ index })}
          initialLayout={initialLayout}
          swipeEnabled={true}
        />
      </SafeAreaView>
    );
  }
}

export default DetailInvoice;
const styles = StyleSheet.create({
  tabTextColor: {
    color: R.colors.white,
    opacity: 1,
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular,
    textAlign: 'center',
  },
  tabBar: {
    justifyContent: 'center',
    paddingVertical: HEIGHTXD(49),
    width: WIDTHXD(411),
    backgroundColor: 'transparent',
    paddingTop: HEIGHTXD(61),
    alignItems: 'center',
    borderBottomWidth: HEIGHTXD(12)
  },
  textTab: {
    color: '#fff',
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular
  },
  tab: {
    flexDirection: 'row',
    backgroundColor: R.colors.colorMain,
  },
});
