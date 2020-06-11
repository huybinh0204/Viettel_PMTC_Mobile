import { Keyboard, Linking } from 'react-native';
import VersionCheck from 'react-native-version-check';

const hideKeyboard = () => Keyboard.dismiss()

async function openStore() {
  Linking.openURL(await VersionCheck.getStoreUrl());
}

export default {
  hideKeyboard,
  openStore,
};
