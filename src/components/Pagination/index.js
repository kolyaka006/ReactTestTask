import React, {Component} from 'react';
import config from '../../config.json';
import ajax from '../AJAXRequest/ajax';
import randomstring from 'randomstring';
import './index.css';

class Pagination extends Component {
  constructor(props) {
    super(props)
    this.state = {
      curPage: 0
    }

    this.renderPagination = this.renderPagination.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick = (page) => {
    ajax.getList(page).then(res => {
      this.setState({curPage: page - 1})
      this.props.updateRespond(res.data.message)
    })
  }

  renderPagination = () => {
    let arrPagination = [];
    const page_count = Math.ceil(this.props.totalTaskCount / config.countOnPage)
    for (let i = 0; i < page_count; i++) {

      if (i < this.state.curPage - 2 || i > this.state.curPage + 2) {
        continue
      }

      arrPagination.push(<div key={randomstring.generate(7)}
                              className={`pagination__button${this.state.curPage === i ? ' pagination__button_current' : ''}`}
                              onClick={() => this.handleClick(i+1)}>{i + 1}</div>)
    }

    if (this.state.curPage > 2) {
      arrPagination.unshift(<div key={randomstring.generate(7)}
                                 className={'pagination__button'}
                                 onClick={() => this.handleClick(1)}>{'<-'}</div>)
    }

    if (page_count - this.state.curPage > 3) {
      arrPagination.push(<div key={randomstring.generate(7)}
                              className={'pagination__button'}
                              onClick={() => this.handleClick(page_count)}>{'->'}</div>)
    }

    return arrPagination
  }

  render() {
    return (
      <div className='d-flex justify-content-center'>
        {+this.props.totalTaskCount > config.countOnPage && this.renderPagination()}
      </div>
    );
  }
}

export default Pagination;