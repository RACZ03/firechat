export interface ChatI {
    id?: string;
    date?: number;
    tipo?: boolean;
}

export interface Chat_userI {
    id?: string;
    idchat?: string;
    uid?: string;
    uid2?: string;
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
    message?: string;
    date?: number;
}
