import { languages } from 'assets';
import { getLangCode } from '../config/index';
import Types from './Types';

export const POST_PRIVACY = () => {
  let langCode = getLangCode()
  return [
    {
      id: Types.POST_PRIVACY_ID.PUBLIC,
      icon: 'ios-globe',
      name: languages[langCode].Public,
      desc: languages[langCode].Anyone_on_or_off_Astra
    },
    {
      id: Types.POST_PRIVACY_ID.FRIENDS,
      icon: 'ios-people',
      name: languages[langCode].Friends,
      desc: languages[langCode].Your_friends_on_Astra
    },
    {
      id: Types.POST_PRIVACY_ID.FOLLOWERS,
      icon: 'ios-person-add',
      name: languages[langCode].followers,
      desc: languages[langCode].Your_followers_on_Astra
    },
    {
      id: Types.POST_PRIVACY_ID.PRIVATE,
      icon: 'ios-lock',
      name: languages[langCode].only_me,
      desc: languages[langCode].only_me
    }
  ];
}
export default {
  POST_PRIVACY
};
