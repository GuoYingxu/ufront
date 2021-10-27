const config = {
  test:1,
  // API_HOST:'http://localhost:3001/api' ,
  API_HOST: process.env.NODE_ENV === 'development' ? 'http://localhost:80' : '',
  UPLOAD_HOST:"https://up-z2.qbox.me",
  token:"",
  QINIU_HOST:'http://cdn.guoyingxu.com'
}
export default config
