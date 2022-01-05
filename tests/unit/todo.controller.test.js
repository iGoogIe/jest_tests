const TodoController = require("../../controllers/todo.controller");
const TodoModel = require("../../model/todo.model");
const httpMocks = require("node-mocks-http");
const newTodo = require("../mock-data/new-todo.json");
const allToDos = require("../mock-data/all-todos.json");

// mock a function and really don't care about the original implementation of that function (it will be overridden by jest.fn())
// a method to create a stub, it allowing you to track calls, define return values etc...
TodoModel.create = jest.fn();
TodoModel.find = jest.fn();
TodoModel.findById = jest.fn();

// A mock function does NOT call the original function

let req, res, next;
beforeEach ( () => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    // lets us spy on this function and see what it's being called with
    next = jest.fn();
});

describe("TodoController.getTodoById", () => {
    it("should have getTodoById", () => {
        expect(typeof TodoController.getTodoById).toBe("function");
    })

    it("should call TodoModel.findById with route parameters", async() => {
        req.params.todoId = "61d27e353125cfc224ff6f76";
        await TodoController.getTodoById(req, res, next);
        expect(TodoModel.findById).toBeCalledWith("61d27e353125cfc224ff6f76");

    })

    it("should return json body and response code 200", async () => {
        TodoModel.findById.mockReturnValue(newTodo);
        await TodoController.getTodoById(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(newTodo);
    })

    it("should handle errors for getTodoById", async () => {
        const errorMessage = {"message": "id not found"};
        const rejectedPromise = Promise.reject(errorMessage);
        TodoModel.findById.mockReturnValue(rejectedPromise);
        await TodoController.getTodoById(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    })

    it("should return 404 when item doesn't exist", async () => {
        TodoModel.findById.mockReturnValue(null);
        await TodoController.getTodoById(req, res, next);
        expect(res.statusCode).toBe(404);
        // this is to confirm response gets sent!
        expect(res._isEndCalled()).toBeTruthy();
    })
})

describe("TodoController.getTodos", () => {
    it("should have a getTodos function", () => {
        expect(typeof TodoController.getTodos).toBe("function");
    })
    it("should call TodoModel.find({})", async () => {
        await TodoController.getTodos(req, res, next);
        expect(TodoModel.find).toHaveBeenCalledWith({});
    })

    it("should return response with status 200 and all todos", async () => {
        TodoModel.find.mockReturnValue(allToDos);
        await TodoController.getTodos(req, res, next);
        expect(res.statusCode).toBe(200);
        // Check to ensure response is being sent
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(allToDos);
    })

    it("should handle errors", async () => {
        const errorMessage = {"message": "Unable to get todos"};
        const rejectedPromise = Promise.reject(errorMessage);
        TodoModel.find.mockReturnValue(rejectedPromise);
        await TodoController.getTodos(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    })

    TodoModel.find({})
})

describe("TodoController.createToDo", () => {

    beforeEach(() => {
        req.body = newTodo;
    })

    it("should have a createTodo function", () => {
        expect(typeof TodoController.createTodo).toBe("function");
    })
    it("should call TodoModel.create", () => {
        TodoController.createTodo(req, res, next);
        // expect(TodoModel.create).toBeCalled();
        expect(TodoModel.create).toBeCalledWith(newTodo);
    })

    it("should return 201 response code", async () => {
        await TodoController.createTodo(req, res, next);
        expect(res.statusCode).toBe(201);
        expect(res._isEndCalled()).toBeTruthy();
    })

    it("should return json body in response", async () => {
        // This is calling jest fn , and passes in newTodo i.e json we define. Then in the expect statement, it uses _getJSONData as a function to get the json data from the response (another mock feature)
        TodoModel.create.mockReturnValue(newTodo);
        await TodoController.createTodo(req, res, next);
        expect(res._getJSONData()).toStrictEqual(newTodo);
    })

    it("should handle errors", async () => {
        const errorMessage = {"message": "Done property missing"};
        const rejectedPromise = Promise.reject(errorMessage);
        TodoModel.create.mockReturnValue(rejectedPromise);
        await TodoController.createTodo(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    })
})