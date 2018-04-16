import React, {Component} from 'react';
import CreateTodoModal from '../CreateTodoModal';
import config from '../../config.json';
import './index.css';


class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }

    this.handleSignIn = this.handleSignIn.bind(this)
  }

  handleSignIn = () => {
    let signParams = {username: this.refs.loginUsername.value, password: this.refs.loginPassword.value}
    this.props.adminSignIn(signParams.username === config.adminLogin && signParams.password === config.adminPassword)
  }

  render() {
    return (
      <div className='row header m-b-30'>
         <div className='col-6 d-flex align-items-center'>
           <CreateTodoModal updateRespond={this.props.updateRespond}/>
         </div>
         <div className='col-6'>
           {this.props.adminLogin
             ? <div className='row h-100'>
                 <div className='col-12 d-flex justify-content-end align-items-center'>Admin</div>
               </div>
             : <div className='row h-100'>
                 <div className='col-5 d-flex align-items-center'>
                   <input ref='loginUsername' type='text' className='form-control' placeholder='Username'/>
                 </div>
                 <div className='col-5 d-flex align-items-center'>
                   <input ref='loginPassword' type='password' className='form-control' placeholder='Password'/>
                 </div>
                 <div className='col-2 d-flex align-items-center pointer' onClick={this.handleSignIn}>Sign In</div>
               </div>
           }
         </div>
      </div>
    );
  }
}

export default Header;