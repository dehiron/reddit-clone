import { atom } from "recoil"

export interface AuthModalState {
    open: boolean;
    view: "login" | "signup" | "resetPassword";
}

const defaultModalState: AuthModalState = { //上で定義しているAuthModalStateと繋がっている
    open: false,
    view: "login"
}

export const AuthModalState = atom<AuthModalState>({
    key: "authModalState", //key = recoildで必要なパラメータ、このアトム特有・一意のキーとなる
     default: defaultModalState, //このアトムの初期値
})