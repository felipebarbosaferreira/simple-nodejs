angular.module('todoApp', [])
  .controller('TodoListController', function ($http) {
    var self = this;
    self.todos = [];

    // obtem todas as tarefas do server
    self.getAllTodo = function () {

      $http({
        url: '/tarefas',
        method: "GET"
      })
        .then(function (response) {
          // success
          self.todos = response.data;
          console.log('success getAllTodo', response);
        },
          function (response) { // optional
            // failed
            console.log('failed getAllTodo', response);
          });
    };

    // inclui a tarefa no server
    self.addTodo = function (todo) {
      $http({
        url: '/tarefa',
        method: "POST",
        data: todo
      })
        .then(function (response) {
          // success
          console.log('success addTodo', response);
          self.getAllTodo();

          // fecha a modal
          $('#modalNovaTarefa').modal('hide');

          // inicializa o model do form
          self.task = {};
        },
          function (response) { // optional
            // failed
            console.log('failed addTodo', response);
          });
    };

    // atualizar a tarefa no server
    self.updateTodo = function (todo) {

      $http({
        url: '/tarefa/' + todo.uuidv4,
        method: "PUT",
        data: todo
      })
        .then(function (response) {
          // success
          console.log('success updateTodo', response);
          self.getAllTodo();
        },
          function (response) { // optional
            // failed
            console.log('failed updateTodo', response);
          });
    };

    self.concluirTarefa = function(todo) {
      todo.terminada = true;
      self.updateTodo(todo);
    };

    self.priorizarTarefa = function(todo) {
      todo.prioritaria = true;
      self.updateTodo(todo);
    };

    self.despriorizarTarefa = function(todo) {
      todo.prioritaria = false;
      self.updateTodo(todo);
    };

    self.excluirTarefa = function(todo) {
      
      $http({
        url: '/tarefa/' + todo.uuidv4,
        method: "DELETE"
      })
        .then(function (response) {
          // success
          console.log('success excluirTarefa', response);
          self.getAllTodo();
        },
          function (response) { // optional
            // failed
            console.log('failed excluirTarefa', response);
          });
    };


  });