declare module "ad2" {
    import activedirectory from 'activedirectory';

    export interface AD {
       new(newad: MsAdConfig): activedirectory;
    }

    export class AD {
       constructor(newad: MsAdConfig);

      user(username: string) : {
        authenticate(passwd: string) : boolen;
        get() : MsAdUser;
        isMemberOf(group: MsAdGroup) : boolean;
      };
    }

    
    export default AD;
}