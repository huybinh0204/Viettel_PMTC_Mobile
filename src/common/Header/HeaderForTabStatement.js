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
  Animated
} from 'react-native';
import {connect} from 'react-redux'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import LinearGradient from 'react-native-linear-gradient';
import NavigationService from '../../routers/NavigationService';
import { getFontXD, WIDTHXD, HEIGHTXD, getLineHeightXD } from '../../config';
import R from '../../assets/R';
import global from '../../features/Statement/global';
import {
  setIsHideGroupStatement
} from '../../actions/statement';

class HeaderForTabStatement extends Component {

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
  // global.goBackPayment

  componentWillReceiveProps(nextProps)
  {
    if(this.props.cStatementId)
    {
      this.setState({
        isHideAllDetail: !nextProps.isHideGeneralInfoLine||!nextProps.isHideAccountantLine ||!nextProps.isHideBudgetLine || !nextProps.isHideDifferentLine,
        isHideAllGeneral: !nextProps.isHideGeneralInfo || !nextProps.isHideOfficeInfo || !nextProps.isHideMoneyInfo || !nextProps.isHideStatusInfo
      })   
    }
    else{
      this.setState({
        isHideAllDetail: !nextProps.isHideGeneralInfoLine||!nextProps.isHideAccountantLine ||!nextProps.isHideBudgetLine || !nextProps.isHideDifferentLine,
        isHideAllGeneral: !nextProps.isHideGeneralInfo
      })
      // setIsHideGroupStatement({
      //   isHideGeneralInfoLine: nextProps.isHideGeneralInfo,
      //   isHideAccountantLine: nextProps.isHideGeneralInfo,
      //   isHideBudgetLine: nextProps.isHideGeneralInfo,
      //   isHideDifferentLine: nextProps.isHideGeneralInfo,
      // });   
    }
  }

  render() {
    const {
      typeOfIconTabStatement,
      indexOfTab,
      isShowBtnSearch,
      onBackSatement,
      search,
      isSearch,
      onChangeSearch,
      placeholderSearch,
      setIsHideGroupStatement,
      onButtonSetting,
      typeOfIconAttackInfo,
      typeOfIconPaymentInfo
    } = this.props;
    const {isHideAllGeneral,isHideAllDetail}= this.state;
    return (
      <LinearGradient
        style={styles.container}
        colors={R.colors.colorHeaderGradienTab}
      >
        <View style={styles.container}>
          <StatusBar
            backgroundColor={R.colors.colorMain}
            barStyle="light-content"
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              flex: 1,
              paddingHorizontal: WIDTHXD(60)
            }}
          >
            <TouchableOpacity
              hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
              onPress={() => {
                if (indexOfTab === 1 && typeOfIconTabStatement === 1 || typeOfIconTabStatement ===2 ) {
                  if (global.goBackToListDetailStatement) {
                    global.goBackToListDetailStatement();
                    this.props.setIsShowBtnSearch(true);
                  }
                } else {
                  if(indexOfTab === 2 && typeOfIconAttackInfo === 1)
                  {
                    if (global.goBackToListListAttackFile) {
                      global.goBackToListListAttackFile();
                    }
                  }
                  else{
                    if(indexOfTab === 3 && typeOfIconPaymentInfo === 1)
                    {
                      if (global.goBackPayment) {
                        global.goBackPayment();
                      }
                    }
                    else{
                      NavigationService.pop();
                      setIsHideGroupStatement({
                        isHideGeneralInfo:true,
                        isHideOfficeInfo:true,
                        isHideMoneyInfo:true,
                        isHideStatusInfo:true,
                        isHideGeneralInfoLine:true,
                        isHideAccountantLine:true,
                        isHideBudgetLine:true,
                        isHideDifferentLine:true,
                      })
                    }
                  }
                }
              }}
              style={styles.backBtn}
            >
              <Fontisto
                name="angle-left"
                size={WIDTHXD(46)}
                color={R.colors.white}
              />
            </TouchableOpacity>
            <View>
              {isSearch ? (
                <View style={styles.btnSearch}>
                  <TextInput
                    value={search}
                    // onEndEditing={() => setIsSearch(false)}
                    onChangeText={onChangeSearch}
                    placeholder={placeholderSearch}
                    style={styles.formEnterInfo}
                    placeholderTextColor='#8D8D8D'
                  />
                  <TouchableOpacity
                    hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
                    onPress={() => onChangeSearch('')}
                    style={{ flex: 0 }}
                  >
                    <Ionicons
                      name="ios-search"
                      size={WIDTHXD(43)}
                      color="#8D8D8D"
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.view}>
                  <Text style={styles.textTitle}>{
                    (indexOfTab === 1 && typeOfIconTabStatement === 1 || typeOfIconTabStatement === 2) ? 'Chi tiết Tờ trình' : this.props.title}</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      width: WIDTHXD(210)
                    }}
                  >
                    { indexOfTab === 1 && typeOfIconTabStatement === 0 && isShowBtnSearch ? (
                      <TouchableOpacity
                        onPress={this.props.onButtonSearch}
                        style={{ flex: 0, alignContent: 'flex-end' }}
                      >
                        <Image
                          resizeMode="contain"
                          source={R.images.iconSearch}
                          style={styles.btn}
                        />
                      </TouchableOpacity>
                    ) : (
                      // ((indexOfTab === 0) || (indexOfTab === 1 && typeOfIconTabStatement === 1)) &&(
                      ((indexOfTab === 0) || (indexOfTab === 1)&& (typeOfIconTabStatement === 1 || typeOfIconTabStatement ===2)) &&(
                      <TouchableOpacity
                        onPress={() => {
                          if (this.props.setIsHideGroupStatement) {
                            switch (indexOfTab) {
                              case 0:
                                {
                                    setIsHideGroupStatement({
                                      isHideGeneralInfo: isHideAllGeneral,
                                      isHideOfficeInfo: isHideAllGeneral,
                                      isHideMoneyInfo: isHideAllGeneral,
                                      isHideStatusInfo: isHideAllGeneral,
                                    });
                                    this.setState({isHideAllGeneral: !isHideAllGeneral})
                                }
                                break;
                              case 1:
                                {
                                  setIsHideGroupStatement({
                                    isHideGeneralInfoLine: isHideAllDetail,
                                    isHideAccountantLine: isHideAllDetail,
                                    isHideBudgetLine: isHideAllDetail,
                                    isHideDifferentLine: isHideAllDetail,
                                  });
                                  this.setState({isHideAllDetail: !isHideAllDetail})

                                  // if(isHideAllDetail)
                                  // {
                                  //   setIsHideGroupStatement({
                                  //     isHideGeneralInfoLine: false,
                                  //     isHideAccountantLine: false,
                                  //     isHideBudgetLine: false,
                                  //     isHideDifferentLine: false,
                                  //   });
                                  // }
                                  // else{
                                  //   setIsHideGroupStatement({
                                  //     isHideGeneralInfoLine: true,
                                  //     isHideAccountantLine: true,
                                  //     isHideBudgetLine: true,
                                  //     isHideDifferentLine: true,
                                  //   });
                                  // }
                                  // this.setState({ isHideAllDetail: !isHideAllDetail })
                                }
                                break;
                              default:
                                return name;
                            }
                          }
                        }}
                        style={{
                          flex: 0,
                          alignContent: 'flex-end',
                          marginLeft: WIDTHXD(30)
                        }}
                      >
                        
                        <Image
                          resizeMode="contain"
                          source={indexOfTab === 0 ? (this.state.isHideAllGeneral ? R.images.openEye : R.images.iconEyeHide) : (this.state.isHideAllDetail ? R.images.openEye : R.images.iconEyeHide)}
                          style={styles.btn}
                        />
                      </TouchableOpacity>
                      )
                    )}
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      </LinearGradient>
    );
  }
}

