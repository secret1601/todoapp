import {computed} from 'vue'
import { useStore } from 'vuex'

export const useToast = () => {
    const store = useStore();
    const toasts = computed(() => store.state.toast.toasts);
    const showToast = computed(() => store.state.toast.showToast); // 보이고 안보이고
    // 메시지가 전달되면 toastBox 보여주기
    const triggerToast = (message = '', type = 'success') => {
        store.dispatch('toast/triggerToast', { message, type } );
    }

    return  {
        showToast,
        // toastMessage,
        toasts,
        triggerToast
    }
}