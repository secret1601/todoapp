<template>
  <div class="container">
    <h1>TODO LIST</h1>

    <!-- 할일 검색 입력창 -->
    <input class="form-control" v-model="searchText" type="text" placeholder="Search Todo list">
    <div class="red">{{ error }}</div>
    <hr />

    <!-- 할일 추가 입력창 -->
    <TodoSimpleForm v-on:add-todo="addTodo" />

    <!-- 목록없음 안내창 -->
    <div v-show="!todos.length" class="red">생성된 Todo 목록이 없습니다.</div>

    <!-- todo 목록창 -->
    <TodoList v-bind:todos="filteredTodo" v-on:toggle-todo="toggleTodo" v-on:delete-todo="deleteTodo"/>

  </div>
</template>

<script>
  import { computed, ref} from 'vue';
  import axios from 'axios'

  import TodoSimpleForm from './components/TodoSimpleForm.vue'
  import TodoList from './components/TodoList.vue'

  export default {

    components: {
      TodoSimpleForm,
      TodoList
    },
    setup() {  

      // 할일 목록(배열)을 저장
      const todos = ref([]);

      // 에러 메시지 
      const error = ref('');

      // DB에서 자료 불러오기
      const getTodo = async () => {
        error.value = '';
        try {
          // 서버에서 자료를 요청하고,
          // 그 결과를 res에서 받는다.
          const red = await axios.get("http://localhost:3000/todos");
          // response가 될 때, res라는 객체의 .data를 화면에 출력한다.
          todos.value = red.data;

        } catch(err) {
          console.log(err);
          error.value= "자료를 불러오는데 실패했습니다.";
        }
      }

      // 최초에 데이터를 호출한다.
      getTodo();

      // TodoSimpleForm 에서  
      // add-todo 이벤트로 전달된 객체를 
      // 처리해 주는 콜백함수 
      const addTodo = async (추가되는할일) => {

        error.value = '';
        try {
          // 데이터 베이스에 저장이 되어야 하는 데이터
          const res = await axios.post('http://localhost:3000/todos', {         
            subject: 추가되는할일.subject,
            complete: 추가되는할일.complete 
          });

          todos.value.push(res.data);

        }catch(err) {
          console.log(err);
          error.value = "서버 확인해 주세요.";
        }

      };

      const toggleTodo = async (index) => {

        // complete를 업데이트 하겠다.
        // id를 통해서 내용을 업데이트 하겠다.
        error.value = '';
        const id = todos.value[index].id;
        try {
          // 서버의 DB를 업데이트 한다.
          await axios.patch('http://localhost:3000/todos/' + id, {
            complete : !todos.value[index].complete
          });
          // 웹브라우저의 todo의 화면을 갱신한다.
          todos.value[index].complete = !todos.value[index].complete

        } catch(err) {
          console.log(err);
          error.value = "업데이트에 실패하였습니다.";
        }

        // console.log('원본 : ' + todos.value[index].complete);
        // todos.value[index].complete = !todos.value[index].complete;
        // console.log('변경 : ' + todos.value[index].complete);
      }

      const deleteTodo = async (index) => {
        // console.log('지우기' + index);
        // 배열내에서 순서번호로 부터 1개 제거
        // todos.value.splice(index, 1);
        const id = todos.value[index].id;
        console.log(id)
        error.value = '';
        try {
          // 전체 삭제가 아니라 id와 같은 DB를 삭제
          await axios.delete('http://localhost:3000/todos/' + id);
          todos.value.splice(index, 1);

        } catch(err) {
          console.log(err);
          error.value= "삭제에 실패했습니다.";
        }

      }

      // 할일 검색 관련 
      const searchText = ref('');
      // 검색에 따른 목록을 갱신해 주는 기능을 생성
      const filteredTodo = computed( () => {
        // 만약에 searchText 와 동일한 todos 목록에 있는지를 검사해서
        // 화면에 출력을 할 예정임.
        // searchTxt.value = ''
        if(searchText.value) {
          return todos.value.filter( (todoitem) => {
              // aaa 객체의 제목에 포함이 되어 있는가? 검사
              return todoitem.subject.includes(searchText.value);
          } );
          
        }
        return todos.value;
      });


      return {
        todos,
        addTodo,
        toggleTodo,
        deleteTodo,
        
        searchText,
        filteredTodo,

        error,
        getTodo

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