import { createStore } from 'vuex'
export default createStore({
    // vuex의 데이터 변수 설정
    state: {
         // toastBox 관련
        showToast : false, // 보이고 안보이고
        toastMessage : '', // 메시지
        toastAlertType : '', // Alert 타입 종류
        toastTimeout : null
    },
    mutations: {
        // 값을 변경하기 위해서는 뮤테이션을 통해 쇼토스트로 접근하겠다는 것
        UPDATE_TOAST_STATUS(state, payload) {
            state.showToast = payload;
        },
        UPDATE_TOAST_MESSAGE(state, payload) {
            state.toastMessage = payload;
        },
        UPDATE_TOAST_ALERT_TYPE(state, payload) {
            state.toastAlertType = payload;
        },
        UPDATE_TOAST_TIMEOUT(state, payload) {
            state.toastTimeout = payload;
        }
    },
    actions: {
        triggerToast( { commit },{message, type} ) {
            commit('UPDATE_TOAST_STATUS', true);
            commit('UPDATE_TOAST_MESSAGE', message);
            commit('UPDATE_TOAST_ALERT_TYPE', type);

            const timeout = setTimeout( () => {
                commit('UPDATE_TOAST_STATUS', false);
                commit('UPDATE_TOAST_MESSAGE', '');
                commit('UPDATE_TOAST_ALERT_TYPE', '');
            }, 5000);

            commit('UPDATE_TOAST_TIMEOUT', timeout);
        }
    },
    getters : {
        toastSmileMessage(state){
            console.log(state.toastMessage);
            return state.toastMessage + "^^";
        }
    }
});