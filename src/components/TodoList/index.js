import React, {Component} from 'react';
import Todo from '../Todo'
import Pagination from '../Pagination'
import './index.css';

class TodoList extends Component {
  render() {
    return (
      <div className='todo-list m-t-10'>
        <div className='d-flex m-b-10'>
          <div className='todo-list__username text-center'>Name</div>
          <div className='todo-list__email text-center'>Email</div>
          <div className='todo-list__text text-center'>Text</div>
          <div className='todo-list__image text-center'>Image</div>
        </div>
        {this.props.tasks && this.props.tasks.map(todo => <Todo key={todo.id} {...todo}
                                                                adminLogin={this.props.adminLogin}
                                                                updateRespond={this.props.updateRespond} />)}
        <div> {!this.props.tasks && 'Not one todo block not created. You can be first!'} </div>
        <Pagination totalTaskCount={this.props.total_task_count} updateRespond={this.props.updateRespond} />
      </div>
    );
  }
}

export default TodoList;