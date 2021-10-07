<template>
  <div class='loginpage'>
    <div style="font-size:30px;font-weight:bold;text-align:center;margin:60px;"> 图片视频管理系统</div>
    <div class='loginmodal'>
        <Input v-model="username" prefix="md-person" placeholder="用户名" style="width: 320px;margin:10px" />
        <Input v-model="password" type="password" prefix="md-lock" password placeholder="密码" style="width: 320px;margin:10px" />
        <Button type="primary" style="width:320px; margin:10px" @click="login" >登录</Button>
    </div>
  </div>
</template>
<script>
import Axios from 'axios'
import config from '../../config'
export default {
  data(){
    return {
      username:'',
      password:''
    }
  },
  methods:{
    login(){
      if(this.username.trim() && this.password.trim()){
        Axios.post(`${config.API_HOST}/api/user/login`,{
          username:this.username,
          password:this.password
        }).then(res => {
          if(res.data.message == 'success'){
            window.localStorage.setItem('islogin',1)
            this.$router.push({name:'admin'})
          }else{
           this.$Message.info('用户名密码错误！'); 
          }
        })
      }else{
        this.$Message.info('请填写用户名密码！');
      }
    }
  },
  mounted(){
    let islogin = window.localStorage.getItem('islogin')
    console.log(islogin)
    if(islogin ==1) {
      this.$router.push({name:'admin'})
    }
  }
}
</script>
<style scoped>
  .loginpage{
    width:100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: auto;
  }
  .loginmodal{
    display: flex;
    width: 304px;
    margin: auto;
    flex-direction: column;
  }
</style>