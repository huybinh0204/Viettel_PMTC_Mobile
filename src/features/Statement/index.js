import React from 'react'
import { Text, View, TouchableOpacity, ScrollView, StyleSheet, LayoutAnimation, FlatList } from 'react-native'
import FastImage from 'react-native-fast-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import _ from 'lodash'
import R from '../../assets/R'
import { connect } from 'react-redux';
import { WIDTHXD, HEIGHTXD, getFontXD, convertTypeFile } from '../../config/Function'
import AdvanceRequest from '../../apis/Functions/advanceRequest'
import global from './global'

class SubmissonProcess extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      expandedAttack: false,
      expandedApproval: false,
      details: {},
      attacks: [],
      attacksMain: [],
      signers: []
    }
  }

  componentDidMount() {
    this._getVoffice()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.id !== this.props.id) this._getVoffice(nextProps.id)
  }

  _getVoffice = async (id) => {
    try {
      const body = {
        recordId: this.props.cStatementId,
        adTableId: 1000471
      }
      const response = await AdvanceRequest.vOffice(body)
      if (response && response.status === 200) {
        let { attacksMain, attacks } = this.state
        for (let i = 0; i < response.data.attachmentinfoDTOLst; i++) {
          if (response.data.attachmentinfoDTOLst[i].isFileSign) {
            attacksMain.push(response.data.attachmentinfoDTOLst[i])
          } else {
            attacks.push(response.data.attachmentinfoDTOLst[i])
          }
        }
        this.setState({
          details: response.data,
          attacks,
          attacksMain,
          signers: response.data.cSigninfomationDTOLst
        })
      }
    } catch (err) {
    }
  }

  changeLayoutAttack = () => {
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
    this.setState({ expandedAttack: !this.state.expandedAttack });
  }

  changeLayoutApproval = () => {
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
    this.setState({ expandedApproval: !this.state.expandedApproval });
  }

  render() {
    const { expandedAttack, expandedApproval, details, signers, attacksMain } = this.state
    const titlesign = details.titlesign ? details.titlesign : ''
    const priority = details.priority ? details.priority : ''
    const hardCopyDate = details.hardCopyDate ? details.hardCopyDate : ''
    if (_.isEmpty(details)) {
      return (
        <View><Text style={styles.noData}>Chưa có thông tin trình ký</Text></View>
      )
    } else {
      return (
        <ScrollView style={styles.container}>
          <View style={styles.viewTop}>
            <View style={styles.ctnContent}>
              <Text style={styles.title}>Trích yếu nội dung</Text>
              <Text style={styles.content}>{titlesign}</Text>
            </View>
            <View style={styles.ctnContent}>
              <Text style={styles.title}>Ngày duyệt Voffice</Text>
              <Text style={styles.content}>{hardCopyDate}</Text>
            </View>
            <View style={styles.ctnContent}>
              <Text style={styles.title}>Độ ưu tiên</Text>
              <Text style={styles.content}>{priority}</Text>
            </View>
          </View>

          <View style={styles.viewBottom}>
            <View style={{ flexGrow: 2 }}>
              <View style={styles.ctnMainText}>
                <Text style={styles.mainText}>Văn bản chính</Text>
                {attacksMain.length > 0 ?
                  <TouchableOpacity style={styles.btMainText}>
                    <FastImage source={R.strings.fileTypeIcon[2].icon} style={styles.icon} resizeMode={FastImage.resizeMode.stretch} />
                    <Text style={styles.txtMainText}>{attacksMain[0].filename}</Text>
                  </TouchableOpacity>
                  : null
                }
              </View>

              <View>
                <TouchableOpacity style={styles.btAttack} onPress={() => this.changeLayoutAttack()}>
                  <View style={styles.rowAttack}>
                    <Text style={styles.mainText}>Tệp đính kèm</Text>
                    <Text style={[styles.mainText, { marginLeft: WIDTHXD(8) }]}>{this.state.attacks.length}</Text>
                  </View>
                  {expandedAttack && <Ionicons name="ios-arrow-down" size={WIDTHXD(50)} style={{ marginRight: WIDTHXD(30) }} color={R.colors.iconGray} />}
                  {!expandedAttack && <Ionicons name="ios-arrow-forward" size={WIDTHXD(50)} style={{ marginRight: WIDTHXD(30) }} color={R.colors.iconGray} />}
                </TouchableOpacity>
                {
                  expandedAttack
                  && (
                    <FlatList
                      style={{ paddingBottom: HEIGHTXD(18) }}
                      data={this.state.attacks}
                      keyExtractor={(item, index) => index.toString()}
                      extraData={this.state}
                      renderItem={({ item }) => (
                        <TouchableOpacity style={styles.btMainText}>
                          <FastImage source={R.strings.fileTypeIcon[convertTypeFile(item.filename)].icon} style={styles.icon} resizeMode={FastImage.resizeMode.stretch} />
                          <Text style={styles.txtMainText} numberOfLines={2}>{item.filename}</Text>
                        </TouchableOpacity>
                      )
                      }
                    />
                  )
                }
              </View>

              <View>
                <TouchableOpacity style={styles.btAttack} onPress={() => this.changeLayoutApproval()}>
                  <Text style={[styles.mainText, { marginBottom: WIDTHXD(32) }]}>Danh sách ký duyệt</Text>
                  {expandedApproval && <Ionicons name="ios-arrow-down" size={WIDTHXD(50)} style={{ marginRight: WIDTHXD(30) }} color={R.colors.iconGray} />}
                  {!expandedApproval && <Ionicons name="ios-arrow-forward" size={WIDTHXD(50)} style={{ marginRight: WIDTHXD(30) }} color={R.colors.iconGray} />}
                </TouchableOpacity>
                {
                  expandedApproval
                  && (
                    <FlatList
                      style={{ paddingBottom: HEIGHTXD(18) }}
                      data={signers}
                      keyExtractor={(item, index) => index.toString()}
                      extraData={this.state}
                      renderItem={({ item }) => (
                        <TouchableOpacity style={styles.btApproval}>
                          <View style={styles.rowApproval}>
                            <FastImage
                              source={require('../../assets/images/category/iconPeople.png')}
                              style={styles.imageAvt}
                              resizeMode={FastImage.resizeMode.contain}
                            />
                            <View style={styles.colApproval}>
                              <Text style={styles.content}>{item.cSignerName}</Text>
                              <Text style={styles.title}>{item.cOfficepositionName}</Text>
                            </View>
                          </View>
                          <Text style={styles.status}>{item.rolestatus ? R.strings.local.TRANG_THAI_DUYET[item.rolestatus].name : ''}</Text>
                        </TouchableOpacity>
                      )
                      }
                    />
                  )
                }
              </View>
            </View>
          </View>
        </ScrollView>
      )
    }
  }
}

