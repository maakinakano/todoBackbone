const ParentView = Backbone.View.extend({
	el: $('#main'),
	initialize: function() {
		this.todoInputView = new TodoInputView()
		const todoList = new TodoList()
		this.todoListView = new TodoListView(todoList)
		this.todoInputView.on('ADD_TODO', function(value) {
			const todo = new Todo({
				name: value,
				isDone: false
			});
			todoList.add(todo)
		})
	}
})

const TodoInputView = Backbone.View.extend({
	el: $('#todo_input'),
	events: {
		'keydown': 'addTodo'
	},
	addTodo: function(e) {
		const todoName = this.$el.val()
		if(e.keyCode !== 13 || todoName === ''){return}
		this.trigger('ADD_TODO', todoName)
		this.$el.val('')
	}
})

const TodoListView = Backbone.View.extend({
	el: $('table#todo_list'),
	initialize: function(todoList) {
		todoList.on('add', function(todo) {
			const todoView = new TodoView({
				el:  $('<tr class="todo_tr">'),
				todo: todo
			});
			$('table#todo_list').append(todoView.$el)
			todoView.render()
		})
	}
})

const TodoView = Backbone.View.extend({
	initialize: function(attr) {
		this.todoCheckboxView = new TodoCheckboxView({
			el: $('<input type="checkbox">'),
			isDone: attr.todo.get('isDone')
		})
		this.todoNameView = new TodoNameView({
			el: $('<th class="todoName_th">'),
			name: attr.todo.get('name')
		})
		this.eraseButtonView = new EraseButtonView({
			el: $('<input type="button">')
		})
	},
	render: function() {
		const checkbox_th = $('<th class="checkbox_th">').html(this.todoCheckboxView.$el)
		const erase_th = $('<th class="erase_th">').html(this.eraseButtonView.$el)
		this.$el.append(checkbox_th, this.todoNameView.$el, erase_th)
	}
})

const TodoCheckboxView = Backbone.View.extend({
	events: {
//		'click': 'flipComplete'
	},
	initialize: function(attr) {
		this.isDone = attr.isDone
		this.$el.prop('checked', attr.isDone)
	},
//	flipComplete: function() {
//	},
})

const TodoNameView = Backbone.View.extend({
	initialize: function(attr) {
		this.name = attr.name
		this.$el.html(attr.name)
	}
})

const EraseButtonView = Backbone.View.extend({
})

///Model
const Todo = Backbone.Model.extend({
    defaults: {
        name: null,
        isdone: false
    }
});

const TodoList = Backbone.Collection.extend({
    model: Todo
});

