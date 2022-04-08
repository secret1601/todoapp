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
    <TodoList v-bind:todos="todos" v-on:toggle-todo="toggleTodo" v-on:delete-todo="deleteTodo"/>

    <hr />

    <!-- 페이지네이션 -->
    <nav aria-label="Page navigation example">
      <ul class="pagination">
        
        <li 
          class="page-item"
          v-if="nowPage !== 1"
        >
          <a class="page-link" v-on:click="getTodo(nowPage - 1)" style="cursor:pointer">Previous</a>
        </li>
        
        <li 
          class="page-item"
          v-for="count in numberOfPages"
          v-bind:key="count"

          v-bind:class="nowPage === count ? 'active': '' "
        >
          <a class="page-link" v-on:click="getTodo(count)" style="cursor:pointer">{{count}}</a>
        </li>
        
        <li 
          class="page-item"
          v-if="nowPage !== numberOfPages"
        >
          <a class="page-link" v-on:click="getTodo(nowPage + 1)" style="cursor:pointer">Next</a>
        </li>
      </ul>
    </nav>

  </div>
</template>

<script>
  import { computed, ref, watch} from 'vue';
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

      // 페이지네이션 관련
      // 전체 todos 개수 필요
      const totalTodos = ref(0);
      // 한 화면당 보여줄 todo 
      const limit = 5;
      // 현재 보여주는 페이지 번호
      const nowPage = ref(1);

      // 총페이지 숫자
      const numberOfPages = computed( () => {
        // 총 게시물 / 페이지당 출력 수  ====> 올림
        return Math.ceil(totalTodos.value / limit);

      });

      // 할일 검색 관련 
      const searchText = ref('');
      watch(searchText, () => {
        getTodo(1)
      });

      
      // DB 에서 자료 불러오기
      const getTodo = async (page = nowPage.value) => {
        error.value = '';
        // 전달 된 값을 현재 페이지 번호로 받아들인다.
        nowPage.value = page;
        try {
          // 서버에서 자료를 요청을 진행 후에 결과를 
          // res 에서 받는다. (response)
          const res = await axios.get(`http://localhost:3000/todos?subject_like=${searchText.value}&_page=${page}&_limit=${limit}&_sort=id&_order=desc`);
          // console.log(res.headers)
          // 총 todos 개수 파악
          totalTodos.value = res.headers["x-total-count"];

          if(numberOfPages.value < nowPage.value) {
            getTodo(nowPage.value - 1);
            return;
          }

          // response 가 될때 res라는 객체에 .data 를 화면에 보여줄
          // 목록으로 출력한다.
          todos.value = res.data;

        }catch (err) {
          console.log(err);
          error.value = "자료를 불러오는데 실패했습니다.";
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
          await axios.post('http://localhost:3000/todos', {         
            subject: 추가되는할일.subject,
            complete: 추가되는할일.complete 
          });

          getTodo(1);

        }catch(err) {
          console.log(err);
          error.value = "서버 확인해 주세요.";
        }

      };

      const toggleTodo = async (index) => {

        // complete 를 업데이트 하겠다.
        // id 를 통해서 내용을 업데이트 하겠다.
        error.value = '';
        const id = todos.value[index].id;
        try {
          
          // 서버의 DB 를 업데이트 한다.
          await axios.patch('http://localhost:3000/todos/' + id, {
            complete : !todos.value[index].complete
          });
          // 웹브라우저의 todo 의 화면을 표현한다.
          todos.value[index].complete = !todos.value[index].complete;

        }catch(err) {
          console.log(err);
          error.value = "업데이트에 실패하였습니다.";
        }



        // console.log('원본 : ' + todos.value[index].complete);
        // todos.value[index].complete = !todos.value[index].complete;
        // console.log('변경 : ' + todos.value[index].complete);
      }

      const deleteTodo = async (index) => {
      
        const id = todos.value[index].id;
        // console.log(id);
        error.value = '';
        
        try {
          // 전체 삭제가 아니라 id와 같은 DB 를 삭제
          await axios.delete('http://localhost:3000/todos/' + id);          
          getTodo(nowPage.value);
        }catch(err) {
          console.log(err);
          error.value = "삭제에 실패했습니다.";
        }

      }     
      
      return {
        todos,
        addTodo,
        toggleTodo,
        deleteTodo,
        
        searchText,

        error,
        nowPage,
        totalTodos,
        numberOfPages,
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