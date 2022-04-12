import MsAdUser from '../models/msaduser.model';
import ad from '../shared/ms_ad';

class MsAdRepository {
    async loginMsAd(username : string, passwd : string) : Promise<MsAdUser|null> {
        var userMsAd = null;
        const authenticated = await ad.authenticate(username, passwd);

        if(authenticated) {
          userMsAd = await ad.getUser(username);
        } else {
          return null;
        }

        return userMsAd;
    }

    async findUser( username: string) : Promise<MsAdUser|null>  {
      return await ad.getUser(username);
    }
}

export default new MsAdRepository;
