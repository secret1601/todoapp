export default {
    namespaced: true,
     // vuex의 데이터 변수 설정
    state: {
        // 메세지 및 타입 목록
        toasts: [
            // {message:'hello', type: 'danger'},
        ],
        showToast : false
    },
    mutations: {
        // 메세지가 추가될때
        // payload -> {message:'hello', type: 'danger'},
        ADD_TOAST(state, payload){
            state.toasts.push(payload);
        },
        
        // 메세지가 제거될때
        REMOVE_TOAST(state){
            // shift란? 첫번째 배열의 요소를 제거한다.
            state.toasts.shift();
        },

        // 값을 변경하기 위해서는 뮤테이션을 통해 쇼토스트로 접근하겠다는 것
        UPDATE_TOAST_STATUS(state, payload) {
            state.showToast = payload;
        }
    },
    actions: {
        triggerToast( { commit },{message, type} ) {
            commit('UPDATE_TOAST_STATUS', true);
            // commit('UPDATE_TOAST_MESSAGE', message);
            // commit('UPDATE_TOAST_ALERT_TYPE', type);
            console.log(message);
            console.log(type);
            commit('ADD_TOAST', {id: Date.now(), message, type});

            setTimeout( () => {
                commit('UPDATE_TOAST_STATUS', false);
                // commit('UPDATE_TOAST_MESSAGE', '');
                // commit('UPDATE_TOAST_ALERT_TYPE', '');
                commit('REMOVE_TOAST');
            }, 5000);
        }
    },
    getters : {
        toastSmileMessage(state){
            console.log(state.toastMessage);
            return state.toastMessage + "^^";
        }
    }
}