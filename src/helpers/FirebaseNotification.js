/* eslint-disable no-console */
import React from 'react';
import { Platform, View } from 'react-native';
import firebase from 'react-native-firebase';
import { Notification } from 'react-native-firebase';
import AsyncStorageUtils from 'helpers/AsyncStorageUtils';
import R from '../assets/R';
import { showAlert, TYPE } from '../common/DropdownAlert'
import sampleaudio from '../../sampleaudio.mp3'
import { getNotificationListRequest } from '../apis/Functions/notification'
import { connect } from 'react-redux'
import { updateNotifyNumber } from '../actions/users'
import _ from 'lodash'
import { TABLE_INVOICE_GROUP_ID, TABLE_ADVANCE_REQUEST_ID, TABLE_STATEMENT_ID_2 } from '../config/constants'



/**
   * This Function to listen event from firebase messing.
   * This show view with input when touch it show a modal search
   * @callback onOpened Function call when Open notifycation
   * @callback onReceived Function call when App received notifycation from Firebase
   * Both functions that receive data are the content of the message
   */
class FirebaseNotification extends React.PureComponent {
  checkPermission = () => {
    firebase.messaging().hasPermission()
      .then(enabled => {
        if (enabled) {
          this.getToken();
        } else {
          this.requestPermission();
        }
      });
  }

  requestPermission = async () => {
    try {
      await firebase.messaging().requestPermission();
      this.getToken();
    } catch (error) {
      // console.log('permission rejected');
    }
  }

