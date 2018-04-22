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
		const self = this
		const todo = attr.todo
		self.todoCheckboxView = new TodoCheckboxView({el: $('<input type="checkbox">').prop('checked', todo.get('isDone'))})
		self.todoCheckboxView.on('FLIP_COMPLETE', function(isDone) {
			self.flipComplete(isDone, self)
		})

		self.todoNameView = new TodoNameView({el: $('<th class="todoName_th">').html(todo.get('name'))})
		self.todoNameView.on('EDIT_TODO', function(name) {
			const todoEditView = new TodoEditView({el: $('<input type="text" class="todo_edit">').val(name)})
			self.todoNameView.$el.html(todoEditView.$el)
			todoEditView.on('BLUR_TODO', function(name){
				self.todoNameView.$el.html(name)
			})
			todoEditView.$el.focus()
		})

		self.eraseButtonView = new EraseButtonView({el: $('<input type="button">')})
	},
	render: function() {
		const checkbox_th = $('<th class="checkbox_th">').html(this.todoCheckboxView.$el)
		const erase_th = $('<th class="erase_th">').html(this.eraseButtonView.$el)
		this.$el.append(checkbox_th, this.todoNameView.$el, erase_th)
	},
	flipComplete: function(isDone, self) {
		if(isDone) {
			self.todoNameView.$el.css({
				'text-decoration': 'line-through',
				'color': 'rgba(150,150,150,0.5)'
			})
		} else {
			self.todoNameView.$el.css({
				'text-decoration': 'none',
				'color': 'black'
			})
		}
	}
})


///ViewŠñ‚è‚ÌView
const TodoCheckboxView = Backbone.View.extend({
	events: {
		'click': 'flipComplete'
	},
	flipComplete: function() {
		this.trigger('FLIP_COMPLETE', this.$el.prop('checked'))
	},
})

const TodoNameView = Backbone.View.extend({
	events:{
		'dblclick': 'editTodoName'
	},
	editTodoName: function() {
		this.trigger('EDIT_TODO', this.$el.text())
	}
})

const EraseButtonView = Backbone.View.extend({
})

const TodoEditView = Backbone.View.extend({
	events:{
		'blur': 'blurTodoName',
		'keydown': 'enterTodoName'
	},
	blurTodoName: function() {
		this.trigger('BLUR_TODO', this.$el.val())
	},
	enterTodoName: function(e) {
		if(e.keyCode == 13) {
			this.trigger('BLUR_TODO', this.$el.val())
		}
	}
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

