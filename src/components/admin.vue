<template>
  <div class='admin-page'>
    <div class='header'>图片审核管理</div>
    <div style="display:flex;flex-direction:row; justify-content:flex-start;align-items:center;padding-left:20px;line-height:40px">
      <div style="margin-right:10px;">审核状态: </div>
      <div>
        <Select v-model="checkfilter" style="width:200px" @on-select="changeChecked">
          <Option v-for="item in checkList" :value="item.value" :key="item.value">{{ item.name }}</Option>
        </Select>
      </div>
    </div>
    <Table style='margin:10px;' :columns = 'columns' :data = "data">
       <template slot-scope="{ row }"  slot="checked">
          <span :style="{'color':row.checked==0 ? 'orange': row.checked==1? 'green':'red'}">
          {{ row.checked |formatCheck }} 
          </span>
       </template>
       <template slot-scope="{ row }"  slot="url">
          <a :href="row.url"  _target='blank'>
          {{ row.url }} 
          </a>
       </template>
        <template slot-scope="{ row }" slot="action">
          <!-- {{ row.checked }}  -->
          <div style='display:flex;flex-direction:row;justify-content:space-between'>
            <Button v-if='row.checked!=1' @click='passhandler(row.id)' type="success">通过 </Button>
            <Button v-if='row.checked==0' @click='unpasshandler(row.id)' type="primary">不通过</Button>
            <Button type="error" @click='del(row.id)'>删除</Button>
          </div>
       </template>
    </Table>
     <Page style='margin:10px' :total="total" :current='pageNum'  :page-size='per' @on-change='changePage' @on-page-size-change='sizeChange' show-sizer />
  </div>
</template>
<script>
import Axios from 'axios'
import config from '../../config'
export default {
  mounted(){
    let islogin = window.localStorage.getItem('islogin')
    if(islogin!=1){
      this.$router.push({name:'login'})
      return 
    }
    this.parseParams()
    this.getData()
  },
  filters: {
    formatCheck(val) {
      if(val == 0) {
        return `未审核`
      }
      if(val == 1) {
        return  `审核通过`
      }
      return `不通过`
    }
  },
  methods:{
    passhandler(id){
      Axios.get(`${config.API_HOST}/api/file/pass?id=${id}`).then(res => {
        console.log(res)
        this.getData()
      })
    },
    unpasshandler(id){
      Axios.get(`${config.API_HOST}/api/file/unpass?id=${id}`).then(res => {
        console.log(res)
        this.getData()
      })
    },
    del(id){
      this.$Modal.confirm({
            title: '提示',
            content: '您的操作将会彻底删除改文件',
            onOk: () => {
                Axios.get(`${config.API_HOST}/api/file/del?id=${id}`).then(res => {
                console.log(res)
                this.getData()
              })
            },
            onCancel: () => {
                
            }
        });
     
    },
    changeChecked(val){
      this.checkfilter =  val.value
      this.$router.replace({name:'admin',query:{
        per:this.per,
        pageNum: this.pageNum,
        check: this.checkfilter
      }})
    },
    parseParams(){
      const query = this.$route.query
      this.per = parseInt(query.per) || 20 
      this.pageNum = parseInt(query.pageNum) || 1 
      this.checkfilter = query.check || 'all'
    },
    getCheck(c) {
      if(!c || c =='all'){
        return null
      }
      if(c=='passed'){
        return 1
      }
      if(c == 'unpassed'){
        return 2
      }
      if(c=='uncheck'){
        return 0
      }
      return null
    },
    getData(){
      let queryString = `per=${this.per}&pageNum=${this.pageNum}`
      const ch = this.getCheck(this.checkfilter)
      if(ch) {
        queryString =`${queryString}&check=${ch}`
      } 
      Axios.get(`${config.API_HOST}/api/file?${queryString}`).then(res => {
        console.log(res)
        this.data = res.data.data.list
        this.total = res.data.data.total
      })
    },
    sizeChange(val) {
      this.per = val
      this.$router.replace({name:'admin',query:{
        per:this.per,
        pageNum: this.pageNum,
        check: this.checkfilter
      }}) 
    },
    changePage(val){
      this.pageNum =val
      this.$router.replace({name:'admin',query:{
        per:this.per,
        pageNum: this.pageNum,
        check: this.checkfilter
      }}) 
    }
  },
  watch: {
    $route(val){
      this.parseParams(val)
      this.getData()
    }
  },
  data() {
    return {
      checkfilter:'all',
      checkList:[
        {
          value:'all',
          name:'全部'
        },
        {
          value:'uncheck',
          name:'未审核'
        },
        {
          value:'passed',
          name:'审核通过'
        },
        {
          value:'unpassed',
          name:'审核不通过'
        }
      ],
      per:20,
      pageNum:1,
      total:0,
      columns:[
        {
          title:"文件名",
          key:'filename'
        },
        {
          title:"上传人",
          key:'nickname'
        },
        {
          title:"手机号",
          key:'phone'
        },
        {
          title:"图片地址",
          key:'url'
        },
        {
          title:'状态',
          slot:'checked'
        },
        {
            title: 'Action',
            slot: 'action',
            width: 250,
            align: 'center'
        }
      ],
      data:[]
    }
  }
}
</script>
<style>
.header{
  background:#000;
  color:white;
  font-size: 20px;
  font-weight: bold;
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: left;
  padding-left:20px;
}
</style>