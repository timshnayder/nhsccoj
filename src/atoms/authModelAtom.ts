import { atom } from "recoil";

type AuthModelState = {
	isOpen: boolean;
	type: "login" | "register" | "forgotPassword";
};

const initialAuthModelState: AuthModelState = {
	isOpen: false,
	type: "login",
};

export const authModelState = atom<AuthModelState>({
	key: "authModelState",
	default: initialAuthModelState,
});