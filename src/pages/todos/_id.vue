<template>    
    <h1>TODO 수정</h1>

    <div v-if="loading">Loading...</div>

    <form v-else @submit.prevent="onSave">

        <div class="row">
            
            <!-- 제목 수정 창 -->
            <div class="col-6">

                <div class="form-group">
                    <label>제목</label>
                    <input type="text" class="form-control" v-model="todo.subject">
                </div>

            </div>

            <!-- 상태 수정 창 -->
            <div class="col-6">
                
                <div class="form-group">                    
                    <label>완료여부</label>   
                    <div>
                        <button 
                            class="btn"
                            :class="todo.complete ? 'btn-success' : 'btn-danger' "
                            @click="toggleTodoState"
                            type="button"
                        >
                            {{ todo.complete ? 'Complete' : 'Incomplete' }}

                        </button>
                    </div>
                </div>
            </div>
        </div>        

        <button class="btn btn-primary" type="submit" :disabled="todoUpdate">저장</button>        
        <button class="btn btn-outline-dark ml-2" @click="moveBack" type="button">취소</button>

    </form>

    <ToastBox v-if="showToast" :message="toastMessage" :type="toastAlertType"/>
</template>

<script>
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import {computed, ref} from 'vue';
import _ from 'lodash';
import ToastBox from '@/components/ToastBox.vue';

export default {
    components: {
        ToastBox
    },

    setup() {
        const route = useRoute();
        const router = useRouter();
       // 현재 진행 및 수정 중인 todo 정보를 저장하고 있는 객체
        const todo =  ref(null);
        // 원래 가지고 있었던 todo 저장를 저장하고 있는 객체
        const originalTodo = ref(null);
        const loading = ref(true);
        // id는 읽어올때 사용, 저장할 때 사용
        const todoId = route.params.id;
        
        // toastBox 관련
        const showToast = ref(false); // 보이고 안보이고
        const toastMessage = ref(''); // 메시지
        const toastAlertType = ref(''); // Alert 타입 종류
        
        // 메시지가 전달되면 toastBox 보여주기
        const triggerToast = (message = '', type = 'success') => {
            toastMessage.value = message;
            showToast.value = true;
            toastAlertType.value = type;

            setTimeout(() => {
                toastMessage.value='';
                showToast.value = false;
            }, 3000)
        }

        

        const getTodo = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/todos/${todoId}`);
                todo.value = { ...res.data}; // spread 연산으로 내용물만 복사
                originalTodo.value = { ...res.data};
                loading.value = false;
            } catch(error) {
                console.log(error);
                triggerToast('서버에서 자료를 호출하는데 실패하였습니다.', 'danger');
            }
        }

        // todo 객체와 origialTodo를 비교한다.
        // 늘 비교한다.
        const todoUpdate = computed( () => {
            return _.isEqual(todo.value, originalTodo.value);
        });

        getTodo();

        const toggleTodoState = () => {
            todo.value.complete = !todo.value.complete
        }

        const moveBack = () => {
             // router 개체에 Push 하면 
            // 화면 이동이 된다.
            // 이때 화면 이동의 장소 정보는
            // router 폴더의 index.js 아래에 기재 되어 있다.
            // 아래의 경우는 다음과 같이 기재가 되어 있다.
            // {
            //     path: '/todos',
            //     name: 'Todos',
            //     component: TodosIndex
            // },
            // name 을 통해서 이동을 하므로 
            // 최종적으로 /todos 로 이동을 한다.

            router.push({
                name: 'Todos' 
            });
        }

        const onSave = async () => {

            try {
                const res = await axios.put(`http://localhost:3000/todos/${todoId}`, {
                subject: todo.value.subject,
                complete: todo.value.complete
                });
                // console.log(res);
                // 원본이 갱신 되었으므로 이를 반영하여 새로 저장해 줌.
                originalTodo.value = { ...res.data };

            triggerToast('데이터 저장에 성공하였습니다.', 'success');
            } catch(error) {
                console.log(error);
                triggerToast("데이터 저장에 실패하였습니다.", 'danger');
            }

            
        };

        return {
            todo,
            loading,
            toggleTodoState,
            moveBack,
            onSave,
            todoUpdate,
            showToast,
            toastMessage,
            triggerToast,
            toastAlertType
        }

    }
}
</script>

<style>
</style>