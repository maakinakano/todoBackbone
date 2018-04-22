const ParentView = Backbone.View.extend({
	el: $('#main'),
	initialize: function() {
		const self = this
		self.filterRadioView = new FilterRadioView()
		self.todoInputView = new TodoInputView()
		const todoList = new TodoList()
		self.todoListView = new TodoListView(todoList, self.filterRadioView)
		self.todoInputView.on('ADD_TODO', function(value) {
			const todo = new Todo({
				name: value,
				isDone: false
			})
			todoList.add(todo)
		})
		self.todoListView.changes()
	}
})

const TodoListView = Backbone.View.extend({
	el: $('table#todo_list'),
	initialize: function(todoList, filterRadioView) {
		const self = this
		todoList.on('add', function(todo) {
			const todoView = new TodoView({
				el:  $('<tr class="todo_tr">'),
				todo: todo,
				filterRadioView: filterRadioView
			})
			$('table#todo_list').append(todoView.$el)
			todoView.render()
			todoView.on('ERASE_TODO', (eraseTodo)=>{todoList.remove(eraseTodo)})
			todoView.on('CHANGES', self.changes)
			self.changes()
		})
	},
	changes: function(self) {
		let count = 0
		let acCount = 0
		$('.todo_tr input[type="checkbox"]').each((i, checkbox)=>{
			count++
			if(!$(checkbox).prop('checked')){
				acCount++
			}
		})
		$('#item_left').html(acCount+' item left')
		if(count == 0){
			$('#all_checkbox').hide()
			$('#filter_button').hide()
		} else {
			$('#all_checkbox').show()
			$('#filter_button').show()
		}
	}

})

const TodoView = Backbone.View.extend({
	initialize: function(attr) {
		const self = this
		self.todo = attr.todo
		attr.filterRadioView.on('FILTERING', function(val){
			const check = self.todoCheckboxView.$el.prop('checked')
			if(val === 'active' && check) {
				self.$el.hide()
			} else if(val === 'completed' && !check) {
				self.$el.hide()
			} else {
				self.$el.show()
			}
		})
		
		///checkbox
		self.todoCheckboxView = new TodoCheckboxView({el: $('<input type="checkbox">').prop('checked', self.todo.get('isDone'))})
		self.todoCheckboxView.on('FLIP_COMPLETE', (isDone)=>{self.flipComplete(isDone, self)})

		//todoName th
		self.todoNameView = new TodoNameView({el: $('<th class="todoName_th">').html(self.todo.get('name'))})
		self.todoNameView.on('EDIT_TODO', function(name) {
			const todoEditView = new TodoEditView({el: $('<input type="text" class="todo_edit">').val(name)})
			self.todoNameView.$el.html(todoEditView.$el)
			todoEditView.on('BLUR_TODO', (name)=>{self.todoNameView.$el.html(name)})
			todoEditView.on('ERASE_TODO', ()=>{self.eraseTodo(self)})
			todoEditView.$el.focus()
		})

		//eraseButton
		self.eraseButtonView = new EraseButtonView({el: $('<input type="button">')})
		self.eraseButtonView.on('ERASE_TODO', ()=>{self.eraseTodo(self)})
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
		self.trigger('CHANGES')
	},
	eraseTodo: function(self) {
		self.trigger('ERASE_TODO', self.todo)
		self.$el.remove()
		self.trigger('CHANGES')
	}
})


///ViewŠñ‚è‚ÌView
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
	events:{
		'click': 'eraseButton'
	},
	eraseButton: function() {
		this.trigger('ERASE_TODO')
	}
})

const TodoEditView = Backbone.View.extend({
	events:{
		'blur': 'blurTodoName',
		'keydown': 'enterTodoName'
	},
	blurTodoName: function() {
		if(this.$el.val() === '') {
			this.trigger('ERASE_TODO')
		} else {
			this.trigger('BLUR_TODO', this.$el.val())
		}
	},
	enterTodoName: function(e) {
		if(e.keyCode == 13) {
			if(this.$el.val() === '') {
				this.trigger('ERASE_TODO')
			} else {
				this.trigger('BLUR_TODO', this.$el.val())
			}
		}
	}
})

const FilterRadioView = Backbone.View.extend({
	el: $('th#filter_radio'),
	events:{
		'click input[type="radio"]': 'clickFilter'
	},
	clickFilter: function(e) {
		this.trigger('FILTERING', $(e.target).val())
	}
})

///Model
const Todo = Backbone.Model.extend({
    defaults: {
        name: null,
        isdone: false
    }
})

const TodoList = Backbone.Collection.extend({
    model: Todo,
})

