const Todo = Backbone.Model.extend({
    defaults: {
        name: null,
        isdone: false
    }
});

const TodoList = Backbone.Collection.extend({
    model: Todo
});
