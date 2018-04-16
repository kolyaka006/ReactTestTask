import React, {Component} from 'react';
import md5 from 'md5';
import ajax from '../AJAXRequest/ajax';
import './index.css';

class Todo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      edit: false
    }

    this.handleEdit = this.handleEdit.bind(this)
    this.handleChangeText = this.handleChangeText.bind(this)
    this.handleChangeStatus = this.handleChangeStatus.bind(this)
    this.handleCancelEdit = this.handleCancelEdit.bind(this)
  }

  handleEdit = () => {
    this.setState({edit : !this.state.edit, unValidText: false}, () => {
      this.refs.text.value = this.props.text
    })
  }

  handleCancelEdit = () => {
    this.setState({edit: false, unValidText: false})
  }

  handleChangeText = () => {
    if (this.refs.text.value) {
      //encode string
      let query = `text=${encodeURIComponent(this.refs.text.value)}&token=beejee`
      query = query + `&signature=${md5(query)}`
      ajax.edit(this.props.id, query).then(res => {
        if (res.data.status === 'ok') {
          //get actual information
          ajax.getList().then(data => {
            this.props.updateRespond(data.data.message)
            this.setState({edit: false})
          })
        } else {
          this.setState({unValidText: true})
        }
      })
    } else {
      this.setState({unValidText: true})
    }
  }

  handleChangeStatus = () => {
    let query = `status=${this.props.status === 10 ? 0 : 10}&token=beejee`
    query = query + `&signature=${md5(query)}`
    ajax.edit(this.props.id, query).then(res => {
      //get actual information
      ajax.getList().then(data => {
        this.props.updateRespond(data.data.message)
      })
    })
  }

  render() {
    return (
      <div className={`d-flex todo${this.props.status === 10 ? ' todo_done' : ' todo_undone'}`}>
        <div className='todo-list__username todo__username d-flex align-items-center'>
          <div className='w-100 text-overflow'>{this.props.username || '-'}</div>
        </div>
        <div className='todo-list__email todo__email d-flex align-items-center'>
          <div className='w-100 text-overflow'>{this.props.email || '-'}</div>
        </div>
        <div className='todo-list__text todo__text d-flex align-items-center'>
          <div> { this.state.edit
                    ? <div>
                      <textarea ref='text' className={`form-control${this.state.unValidText ? ' error-border' : ''}`}
                                name='text'
                                id='1'
                                cols='30'
                                rows='5'
                                placeholder='Text todo' />
                      </div>
                    : this.props.text || '-'
                }
        </div>
        </div>
        <div className='todo-list__image todo__image m-t-10 m-b-10'
             style={{backgroundImage: `url(${this.props.image_path})`}}/>
        <div className='todo-list__status todo__status d-flex align-items-center'>
          { this.props.adminLogin
            ? <div className='w-100'>
                <button className={`btn btn-${this.props.status === 10 ? 'success' : 'danger'} m-b-10 w-100`}
                        onClick={this.handleChangeStatus}>
                  {this.props.status === 10 ? 'Done' : 'Undone'}
                </button>
              { !this.state.edit
                ? <button className='btn btn-warning w-100' onClick={this.handleEdit}>Edit</button>
                : <div className='w-100'>
                    <button className='btn btn-success w-100 m-b-10' onClick={this.handleChangeText}>Save</button>
                    <button className='btn btn-danger w-100' onClick={this.handleCancelEdit}>Cancel</button>
                  </div>
              }
              </div>
            : <div className='w-100 text-overflow'>{this.props.status === 10 ? 'done' : 'undone'}</div>
          }
        </div>
      </div>
    );
  }
}

export default Todo;