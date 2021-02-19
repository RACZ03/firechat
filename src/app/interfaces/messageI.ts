export interface ChatI {
    id?: string;
    date?: number;
    tipo?: boolean;
    name?: string;
}

export interface Chat_userI {
    id?: string;
    idchat?: string;
    uid?: string;
    uid2?: string;
    displayName?: string;
}

export interface UserI {
    uid?: string,
    email?: string,
    displayName?: string,
    photoUrl?: string
}

export interface MessageI {
    idchat?: string;
    uid?: string;
    displayName?: string;
    message?: string;
    date?: number;
}
