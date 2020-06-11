import React, { Component } from 'react';
import { StyleSheet, Text, View, LayoutAnimation, TouchableOpacity, FlatList, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import i18n from 'assets/languages/i18n';
import R from '../../../../../assets/R';
import { HEIGHTXD, WIDTHXD, getFontXD, getWidth, getLineHeightXD } from '../../../../../config/Function';
import NavigationService from 'routers/NavigationService';
import { ListStatement } from 'routers/screenNames';
import moment from 'moment'
import _ from 'lodash'

class ItemStatement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: true,
      reRender: false,
      statementSelected: [],
      isReadOnly: true,
      transDate: ''
    }
  }

  componentDidMount() {
    this.setState({
      isReadOnly: this.props.isReadOnly,
      statementSelected: this.props.dataStatement,
      transDate: this.props.transDate
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.showAllField !== this.props.showAllField) {
      this.setState({ expanded: nextProps.showAllField })
    }
    if (nextProps.isReadOnly !== this.props.isReadOnly) {
      this.setState({ isReadOnly: nextProps.isReadOnly })
    }
    if (nextProps.reRender !== this.props.reRender) {
      this.setState({ reRender: nextProps.reRender })
    }
    if (nextProps.transDate !== this.props.transDate) {
      this.setState({ transDate: nextProps.transDate })
    }
  }

  changeLayout = () => {
    LayoutAnimation.configureNext(
      {
        duration: 500,
        create: {
          type: LayoutAnimation.Types.spring,
          property: LayoutAnimation.Properties.scaleY,
          springDamping: 1.7,
        },
        update: {
          type: LayoutAnimation.Types.spring,
          springDamping: 1.7,
        },
      }
    );
    this.setState({ expanded: !this.state.expanded });
  }

  renderItem = (item, index) => {
    // const { navigate } = this.props.navigation;

    return (
      <View style={styles.item}>
        <Text numberOfLines={1} style={styles.labelItem}>{`${item.documentNo} - ${item.description}`}</Text>
        <TouchableOpacity
          style={styles.btnDelete}
          onPress={() => this.deleteStatement(index)}
        >
          {!this.state.isReadOnly ?
            <Image
              resizeMode="contain"
              source={R.images.iconDeleteStament}
              style={{
                width: WIDTHXD(72),
                height: WIDTHXD(72),
              }}
            />
            : null}
        </TouchableOpacity>
      </View>
    )
  }

  deleteStatement = (index) => {
    if (this.props.dataStatement.length > index) {
      this.props.dataStatement.splice(index, 1)
      this.props.updateStatementData()
    }
  }

  _onPressItem = (items) => {
  }

  render() {
    const { expanded, isReadOnly, transDate } = this.state;
    const { dataStatement } = this.props
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this.changeLayout}
          style={[styles.flexTitle, { borderBottomWidth: (expanded === true) ? 0.3 : 0, paddingHorizontal: WIDTHXD(30) }]}
        >
          <View style={styles.flexRow}>
            <Text style={styles.title}>{i18n.t('STATEMENT_T')}</Text>
            <Text style={styles.titleWapper}>{dataStatement.length.toString()}</Text>
          </View>
          {expanded === true ? <Ionicons name="ios-arrow-down" size={WIDTHXD(50)} style={{ marginRight: WIDTHXD(50) }} color={R.colors.iconGray} />
            : <Ionicons name="ios-arrow-forward" size={WIDTHXD(50)} style={{ marginRight: WIDTHXD(50) }} color={R.colors.iconGray} />}
        </TouchableOpacity>
        {expanded && (
          <View style={{ paddingHorizontal: WIDTHXD(30), paddingVertical: HEIGHTXD(40) }}>
            <FlatList
              data={dataStatement}
              extraData={this.state}
              renderItem={({ item, index }) => this.renderItem(item, index)}
            >
            </FlatList>
            {isReadOnly ?
              null :
              <View style={styles.flexRowCenter}>
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => NavigationService.navigate(ListStatement, {
                    // onPressItem: this._onPressItem
                    onPressItem: (items) => {
                      // this.setState({ reRender: !this.state.reRender })
                      this.props.updateStatementData(dataStatement)
                    },
                    dataStatement: dataStatement,
                    transDate: transDate

                  })}
                >
                  <Image
                    resizeMode="contain"
                    source={R.images.iconAdd}
                    style={{
                      width: WIDTHXD(99),
                      height: WIDTHXD(99),
                    }}
                  />
                  <Text style={[styles.label, { marginLeft: WIDTHXD(26) }]}>{i18n.t('ADD_STATEMENT')}</Text>
                </TouchableOpacity>

              </View>
            }
          </View>)}
      </View>
    )
  }
}

