import axios from 'axios'

export const register = newUser => {
  return axios
    .post('users/register', {
      pseudo: newUser.pseudo,
      password: newUser.password
    })
    .then(response => {
      console.log('Registered')
    })
}

export const login = user => {
  return axios
    .post('users/login', {
      pseudo: user.pseudo,
      password: user.password
    })
    .then(response => {
      localStorage.setItem('usertoken', response.data)
      if(response.data.error != null){
        localStorage.removeItem('usertoken')
        this.props.history.push(`/`)
      }
      return response.data
    })
    .catch(err => {
      console.log(err)
    })
}

export const getProfile = user => {
  return axios
    .get('users/profile', {
      //headers: { Authorization: ` ${this.getToken()}` }
    })
    .then(response => {
      console.log(response)
      return response.data
    })
    .catch(err => {
      console.log(err)
    })
}