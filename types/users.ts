export enum MemberStatus {
    PENDING = "pending",
    APPROVED = "approved",
}

export interface User {
    id: number;
    username: string;
    firstname: string;
    lastname: string;
    password: string;
    isAdmin?: boolean;
    memberStatus: MemberStatus;
}
