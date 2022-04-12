type MsAdUser = {
    dn: string; // 'CN=Ewerton da Costa Vaz,OU=Nutec,OU=Usuarios,OU=Secao Judiciaria do Estado do Para,DC=pa,DC=trf1,DC=gov,DC=br',
    userPrincipalName: string; //'pa13103@pa.trf1.gov.br',
    sAMAccountName: string; //'pa13103',
    mail: string; //'ewerton.vaz@trf1.jus.br',
    lockoutTime: Number; //'0',
    whenCreated: Date; // '20070912225110.0Z',
    pwdLastSet: Date; // '132845768713981899',
    userAccountControl: Number; //'512',
    sn: string; //'da Costa Vaz',
    givenName: string; //'Ewerton',
    cn: string; //'Ewerton da Costa Vaz',
    displayName: string; //'Ewerton da Costa Vaz',
    description: string; // 'SECAD/NUTEC';
    is_admin: false;    
}

export default MsAdUser;