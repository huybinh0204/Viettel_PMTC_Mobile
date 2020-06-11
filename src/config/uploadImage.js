import ImagePicker from 'react-native-image-picker'
import { Platform } from 'react-native';
import { languages } from 'assets';
import { getLangCode, StringFromLastCharacter, VideoMimeType } from 'config';

export const chooseImage = () => {
  let langCode = getLangCode()
  let options = {
    title: languages[langCode].image_picker,
    takePhotoButtonTitle: languages[langCode].take_image,
    chooseFromLibraryButtonTitle: languages[langCode].choose_from_library,
    maxWidth: 500,
    maxHeight: 500,
    quality: 0.5,
    storageOptions: {
      skipBackup: true,
      path: 'images'
    }
  }

  return new Promise((resolve, reject) => {
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        resolve(null)
      } else if (response.error) {
        resolve(null)
      } else if (response.customButton) {
        resolve(null)
      } else {
        resolve(response)
      }
    })
  })
}

export const chooseVideo = () => {
  let langCode = getLangCode()
  let options = {
    title: languages[langCode].video_picker,
    takePhotoButtonTitle: languages[langCode].take_video,
    chooseFromLibraryButtonTitle: languages[langCode].choose_from_library,
    mediaType: 'video',
    storageOptions: {
      skipBackup: true
      // path: 'images'
    }
  };

  return new Promise((resolve, reject) => {
    ImagePicker.showImagePicker(options, response => {
      if (response && response.uri) {
        let ext = 'mp4';
        let name = 'videofile';
        if (Platform.OS === 'ios') {
          if (response.fileName) {
            ext = StringFromLastCharacter(response.fileName, '.');
            name = response.fileName.substring(
              0,
              response.fileName.lastIndexOf('.') - 1
            );
          } else {
            ext = StringFromLastCharacter(response.uri, '.');
            name = response.uri.substring(
              0,
              response.uri.lastIndexOf('.') - 1
            );
          }
        } else {
          ext = StringFromLastCharacter(response.path, '.');
          name = StringFromLastCharacter(response.path, '/');
        }

        let type = VideoMimeType[ext.toLowerCase()];
        if (!type) resolve(null);
        resolve({ ...response, type, name, video: true });
      } else {
        resolve(null);
      }
    });
  });
}