function mapStateToProps(state) {
  return {
    cStatementId: state.statementRuducer.cStatementId,
  };
}
export default connect(mapStateToProps, {
})(SubmissonProcess);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: R.colors.blueGrey51
  },
  noData: {
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.black0,
    textAlign: 'center',
    marginTop: HEIGHTXD(86)
  },
  viewTop: {
    backgroundColor: R.colors.white,
    marginTop: WIDTHXD(24),
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    elevation: 2,
    marginBottom: HEIGHTXD(18)
  },
  btApproval: {
    backgroundColor: R.colors.white,
    borderRadius: WIDTHXD(20),
    paddingHorizontal: WIDTHXD(42),
    paddingVertical: WIDTHXD(18),
    marginBottom: WIDTHXD(24),
    shadowColor: '#000',
    shadowOffset: { width: 1.2, height: 2 },
    shadowOpacity: 0.3,
    elevation: 3
  },
  status: {
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.colorStatusSubmisson,
    alignSelf: 'flex-end',
    fontStyle: 'italic'
  },
  imageAvt: {
    flex: 1,
    width: WIDTHXD(120),
    height: HEIGHTXD(120),
    borderRadius: WIDTHXD(60)
  },
  rowApproval: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  colApproval: {
    flex: 4,
    marginRight: WIDTHXD(32),
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  btAttack: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: WIDTHXD(48)
  },
  rowAttack: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  ctnContent: {
    paddingTop: WIDTHXD(20),
    paddingBottom: WIDTHXD(48),
    borderBottomColor: R.colors.borderE6,
    borderBottomWidth: WIDTHXD(1),
    paddingHorizontal: WIDTHXD(36),
    justifyContent: 'space-around'
  },
  title: {
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.color777
  },
  content: {
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.black0,
    marginTop: WIDTHXD(8)
  },
  viewBottom: {
    flex: 2,
    paddingHorizontal: WIDTHXD(36),
    backgroundColor: R.colors.blueGrey51
  },
  ctnMainText: {
    marginTop: WIDTHXD(48)
  },
  btMainText: {
    flexDirection: 'row',
    paddingVertical: WIDTHXD(36),
    backgroundColor: R.colors.white,
    paddingLeft: WIDTHXD(30),
    borderRadius: WIDTHXD(20),
    marginTop: WIDTHXD(20),
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 2, height: 2 },
    elevation: 3,
  },
  mainText: {
    fontFamily: R.fonts.RobotoRegular,
    fontSize: getFontXD(42),
    color: R.colors.color777
  },
  icon: {
    width: WIDTHXD(55),
    height: HEIGHTXD(68)
  },
  txtMainText: {
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.black0,
    marginLeft: WIDTHXD(18),
    marginRight: WIDTHXD(64)
  }
})