function mapStateToProps(state) {
  return {
    isHideGeneralInfoLine: state.statementRuducer.isHideGeneralInfoLine,
    isHideAccountantLine: state.statementRuducer.isHideAccountantLine,
    isHideBudgetLine: state.statementRuducer.isHideBudgetLine,
    isHideDifferentLine: state.statementRuducer.isHideDifferentLine,

    isHideGeneralInfo: state.statementRuducer.isHideGeneralInfo,
    isHideOfficeInfo: state.statementRuducer.isHideOfficeInfo,
    isHideMoneyInfo: state.statementRuducer.isHideMoneyInfo,
    isHideStatusInfo: state.statementRuducer.isHideStatusInfo,
    cStatementId: state.statementRuducer.cStatementId,
    typeOfIconAttackInfo: state.statementRuducer.typeOfIconAttackInfo,
    typeOfIconPaymentInfo: state.statementRuducer.typeOfIconPaymentInfo,
  }
}
export default connect(mapStateToProps, {setIsHideGroupStatement})(HeaderForTabStatement)
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  btnTextInput: {
    justifyContent: 'center',
    flex: 0
  },
  formEnterInfo: {
    width: WIDTHXD(800),
    fontSize: getFontXD(36),
    fontFamily: R.fonts.RobotoMedium,
    color:R.colors.black0
  },
  btnSearch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: WIDTHXD(30),
    alignItems: 'center',
    marginLeft: WIDTHXD(40),
    minHeight: HEIGHTXD(99),
    backgroundColor: R.colors.white,
    width: WIDTHXD(917),
    borderRadius: WIDTHXD(20)
  },
  backBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: HEIGHTXD(20),
    marginTop:HEIGHTXD(60),
    marginLeft:WIDTHXD(20)
  },
  textTitle: {
    fontSize: getFontXD(54),
    lineHeight: getLineHeightXD(65),
    color: R.colors.white,
    fontFamily: R.fonts.RobotoMedium
  },
  view: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: WIDTHXD(900),
    marginLeft: WIDTHXD(60),
    marginTop:HEIGHTXD(60),
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