  getToken = async () => {
    let fcmToken = await AsyncStorageUtils.get(AsyncStorageUtils.KEY.FCM_TOKEN);
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        // console.log('fcmToken:', fcmToken);
        await AsyncStorageUtils.save(AsyncStorageUtils.KEY.FCM_TOKEN, fcmToken);
      }
    }
    // console.log('fcmToken:', fcmToken);
  }

  async componentDidMount() {
    this.checkPermission();
    this.createNotificationListeners();
    this.removeNotificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification: Notification) => {
      this.props.onReceived(notification)
      showAlert(TYPE.INFO, notification.title, notification.body)
      // Process your notification as required
      // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
    });
  }

  componentWillUnmount() {
    this.removeNotificationDisplayedListener();
    this.notificationListener;
    this.notificationOpenedListener;
  }

  getNotifyNumber = async () => {
    const body = { userId: this.props.userData.adUserId, start: 1, maxResult: 10 }
    const response = await getNotificationListRequest(body);
    this.props.updateNotifyNumber((response.data.data && response.data.data.length > 0) ? response.data.data[0].countReadNo : 0)
  }

  genNotificationBody = (data) => {
    let textNotify = ''
    switch (data.adTableId) {
      case TABLE_STATEMENT_ID_2:
        sourceIcon = R.images.toTrinh;
        textNotify = `Tờ trình số ${data.documentNo}`
        break
      case TABLE_INVOICE_GROUP_ID:
        sourceIcon = R.images.bangTHTT;
        textNotify = `BTHTT số ${data.documentNo}`
        break
      case TABLE_ADVANCE_REQUEST_ID:
        sourceIcon = R.images.deNghi;
        textNotify = `Đề nghị thanh toán số ${data.documentNo}`
        break
    }
    switch (data.type) {
      case 0:
        action = 'vừa chuyển trạng thái duyệt sang'
        if (data.adTableId === TABLE_INVOICE_GROUP_ID) {
          _.forEach(R.strings.local.APPROVE_STATUS_INVOICE_GROUP_FILTER, (itemAprrove) => {
            if (itemAprrove.value === data.status) {
              textNotify = `${textNotify} vừa chuyển trạng thái duyệt sang ${itemAprrove.name}`
            }
          })
        } else {
          _.forEach(R.strings.local.TRANG_THAI_DUYET_ADVANCE_REQUEST, (itemAprrove) => {
            if (itemAprrove.value === data.status) {
              textNotify = `${textNotify} vừa chuyển trạng thái duyệt sang ${itemAprrove.name}`
            }
          })
        }
        break
      case 1:
        _.forEach(R.strings.local.TRANG_THAI_CHI, (itemPay) => {
          if (itemPay.value === data.status) {
            textNotify = `${textNotify} vừa chuyển trạng thái chi sang ${itemPay.name}`
          }
        })
        break
      case 2:
        textNotify = `${textNotify} đã quá hạn`
        break
    }
    return textNotify
  }


  async createNotificationListeners() {
    /*
   * Triggered when a particular notification has been received in foreground
   * */

    const channel = new firebase.notifications.Android.Channel(
      '500',
      'Channel Name',
      firebase.notifications.Android.Importance.Max
    ).setDescription('A natural description of the channel')
      .setSound('default');

    firebase.notifications().android.createChannel(channel);
    this.notificationListener = firebase.notifications().onNotification((notification) => {
      // console.log('onNotification:', notification);
      // let textNotify = this.genNotificationBody(notification.data)
      let textNotify = ''
      let data = notification.data
      switch (parseInt(data.adTableId, 10)) {
        case TABLE_STATEMENT_ID_2:
          sourceIcon = R.images.toTrinh;
          textNotify = `Tờ trình số ${data.documentNo}`
          break
        case TABLE_INVOICE_GROUP_ID:
          sourceIcon = R.images.bangTHTT;
          textNotify = `BTHTT số ${data.documentNo}`
          break
        case TABLE_ADVANCE_REQUEST_ID:
          sourceIcon = R.images.deNghi;
          textNotify = `Đề nghị thanh toán số ${data.documentNo}`
          break
      }
      switch (parseInt(data.type, 10)) {
        case 0:
          action = 'vừa chuyển trạng thái duyệt sang'
          if (data.adTableId === TABLE_INVOICE_GROUP_ID) {
            _.forEach(R.strings.local.APPROVE_STATUS_INVOICE_GROUP_FILTER, (itemAprrove) => {
              if (itemAprrove.value === data.status) {
                textNotify = `${textNotify} vừa chuyển trạng thái duyệt sang ${itemAprrove.name}`
              }
            })
          } else {
            _.forEach(R.strings.local.TRANG_THAI_DUYET_ADVANCE_REQUEST, (itemAprrove) => {
              if (itemAprrove.value === data.status) {
                textNotify = `${textNotify} vừa chuyển trạng thái duyệt sang ${itemAprrove.name}`
              }
            })
          }
          break
        case 1:
          _.forEach(R.strings.local.TRANG_THAI_CHI, (itemPay) => {
            if (itemPay.value === data.status) {
              textNotify = `${textNotify} vừa chuyển trạng thái chi sang ${itemPay.name}`
            }
          })
          break
        case 2:
          textNotify = `${textNotify} đã quá hạn`
          break
      }
      notification.setBody(textNotify)
      if (Platform.OS === 'android') {
        const localNotification = new firebase.notifications.Notification({
          sound: sampleaudio,
          show_in_foreground: true,
        })
          .setSound('default')
          .setNotificationId(notification.notificationId)
          .setTitle(notification.title)
          .setBody(notification.body)
          .setData(notification.data)
          .android.setChannelId('default_notification_channel_id') // e.g. the id you chose above
          .android.setSmallIcon('@drawable/ic_launcher') // create this icon in Android Studio
          .android.setColor(R.colors.gray82) // you can set a color here
          .android.setPriority(firebase.notifications.Android.Priority.High)
          .android.setVibrate([300])
          .android.setDefaults([firebase.notifications.Android.Defaults.Vibrate])

        firebase.notifications()
          .displayNotification(localNotification)
          .catch(err => console.error(err));
      } else if (Platform.OS === 'ios') {
        const localNotification = new firebase.notifications.Notification()
          .setNotificationId(notification.notificationId)
          .setTitle(notification.title)
          .setSubtitle(notification.subtitle)
          .setBody(textNotify)
          .setData(notification.data)
          .ios.setBadge(notification.ios.badge);

        firebase.notifications()
          .displayNotification(localNotification)
          .catch(err => console.error(err));
      }
      this.getNotifyNumber()
    })


    /*
   * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
   * */
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
      this.props.onOpened(notificationOpen.notification)
    });

    /*
   * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
   * */
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      this.props.onOpened(notificationOpen.notification)
    }
    /*
   * Triggered for data only payload in foreground
   * */
    this.messageListener = firebase.messaging().onMessage((message) => {
      // process data message
      this.props.onReceived(message)
      // console.log('JSON.stringify:', JSON.stringify(message));
    });
  }

  render() {
    return (
      <View />
    )
  }
}

function mapStateToProps(state) {
  return {
    userData: state.userReducers.userData.loggedIn,
  }
}
export default connect(mapStateToProps, { updateNotifyNumber })(FirebaseNotification);
