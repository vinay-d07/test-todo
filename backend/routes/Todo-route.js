const express = require('express');
const router = express.Router();
const { getTodos, createTodo, updateTodo, deleteTodo } = require('../controlllers/todozcontroller');

router.get('/', getTodos);
router.post('/', createTodo);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

module.exports = router;

