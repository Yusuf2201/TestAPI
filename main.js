const request = require('supertest')('https://dummyjson.com')

const chai = require('chai')
const chaiJsonSchema = require('chai-json-schema')

chai.use(chaiJsonSchema)
const expect = chai.expect




it('test json schema array', async function () {
  const todosSchema = {
    type: 'object',
    properties: {
      todos: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            todo: { type: 'string' },
            userId: { type: 'number' },
            completed: { type: 'boolean' },
          },
          required: ['id']
        }
      }
    }
  }
	
	const res = await request.get('/todos')
	expect(res.body).have.jsonSchema(todosSchema)
})

it('test json schema object', async function () {
	const todoSchema = {
		type: 'object',
		properties: {
			id: { type: 'number' },
			todo: { type: 'string' },
			userId: { type: 'number' },
			completed: { type: 'boolean' },
		},
		required: ['id', 'todo', 'userId']
	}

	const res = await request.get('/todos/1')
	expect(res.body).have.jsonSchema(todoSchema)
})

it('mendapatkan semua todos dan menvalidasi', async function () {
  const todosSchema = {
    type: 'object',
    items: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        title: { type: 'string' },
        description: { type: 'string' },
        completed: { type: 'boolean' },
      },
      required: ['id', 'title', 'description', 'completed'],
    },
  };

  const response = await request.get('/todos');

  expect(response.status).to.equal(200);
  expect(response.headers['content-type']).to.include('application/json');
  expect(response.body).to.be.jsonSchema(todosSchema);
});

it('mendapatkan todo nomer 1 dan menvalidasi', async function () { 
  const todoSchema = {
    type: 'object',
    properties: {
      id: { type: 'number' },
      description: { type: 'string' },
      completed: { type: 'boolean' },
    },
    required: ['id'],
  };

  const response = await request.get('/todos/1');

  expect(response.status).to.equal(200);
  expect(response.headers['content-type']).to.include('application/json');
  expect(response.body).to.be.jsonSchema(todoSchema);
});

it('mendapatkan todo nomer random dan menvalidasi', async function () { 
  const todoSchema = {
    type: 'object',
    properties: {
      id: { type: 'number' },
      description: { type: 'string' },
      completed: { type: 'boolean' },
    },
    required: ['id'],
  };

  const response = await request.get('/todos/random');

  expect(response.status).to.equal(200);
  expect(response.headers['content-type']).to.include('application/json');
  expect(response.body).to.be.jsonSchema(todoSchema);
});

it('mendapatkan todo dengan skip nomer 1-10 random dan menvalidasi', async function () { 
  const todoSchema = {
    type: 'object',
    properties: {
      todos: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            todo: { type: 'string' },
            userId: { type: 'number' },
            completed: { type: 'boolean' },
          },
      },
          required: ['id', 'todo', 'completed'],
    }
  }
  };

  const response = await request.get('/todos?limit=3&skip=10');
  // console.log(response.body);

  expect(response.status).to.equal(200);
  expect(response.headers['content-type']).to.include('application/json');
  expect(response.body).to.be.jsonSchema(todoSchema);
});

it('mendapatkan todo dengan user ID dan menvalidasi', async function () { 
  const todoSchema = {
    type: 'object',
    properties: {
      todos: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            todo: { type: 'string' },
            userId: { type: 'number' },
            completed: { type: 'boolean' },
          },
      },
          required: ['id', 'todo', 'completed'],
    }
  }
  };

  const response = await request.get('/todos/user/5');

  expect(response.status).to.equal(200);
  expect(response.headers['content-type']).to.include('application/json');
  expect(response.body).to.be.jsonSchema(todoSchema);
});

it('membuat todo baru dan validate JSON schema', async function () {  
  const newTodo = {
    title: 'Learn Node.js', 
  };

  const todoSchema = {
    type: 'object',
    properties: {
      id: { type: 'number' },
      completed: { type: 'boolean' },
    },
  };

  const response = await request.post('/todos/add').send(newTodo);

  expect(response.status).to.equal(400);
  expect(response.headers['content-type']).to.include('application/json');
  expect(response.body).to.be.jsonSchema(todoSchema);
});


it('melakukan update todo dan validate JSON schema', async function () {
  const updatedTodo = {
    title: 'Learn Node.js Advanced', 
  };

  const todoSchema = {
    type: 'object',
    properties: {
      id: { type: 'number' },
      completed: { type: 'boolean' },
    },
    required: ['id'],
  };

  const response = await request.patch('/todos/1').send(updatedTodo);

  expect(response.status).to.equal(200);
  expect(response.headers['content-type']).to.include('application/json');
  expect(response.body).to.be.jsonSchema(todoSchema);
  expect(response.body.completed).to.equal(true);
});


it('menghapus todo dan validasi', async function () {
   
  const response = await request.delete('/todos/1');

  expect(response.status).to.equal(200);
});
