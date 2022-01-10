type User = {
    uuid? : string;
    name: string;
    email: string;
    password?: string;
    user_token?: string;
    email_validated: boolean;
    is_admin: boolean;
    created_at: Date;
    updated_at: Date;
}

export default User;