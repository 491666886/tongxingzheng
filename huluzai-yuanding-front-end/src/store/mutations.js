import {
	clearToken,
	setExpiredInfo,
	setUserInfo
} from '../utils';
import { resetRouter } from '../router';

export default {
	SET_EXPIRED(state, expired) {
		state.expired = expired;
		setExpiredInfo(expired?'1':'0');
	},
	SET_USER(state, payload) {
		state.user = payload.userInfo;
		setUserInfo(payload.userInfo);
	},
	SET_ROUTES(state, routes) {
		state.routes = routes;
	},
	CLEAR_CACHE(state) {
		clearToken();
		resetRouter();
		state.routes = [];
	}
}
