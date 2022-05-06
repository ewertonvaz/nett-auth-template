import AD from 'ad2';
import MsAdGroup from '../../models/msadgroup';
import MsAdConfig from '../../models/msadconfig';

const conf = process.env.NODE_ENV === 'development' ? require('../../config/settings_dev').default : require('../../config/settings_prod').default;

const adconfig = conf.MS_AD;
const adConnect = new AD(adconfig as MsAdConfig);

export default {
        
    async authenticate(username : string, passwd : string) : Promise<Boolean> {
        return await adConnect.user(username).authenticate(passwd);
    },

    async getUser(username : string){
        const admGroup = 'Suporte.pa';
        const adUser = await adConnect.user(username).get();
        adUser.is_admin = adUser.groups.find( (item : MsAdGroup) => item.cn === admGroup ) ? true : false;
        return adUser;
    },

    async isMemberOf(username : string, group: string) : Promise<Boolean> {
      return await adConnect.user(username).isMemberOf(group);
    }
};