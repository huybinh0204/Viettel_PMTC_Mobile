// @flow
import React, { PureComponent, Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Image,
  Animated,
  SafeAreaView,
  Platform,
} from 'react-native';
import { connect } from 'react-redux'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import LinearGradient from 'react-native-linear-gradient';
import NavigationService from '../../routers/NavigationService';
import { getFontXD, WIDTHXD, HEIGHTXD, getLineHeightXD } from '../../config';
import R from '../../assets/R';
import global from '../../features/Statement/global';
import _ from 'lodash';
import {
  setFilterVOffice
} from '../../actions/voffice';

class HeaderVOffice extends Component {

  constructor(props) {
    super(props)
    this.state = {
      searchFocus: new Animated.Value(0),
      searchString: null,
      isSearch: false,
      isHideAllGeneral: false,
      isHideAllDetail: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.cStatementId) {
      this.setState({
        isHideAllDetail: !nextProps.isHideGeneralInfoLine || !nextProps.isHideAccountantLine || !nextProps.isHideBudgetLine || !nextProps.isHideDifferentLine,
        isHideAllGeneral: !nextProps.isHideGeneralInfo || !nextProps.isHideOfficeInfo || !nextProps.isHideMoneyInfo || !nextProps.isHideStatusInfo
      })
    }
    else {
      this.setState({
        isHideAllDetail: !nextProps.isHideGeneralInfoLine || !nextProps.isHideAccountantLine || !nextProps.isHideBudgetLine || !nextProps.isHideDifferentLine,
        isHideAllGeneral: !nextProps.isHideGeneralInfo
      })
    }
  }

  renderInputHeader = () => {
    const {
      search,
      onChangeText,
      placeholderSearch,
    } = this.props;
    const { searchFocus } = this.state;

    return (
      <Animated.View style={[styles.header_input_container, { width: searchFocus }]}>
        <TextInput
          value={search}
          // onEndEditing={() => setIsSearch(false)}
          autoFocus={true}
          onChangeText={onChangeText}
          placeholder={placeholderSearch}
          autoCorrect={false}
          style={{ ...styles.header_input, fontStyle: !_.isEmpty(search) ? 'normal' : 'italic' }}
          onSubmitEditing={() => onChangeText(search)}
          multiline={false}
          numberOfLines={1}
          placeholderTextColor='#8D8D8D'
          keyboardType='numbers-and-punctuation'
        />
        <TouchableOpacity
          hitSlop={{ top: 20, bottom: 20, left: 50, right: 20 }}
          onPress={() => onChangeText('')}
          style={{ flex: 0 }}
        >
          <Ionicons
            name="ios-search"
            size={WIDTHXD(65)}
            color="#8D8D8D"
          />
        </TouchableOpacity>
      </Animated.View>
    )
  }

  renderNormalHeader = () => {

    return (
      <View style={styles.header_normal_container}>
        <Text style={styles.textTitle}>{this.props.title}</Text>
        <TouchableOpacity
          onPress={this._onPressSearch}>
          <Image
            resizeMode="contain"
            source={R.images.iconSearch}
            style={styles.btn}
          />
        </TouchableOpacity>
      </View>
    )
  }

  _onPressSearch = () => {
    this.setState({ isSearch: !this.state.isSearch }, () => {
      const { onChangeText } = this.props;
      onChangeText && onChangeText('');
      if (this.state.isSearch) {
        Animated.timing(this.state.searchFocus, {
          toValue: 1, // status === true, increase flex size
          duration: 300 // ms
        }).start();
      }
    })
  }

  _onPressBack = () => {
    if (this.state.isSearch) {
      this._onPressSearch();
    } else {
      NavigationService.pop();
    }
  }

  render() {
    const { isSearch } = this.state;

    return (
      <LinearGradient
        style={styles.container}
        colors={R.colors.colorLinearProfile}>
        <View style={styles.container}>
          <StatusBar
            backgroundColor={R.colors.colorMain}
            barStyle="light-content"
          />
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              paddingLeft: WIDTHXD(73),
              paddingRight: WIDTHXD(60),
              alignItems: 'center',
              minHeight: HEIGHTXD(99),
              paddingTop: HEIGHTXD(58),
              paddingBottom: HEIGHTXD(74)
            }}>
            <TouchableOpacity
              hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
              onPress={this._onPressBack}>
              <Fontisto
                name="angle-left"
                size={WIDTHXD(46)}
                color={R.colors.white}
              />
            </TouchableOpacity>
            {isSearch ? this.renderInputHeader() : this.renderNormalHeader()}
            <TouchableOpacity
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 50 }}
              onPress={this.props.onFilterPress}>
              <Image
                resizeMode="contain"
                source={R.images.iconFilter}
                style={styles.btn}
              />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient >
    );
  }
}

function mapStateToProps(state) {
  return {
    documentStatus: state.vOfficeReducer.filter.documentStatus,
    signStatus: state.vOfficeReducer.filter.signStatus,
  }
}
export default connect(mapStateToProps, { setFilterVOffice })(HeaderVOffice)
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  btnTextInput: {
    justifyContent: 'center',
    flex: 0
  },
  header_input: {
    flex: 1,
    height: HEIGHTXD(132),
    paddingVertical: 0,
    fontSize: getFontXD(40),
    fontWeight: '400',
    fontFamily: R.fonts.RobotoMedium,
    textAlignVertical: 'top',
    color:R.colors.black0
  },
  header_input_container: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: WIDTHXD(30),
    alignItems: 'center',
    marginLeft: WIDTHXD(40),
    marginRight: WIDTHXD(41),
    minHeight: HEIGHTXD(99),
    backgroundColor: R.colors.white,
    borderRadius: WIDTHXD(20)
  },
  header_normal_container: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    marginLeft: WIDTHXD(27),
    marginRight: WIDTHXD(60),
    minHeight: HEIGHTXD(99),
  },
  backBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: HEIGHTXD(58),
    paddingBottom: HEIGHTXD(74)
  },
  textTitle: {
    fontSize: getFontXD(54),
    flex: 1,
    color: R.colors.white,
    fontFamily: R.fonts.RobotoMedium
  },
  view: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: WIDTHXD(917),
    marginLeft: WIDTHXD(40)
  },
  iconSearch: {
    height: WIDTHXD(43),
    width: WIDTHXD(43)
  },
  btn: {
    height: WIDTHXD(75),
    width: WIDTHXD(75),
    justifyContent: 'center',
    alignItems: 'center'
  }
});
