import axios from 'axios';
import config from '../../config.json';
let [_page, _sort, _type] = [0, 'id', 'asc']

export default {
  getList: (page, sort, type) => {
    _page = page ? page : _page;
    _sort = sort ? sort : _sort;
    _type = type ? type : _type;
    return axios.get(`${config.backendUrl}&sort_field=${sort || _sort}&sort_direction=${type || _type}&page=${page || _page}`)
  },

  edit: (id, fields) => {
    return axios.post(`${config.backendUrlDefault}edit/${id}/?developer=NickolayZhigulin`, fields)
  },

  createTodo: (username, email, text, image) => {
    let form = new FormData();
    form.append('username', username);
    form.append('email', email);
    form.append('text', text);
    form.append('image', image);
    return axios.post(config.backendUrlCreate, form, {
      'mimeType': 'multipart/form-data'
    })

  }
}