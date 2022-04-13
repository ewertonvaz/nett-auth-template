import conf from '../../config/settings';
import AD from 'ad2';
import MsAdGroup from '../../models/msadgroup';

const adconfig = conf.MS_AD;
const adConnect = new AD(adconfig);

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