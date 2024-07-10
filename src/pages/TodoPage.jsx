import React from 'react';
import Tabs from '../component/Tabs';
import Todo from '../component/Todo';

const TodoPage = () => {
  return (
    <div>
      
      <Tabs/>
      <h1>やることリスト</h1>
      <Todo/>
    </div>
  );
};

export default TodoPage;