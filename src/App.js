import React, { Component } from 'react';
import TodoList from './components/TodoList'
import Header from './components/Header'
import ajax from './components/AJAXRequest/ajax'
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      load: true,
      adminLogin: false,
      respond: {}
    }

    this.updateRespond = this.updateRespond.bind(this)
    this.adminSignIn = this.adminSignIn.bind(this)
  }

  componentDidMount() {
    ajax.getList().then(res => this.setState({respond: res.data.message}))
  }

  updateRespond = (respond) => {
    this.setState({respond: respond})
  }

  adminSignIn = (bool) => {
    this.setState({adminLogin: bool})
  }

  render() {
    return (
      <div className='container-fluid'>
        <Header updateRespond={this.updateRespond} adminSignIn={this.adminSignIn} adminLogin={this.state.adminLogin}/>
        <div className='row'>
          <div className='col-12'>
            <TodoList {...this.state.respond} updateRespond={this.updateRespond} adminLogin={this.state.adminLogin} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
