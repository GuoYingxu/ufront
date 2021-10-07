<template>
  <div style='margin-top:60px;text-align:center'>
    <div class='inline'>
      <Input v-model="phone" placeholder="请填写您的手机号" /> 
      <span style='width:40px;'>必填 </span>
    </div>
    <div class='inline '>
     <Input v-model="nickname" placeholder="请输入一个昵称" />
     <span style='width:40px'> 必填</span>
    </div>
   <Upload  ref= 'upload' 
    :on-exceeded-size = 'sizeHandler' 
    :max-size = '10240'
    :action="url"
    :disabled = '!token'
    :data="{token:token}"
    :on-success="uploadsuccess">
        <Button icon="ios-cloud-upload-outline">上传文件</Button>
    </Upload>

     <Button v-if='currentFile' type="success" @click="submit">提交</Button>
  </div>
</template>
<script> 
import Axios from 'axios';
import config from '../../config'
export default {
  data(){
    return {
      token:'',
      phone:'',
      nickname:'',
      url: `${config.UPLOAD_HOST}`,
      currentFile:null
    }
  },
  methods:{
    beforeUpload(){
     const check= this.$refs.upload.fileList.length == 0; 
     if(!check) {
       this.$Modal.info({
         title:'提示',
         content:'只能上传一个文件'
       })
     }
     return check
    },
    sizeHandler(file){
       this.$Modal.info({
            title: '提示',
            content: '上传文件不能大于10M'
        });
      console.log(file.size)
    },
    uploadsuccess(res){
      console.log(res)
       this.currentFile = res
    },
    checkPhone(number){
     var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
     if(!myreg.test(number)) {
       return false
     }
     return true
    },
    checkVars(){
      if(!this.nickname.trim()){
        this.$Modal.info({
          title:'提示',
          content:'请输入一个昵称'
        })
        return false 
      }
      if(!this.checkPhone(this.phone)){
        this.$Modal.info({
          title:'提示',
          content:'请输入正确的手机号码！'
        })
        return false
      }
      if(!this.currentFile) {
         this.$Modal.info({
          title:'提示',
          content:'请上传一个文件'
        })
        return false
      }
      return true
    },
    submit(){ 
      if(!this.checkVars()){
        return 
      } 
      console.log(this.currentFile)
      Axios.post(`${config.API_HOST}/api/file/send`,{
        filename:this.currentFile.key,
        nickname:this.nickname,
        phone:this.phone,
        url: `${config.QINIU_HOST}/${this.currentFile.key}`
      }).then(res=> {
        console.log(res)
        this.$Modal.info({
          title:"提示",
          content:'提交成功！'
        })
        this.currentFile = null
        this.$refs.upload.fileList = []
      })
    },
    getToken(cb){
      Axios.get(`${config.API_HOST}/api/qiniu/token`).then(res => {
        this.token = res.data.uploadToken
        if(cb){
          this.$nextTick(() => cb())
        }
      })
    }
  },
  mounted(){
    if(!this.token){
      this.getToken()
    }
  }

}
</script>
<style scoped>
.inline {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items:center;
  margin:20px;
}
</style>