export default ItemStatement;

const styles = StyleSheet.create({
  container: {
    backgroundColor: R.colors.white,
    width: getWidth(),
    shadowColor: '#181F4D21',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  flexRowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: WIDTHXD(16)
  },

  flexTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: HEIGHTXD(36),
    borderBottomColor: R.colors.borderGray
  },
  flexColumn: {
    flexDirection: 'column',
  },
  title: {
    fontSize: getFontXD(42),
    lineHeight: getLineHeightXD(56),
    fontFamily: R.fonts.RobotoBold,
    color: R.colors.colorMain,
    textTransform: 'uppercase',
  },

  titleWapper: {
    fontSize: getFontXD(42),
    lineHeight: getLineHeightXD(56),
    fontFamily: R.fonts.RobotoBold,
    color: R.colors.colorMain,
    textTransform: 'uppercase',
    borderRadius: HEIGHTXD(20),
    borderWidth: 1,
    marginLeft: WIDTHXD(35),
    borderColor: R.colors.borderGray,
    paddingHorizontal: HEIGHTXD(36),

  },

  wrapperText: {
    borderRadius: HEIGHTXD(20),
    paddingHorizontal: WIDTHXD(36),
    paddingVertical: WIDTHXD(36),
    justifyContent: 'center',
    borderWidth: 1,
    marginLeft: WIDTHXD(253),
    borderColor: R.colors.borderGray,
  },
  label: {
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular,
    marginVertical: HEIGHTXD(13),
    color: R.colors.label,
  },
  line: {
    height: HEIGHTXD(235),
    position: 'absolute',
    width: WIDTHXD(4),
    right: WIDTHXD(330),
    bottom: HEIGHTXD(36),
    backgroundColor: R.colors.colorBackground,
    flex: 1,
  },
  type: {
    width: WIDTHXD(320),
    marginLeft: WIDTHXD(60),
    paddingBottom: HEIGHTXD(20),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.color777,
    fontSize: getFontXD(60),
  },
  borderText: {
    flex: 0,
    borderBottomWidth: 1,
    borderColor: R.colors.colorBackground,
    paddingLeft: HEIGHTXD(36),
  },
  deNghi: {
    width: getWidth() / 5,
    textAlign: 'right',
    paddingBottom: HEIGHTXD(20),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.color777,
    fontSize: getFontXD(36),
  },
  duocDuyet: {
    width: getWidth() / 5,
    textAlign: 'right',
    marginRight: WIDTHXD(60),
    paddingBottom: HEIGHTXD(20),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.color777,
    fontSize: getFontXD(36),
  },
  leftTitle: {
    fontFamily: R.fonts.RobotoMedium,
    fontSize: getFontXD(36),
  },
  rightTitle: {
    marginRight: WIDTHXD(50),
    fontFamily: R.fonts.RobotoMedium,
    fontSize: getFontXD(36),
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(119,134,158, 0.2)',
    paddingVertical: HEIGHTXD(24),
    paddingHorizontal: HEIGHTXD(36),
    marginVertical: HEIGHTXD(18),
    borderRadius: HEIGHTXD(20),
  },

  labelItem: {
    width: WIDTHXD(930),
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular,
    marginVertical: HEIGHTXD(13),
    color: R.colors.label,
    opacity: 1
  },

  btn: {
    flexDirection: 'row',
    width: WIDTHXD(360),
    height: WIDTHXD(99),
    justifyContent: 'center',
    alignItems: 'center',
  },

  btnDelete: {
    width: WIDTHXD(72),
    height: WIDTHXD(72),
    marginRight: WIDTHXD(54)
  }
})
