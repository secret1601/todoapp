<template>   
  <div class="container">
    <h1>TODO LIST</h1>
    <!-- 할일 추가 입력창 -->
    <TodoSimpleForm v-on:add-todo="addTodo"/>

    <!-- 목록없음 안내창 -->
    <div v-show="!todos.length" class="red">생성된 Todo 목록이 없습니다.</div>
    
    <!-- todo 목록창 -->
    <TodoList v-bind:todos="todos"/>

  </div>
</template>

<script>
  import {ref} from 'vue';

  import TodoSimpleForm from './components/TodoSimpleForm.vue'
  import TodoList from './components/TodoList.vue'

  export default {

    components: {
      TodoSimpleForm,
      TodoList
    },

    setup(){ 
      // 할일 목록(배열)을 저장
      const todos = ref([
        {id:1, subject:'할일', completed: false}
      ]);
      


      // todo 스타일 시트
      const todoStyle = {
        textDecoration: 'line-through',
        color: 'gray'
      }

      // 버튼 클릭시 처리
      // TodoSimpleForm에서 add-todo 이벤트로 전달된 객체를
      // 처리 해주는 콜백함수
      const addTodo = (todo) => { 
        // console.log(todo);
        todos.value.push(todo);
      };

      const deleteTodo = (index) => {
        // console.log('지우기' + index);
        // 배열내에서 순서 번호로 부터 1개 제거
        todos.value.splice(index, 1);
      }

      return {
        todos,
        addTodo,
        todoStyle,
        deleteTodo
      }
    }
  }
</script>

<style>
  .red {
    color: red;
  }
  .todocss {
    color: gray;
    text-decoration: line-through;
  }
</style>