import React, {Component} from 'react';
import Todo from '../Todo';
import ajax from '../AJAXRequest/ajax';
import Pagination from '../Pagination';
import './index.css';

class TodoList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      type: true,
      method: 'id'
    }
  }

  handleSort = (type) => {
    ajax.getList(undefined, type).then(res => {
      this.props.updateRespond(res.data.message)
      this.setState({method: type})
    })
  }

  handleSortType = (type) => {
    ajax.getList(undefined, undefined, !this.state.type ? 'asc' : 'desc').then(res => {
      this.props.updateRespond(res.data.message)
      this.setState({type: !this.state.type})
    })
  }

  render() {
    return (
      <div className='todo-list m-t-10'>
        <div className='d-flex align-items-center m-b-10'>
          <div className='m-r-10'>Sort by :</div>
          <button className={`btn btn-${this.state.method === 'id' ? 'success' : 'default'} m-r-10`}
                  onClick={this.handleSort.bind(this, 'id')}>Default</button>
          <button className={`btn btn-${this.state.method === 'name' ? 'success' : 'default'} m-r-10`}
                  onClick={this.handleSort.bind(this, 'name')}>Name</button>
          <button className={`btn btn-${this.state.method === 'email' ? 'success' : 'default'} m-r-10`}
                  onClick={this.handleSort.bind(this, 'email')}>Email</button>
          <button className={`btn btn-${this.state.method === 'status' ? 'success' : 'default'} m-r-10`}
                  onClick={this.handleSort.bind(this, 'status')}>Status</button>
          <button className={`btn btn-default`}
                  onClick={this.handleSortType}>{this.state.type ? 'A -> Z' : 'Z -> A'}</button>
        </div>
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