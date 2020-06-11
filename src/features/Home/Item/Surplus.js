
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import { WIDTH, HEIGHTXD, WIDTHXD, getFontXD, getLineHeightXD, numberWithCommas } from '../../../config';
import R from '../../../assets/R';
import { fetchAmtDashboard, fetchPdbDashboard } from '../SoLieuChiTiet';
import moment from 'moment';

const ItemSurplus = (props) => {
  const [type, setType] = useState(props.type || 'SDNS'); // SDNS, SDCNCN
  const [data, setData] = useState([0, 0, 0]);
  const [dataAtm, setDataAtm] = useState([0, 0, 0]);
  const [dataPdb, setDataPdb] = useState([0]);

  useEffect(() => {
    if (type === 'SDNS') {
      setData(dataAtm)
      fetchAmtDashboard(props.userData.loggedIn.adOrgId, props.userData.loggedIn.adUserDepartmentId).then(data => {
        let dataAtm_ = [0, 0, 0];
        // console.log('data', data)
        let dataSum = data.filter(x => x.quarterNo === null);
        if (dataSum.length > 0) {
          dataAtm_[0] = dataSum[0].planAmount;
          dataAtm_[1] = dataSum[0].useAmount;
          dataAtm_[2] = dataSum[0].remainAmount;
        }
        // console.log('ItemSurplus fetch atm', dataAtm_);
        type === 'SDNS' && setData(dataAtm_); // avoid user swipe fast
        setDataAtm(dataAtm_);
      })
    } else {
      setData(dataPdb);
      const user = props.userData;
      fetchPdbDashboard(user.loggedIn.adOrgId, user.adUserId, user.name, true).then(data => {
        let dataPdb = [0];
        if (data && data.length > 0) {
          let value = data[0].amtSourceRs;
          if (!value || isNaN(value)) {
            value = 0;
          }
          dataPdb = [value]
        }

        type === 'SDCNCN' && setData(dataPdb); // avoid user swipe fast
        setDataPdb(dataPdb)
      })
    }
  }, [props.userData.loggedIn.adOrgId, type])
  // let data = props.data;
  // console.log(data)
  if (!data) {
    // 0: total, 1: use, 2: remain
    data = [0, 0, 0];
  }
  let flex1 = 1;
  let flex2 = 1;

  if (data[1] !== data[2]) {
    let d2 = data[2];
    if (d2 < 0) d2 = Math.abs(data[2]);
    if (data[1] > d2) {
      flex1 = 1;
      flex2 = d2 / data[1];
    } else {
      flex1 = data[1] / d2;
      flex2 = 1;
    }
  }

  let title = 'Số dư ngân sách';

  if (type === 'SDCNCN') {
    title = 'Số dư công nợ cá nhân';
  }

  const toogleType = () => {
    const newType = type === 'SDNS' ? 'SDCNCN' : 'SDNS';
    setType(newType);
    props.onTypeChange && props.onTypeChange(newType);
  }

  return (
    <TouchableOpacity style={[
      styles.container, {
        minHeight: WIDTHXD(type === 'SDNS' ? 427 : 320)
      }]}
      activeOpacity={0.8}
      onPress={() => props.onPress && props.onPress(type)}
      disabled={!props.onPress}>
      <Text style={styles.soDu}>{numberWithCommas(data[0])}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingHorizontal: WIDTHXD(54) }}>
        <TouchableOpacity hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          onPress={toogleType}>
          <Icon name="left" size={WIDTHXD(45)} />
        </TouchableOpacity>
        <Text style={styles.soDuNS}>{title}</Text>
        <TouchableOpacity hitSlop={{ top: 20, bottom: 50, left: 20, right: 20 }}
          onPress={toogleType}>
          <Icon name="right" size={WIDTHXD(45)} />
        </TouchableOpacity>
      </View>
      {(type === 'SDNS') && (<View style={styles.lineChart}>
        <View style={{ ...styles.part1, flex: flex1 }} />
        <View style={{ ...styles.part2, flex: flex2 }} />
      </View>)}
      {(type === 'SDNS') && (<View style={styles.viewText}>
        <View
          style={styles.viewTxtPart1}
        >
          <Text style={styles.txt}>0</Text>
          <Text style={styles.txt}>{numberWithCommas(Math.round(data[1] / 1000000))}tr</Text>
        </View>
        <Text style={[styles.txt, { marginRight: -WIDTH(15) }]}>{numberWithCommas(Math.round(data[2] / 1000000))}tr</Text>
      </View>)}
    </TouchableOpacity>
  )
}

export default ItemSurplus;

const styles = StyleSheet.create({
  container: {
    width: WIDTHXD(1035),
    minHeight: HEIGHTXD(427),
    backgroundColor: R.colors.white,
    alignSelf: 'center',
    borderRadius: HEIGHTXD(36),
    alignItems: 'center',
    // position: 'absolute',
    paddingBottom: HEIGHTXD(58),
    marginTop: -WIDTHXD(427) / 2,
    shadowColor: '#00000014',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
  soDu: {
    fontSize: getFontXD(105),
    lineHeight: getLineHeightXD(128),
    fontFamily: R.fonts.RobotoMedium,
    opacity: 1,
    color: '#000000',
    marginTop: HEIGHTXD(57),

  },
  soDuNS: {
    fontSize: getFontXD(39),
    lineHeight: getLineHeightXD(48),
    color: R.colors.black0,
    fontFamily: R.fonts.RobotoMedium,
    opacity: 1,
    letterSpacing: 0.34
  },
  part1: {
    // width: WIDTHXD(331),
    flex: 1,
    height: HEIGHTXD(15),
    backgroundColor: R.colors.colorMain,
    borderTopLeftRadius: WIDTHXD(8),
    borderBottomLeftRadius: WIDTHXD(8)
  },
  part2: {
    // width: WIDTHXD(521),
    flex: 1,
    height: HEIGHTXD(15),
    backgroundColor: '#F57300',
    borderTopRightRadius: WIDTHXD(5),
    borderBottomRightRadius: WIDTHXD(8),
  },
  lineChart: {
    flexDirection: 'row',
    marginTop: HEIGHTXD(53),
    marginHorizontal: WIDTHXD(79)
  },
  viewText: {
    flexDirection: 'row',
    width: WIDTHXD(852),
    justifyContent: 'space-between',
    marginTop: HEIGHTXD(23),
    alignSelf: 'center'
  },
  viewTxtPart1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: WIDTHXD(368),
  },
  txt: {
    color: R.colors.indigoA701,
    fontSize: getFontXD(36),
    lineHeight: getLineHeightXD(44),
    fontFamily: R.fonts.RobotoRegular,
    opacity: 1,
    letterSpacing: 0
  }
});
