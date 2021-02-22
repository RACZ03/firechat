export interface ChatI {
    id?: string;
    date?: number;
    tipo?: boolean;
    name?: string;
}

export interface Chat_userI {
    id?: string;
    idchat?: string;
    date?: number;
    uid?: string;
    uid2?: string;
    displayName?: string;
    grupo?: boolean;
    unseenMessage?: number;
}

export interface UserI {
    uid?: string,
    email?: string,
    displayName?: string,
    photoUrl?: string
    grupo?: boolean
}

export interface MessageI {
    id?: string;
    idchat?: string;
    uid?: string;
    displayName?: string;
    message?: string;
    date?: number;
    status?: boolean;
}
