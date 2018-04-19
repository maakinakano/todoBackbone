const ParentView = Backbone.View.extend({
    el: $('div.main'),
    initialize: function() {
        const t = this;
        t.inputView = new InputView();
        t.todoList = new TodoList();
        t.todoListView = new TodoListView({todoList: t.todoList});
        t.inputView.on('ADD_TODO', (value) => {
            const model = new Todo({
                name: value,
                isDone: false
            });
            t.todoList.add(model);
        });
    }
});

const InputView = Backbone.View.extend({
    el: $('#input_todo_box'),
    events: {
        'keydown': 'addTodo'
    },
    addTodo: function(e) {
        if(e.keyCode === 13){
            this.trigger('ADD_TODO', $('#input_todo_box').val());
            $('#input_todo_box').val("");
        }
    }
});

const TodoListView = Backbone.View.extend({
    el: $('#todo_input'),
    initialize: function(attr) {
        const t = this;
        attr.todoList.on('add', function (model) {
            const todoView = new TodoView(model);
            console.log(t.$el);
            t.$el.append(todoView.$el);
            todoView.render();
        });
    }
})

const TodoView = Backbone.View.extend({
    el: $('<tr>'),
    initialize: function(attr) {
        this.model = attr.model;
    },
    render: function(){
        const checkbox_th = $('<th>')
                                .attr('class', 'checkbox_th')
                                .html(
                                    $('<input>').attr({
                                        type: 'checkbox',
                                        class: 'done_check'
                                    }));

        const text_th = $('<th>')
                            .attr('class', 'text_th')
                            .html('aaa');

        const erase_th = $('<th>')
                            .attr('class', 'erase_th')
                            .html($('<input>').attr('type', 'button'));

        this.$el.attr('class', 'todo').append(checkbox_th, text_th, erase_th);
    }
})

const parentView = new ParentView();
