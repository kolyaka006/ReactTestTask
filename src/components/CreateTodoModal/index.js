import React, {Component} from 'react';
import Todo from '../Todo';
import ajax from '../AJAXRequest/ajax';
import Modal from 'react-modal';
import ImageCompressor from 'image-compressor.js';
import './index.css';

const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

class CreateTodoModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      preview: false,
      validator: {}
    }

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handlePreview = this.handlePreview.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleUploadImage = this.handleUploadImage.bind(this);
    this.clearImage = this.clearImage.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
  }

  handleOpenModal = () => {
    this.setState({open: !this.state.open})
  }

  handlePreview = () => {
    const previewTodo = {
      email: this.refs.email.value,
      username: this.refs.username.value,
      text: this.refs.text.value,
      image_path: this.state.imageUrl
    }

    this.setState({preview: !this.state.preview, previewTodo: previewTodo})
  }

  //to custom upload image button
  handleUploadImage = () => {
    this.refs.fileField.click()
  }

  handleImageChange(e) {
    e.preventDefault();
    let file = e.target.files[0];
    if (['image/jpeg', 'image/png', 'image/gif'].indexOf(file.type) > -1){
      let reader = new FileReader();
      reader.onloadend = () => {
        const _this = this
        new ImageCompressor(file, {
          maxWidth: 320,
          success(result) {
            _this.setState({imageUrl: reader.result, image: result})
          },
          error(e) {}
        });
      }
      if (file)
        reader.readAsDataURL(file)
    }
  }

  clearImage = (e) => {
    e.preventDefault();
    this.setState({imageUrl: undefined, image: undefined})
  }

  handleCreate = () => {
    let todoQuery = {email: this.refs.email.value, username: this.refs.username.value, text: this.refs.text.value, image: this.state.image}
    //check empty fields
    let validator = {};
    for (let key in todoQuery) {
      if (!todoQuery[key]) {
        validator[key] = !todoQuery[key]
      } else {
        //validation email
        if (key === 'email' && !EMAIL_REGEXP.test(todoQuery[key])) {
          validator[key] = true
        }
      }
    }

    if (Object.keys(validator).length === 0) {
      //protect from js script
      todoQuery.email = this.safeHtml(todoQuery.email)
      todoQuery.username = this.safeHtml(todoQuery.username)
      todoQuery.text = this.safeHtml(todoQuery.text)

      let {username, email, text, image} = todoQuery
      //create todo
      ajax.createTodo(username, email, text, image).then(res => {
        //get actual information
        ajax.getList().then(data => {
          this.props.updateRespond(data.data.message)
          //clear state and close modal
          this.setState({
            open: false,
            imageUrl: undefined,
            image: undefined,
            preview: undefined,
            previewTodo: undefined,
            validator: {}
          })

        })
      })
    } else {
      this.setState({validator: validator})
    }
  }

  //protect from js script
  safeHtml = (text) => {
    let map = {
        '&': '&amp;',
        '\'': '&#039;',
        '\"': '&quot;',
        '<': '&lt;',
        '>': '&gt;'
    }

    let fun = (symb) => {
        return map[symb];
      };

    return text.replace(/[<'&">]/g, fun)
  };


  render() {
    return (
      <div className='w-100'>
        <button className='pointer btn btn-primary' onClick={this.handleOpenModal}>{'Create new todo'}</button>
        <Modal className='header__modal' isOpen={this.state.open} ariaHideApp={false}>
          <div className='container header__modal_content-style'>
            <div className='row m-b-10'>
              <div className='col-12 text-center'><b>Create new todo</b></div>
            </div>
            <div className='row m-b-10'>
              <div className='col-12 col-md-6 header__username-inp'>
                <input ref='username'
                       type='text'
                       className={`form-control${this.state.validator.username ? ' error-border' : ''}`}
                       placeholder='Username'/>
              </div>
              <div className='col-12 col-md-6'>
                <input ref='email'
                       type='text'
                       className={`form-control${this.state.validator.email ? ' error-border' : ''}`}
                       placeholder='Email'/>
              </div>
            </div>
            <div className='row'>
              <div className='col-12'>
                <textarea ref='text'
                          className={`form-control${this.state.validator.text ? ' error-border' : ''}`}
                          name='text'
                          id='1'
                          cols='30'
                          rows='5'
                          placeholder='Text todo'></textarea>
              </div>
            </div>
            <div className='row'>
              <div className='col-12 col-md-6 offset-md-3'>
                <div className={`header__image-block${this.state.imageUrl ? '' : ' header__image-block_border'}${this.state.validator.image ? ' error-border' : ''}`}
                     onClick={this.handleUploadImage} style={{backgroundImage: `url('${this.state.imageUrl}')`}}>
                  { !this.state.imageUrl && <div className='header__plus'>
                        <div className='header__plus_ver'/>
                        <div className='header__plus_hor'/>
                      </div>
                  }
                </div>
                { this.state.imageUrl && <div className='header__close-cross' onClick={this.clearImage}>X</div> }
                <form className='hide'>
                  <input ref='fileField' className="fileInput" type="file" onChange={this.handleImageChange} accept="image/jpeg, image/png, image/gif"/>
                </form>
              </div>
            </div>
            <div className='row m-t-10'>
              <button className='btn btn-success header__btn-create col-md-2 offset-md-2' onClick={this.handleCreate}>Create</button>
              <button className='btn btn-dark header__btn-create col-md-2 offset-md-1 d-none d-sm-inline' onClick={this.handlePreview}>Preview</button>
              <button className='btn btn-danger col-md-2 offset-md-1' onClick={this.handleOpenModal}>Cancel</button>
            </div>
            { this.state.preview && <div className='row'>
              <div className='col-12 m-t-10'>
                <Todo {...this.state.previewTodo}/>
              </div>
            </div> }
          </div>
        </Modal>
      </div>
    );
  }
}

export default CreateTodoModal;