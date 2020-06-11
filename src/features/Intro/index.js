import { Image, StatusBar, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import * as React from 'react';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import { fetchListInvoice, fetchCurrencyList, fetchListChanel, fetchListTypeTax } from 'actions/invoice'
import axios from 'axios';
import AsyncStorageUtils from '../../helpers/AsyncStorageUtils';
import NavigationService from '../../routers/NavigationService';
import styles from './styles';
import i18n, { setLocation } from '../../assets/languages/i18n';
import { showAlert, TYPE } from '../../common/DropdownAlert';
import R from '../../assets/R';
import { getUserInfor } from '../../actions/users';
// import { getUser, createSession } from '../../apis/Functions/users'

export class Intro extends React.PureComponent {
  async componentDidMount() {
    this.props.fetchListInvoice({
      adOrgId: '1000433',
      start: 0,
      maxResult: R.strings.PAGE_LIMIT.PAGE_INVOICE,
      sortField: 'TRANS_DATE',
      sortDir: 'DESC'
    })
    let body = {
      isSize: 'true',
      name: ''
    }
    this.props.fetchCurrencyList(body)
    this.props.fetchListTypeTax(body)
    this.props.fetchListChanel(body)
    let routeName = 'TabMain';
    setLocation(i18n, 'vi')
    await AsyncStorage.multiGet([
      AsyncStorageUtils.KEY.INIT_STORGE
    ], async (err, results) => {
      let account = JSON.parse(results[0][1]);
      if (account) {
        axios.defaults.headers.common.Authorization = `Bearer ${account.tokenLogin}`;
      } else {
      }
    });
    this.changeScreen(routeName);

    // let bodyCreateSession = {
    //   userName: '061714',
    //   userId: 21447,
    //   roleId: 1051,
    //   orgIdList: [1000000],
    //   departmentIdList: [1016763]
    // }
    // console.log('body', bodyCreateSession)
    // const responseCreateSession = await createSession(bodyCreateSession);
    // console.log('responseCreateSession', responseCreateSession)
    // const response = await getUser('061714');
    // if (response.status === 200) {
    //   this.props.getUserInfor(response.data);
    //   console.log("aslkdjlaksjdlkajdlkajlksdjlkad", response.data)
    //   showAlert(TYPE.SUCCESS, i18n.t('NOTIFICATION_T'), 'Lấy thông tin User thành công');
    // }
  
  }

  changeScreen(routeName) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      NavigationService.reset(routeName);
    }, 3500);
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={R.colors.colorWhite} />
        <Animatable.View
          animation="bounceIn"
          direction="alternate"
          duration={4000}
          style={styles.logoContainer}
        >
          {/* <Image
            resizeMode="contain"
            source={R.images.logoMain}
            style={styles.image}
          /> */}
        </Animatable.View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    userInfo: state,
  };
}

export default connect(mapStateToProps, {
  fetchListInvoice, fetchCurrencyList, getUserInfor, fetchListChanel, fetchListTypeTax
})(Intro);
