<template>
  <Header></Header>
  <div class="login-content">
    <div class="login-flex">
      <div class="login-left">
        <p>万民用户知心托付&nbsp;&nbsp;&nbsp;&nbsp;<span>{{ historyAvgRate }}%</span>历史年化收益</p>
        <p>千万级技术研发投入&nbsp;&nbsp;&nbsp;&nbsp;亿级注册资本平台  </p>
      </div>
      <!---->
      <div class="login-box">
        <h3 class="login-title">用户注册</h3>
        <form action="" id="register_Submit">
          <div class="alert-input">
            <input type="text" class="form-border user-num" name="mobile" v-model="phone" @blur="checkPhone" placeholder="请输入11位手机号">
            <div class="err">{{phoneErr}}</div>
            <p class="prompt_num"></p>
            <input type="password" placeholder="请输入6-20位英文和数字混合密码" v-model="password" @blur="checkPassword" class="form-border user-pass" autocomplete name="password">
            <div class="err">{{passwordErr}}</div>
            <p class="prompt_pass"></p>
            <div class="form-yzm form-border">
              <input class="yzm-write" type="text" name="" v-model="code" placeholder="输入短信验证码" @blur="checkCode">
              <div class="err">{{codeErr}}</div>
              <input class="yzm-send" type="button" v-model="yzmText" @click="requestSmsCode" id="yzmBtn" >
            </div>
            <p class="prompt_yan"></p>
          </div>
          <div class="alert-input-agree">
            <input type="checkbox" v-model="agree"> 我已阅读并同意<a href="javascript:;" target="_blank">《动力金融网注册服务协议》</a>
          </div>
          <div class="alert-input-btn">
            <input type="button" class="login-submit" @click="requestUserRegister" value="注册">
          </div>
        </form>
        <div class="login-skip">
          已有账号？ <a href="javascript:void(0)"  @click="goLink('/user/login')">登录</a>
        </div>
      </div>

    </div>
  </div>

  <Footer></Footer>
</template>

<script>
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import {doGet, doPostUrl} from "@/api/httpRequest";
import layx from 'vue-layx'
import md5 from 'js-md5'
export default {
  name: "RegisterView",
  components: {Header,Footer},
  data(){
    return{
      historyAvgRate:0.0,
      phone:"",
      phoneErr:"",
      password:"",
      passwordErr:"",
      code:"",
      codeErr:"",
      yzmText:"获取验证码",
      isSend:false,
      agree:false
    }
  },
  mounted() {
    doGet("/v1/plat/info").then(resp=>{
      if(resp){
        this.historyAvgRate=resp.data.data.historyAvgRate
      }
    })
  },
  methods:{
    checkPhone(){
      if(this.phone==''||this.phone==undefined){
        this.phoneErr='请输入手机号'
      }else if(this.phone.length!=11){
        this.phoneErr='手机号长度不足11位'
      }else if(!/^1[1-9]\d{9}$/.test(this.phone)){
        this.phoneErr='手机号格式不正确'
      }else{
        this.phoneErr=''
        doGet("/v1/user/phone/exists",{phone:this.phone}).then(resp=>{
          if(resp && resp.data.code==1000){
            console.log('手机号可以注册')
          }else{
            this.phoneErr=resp.data.msg
          }
        })
      }
    },
    checkPassword(){
      if(this.password==''||this.password==undefined){
        this.passwordErr='请输入密码'
      }else if(this.password.length<6||this.password.length>20){
        this.passwordErr='密码长度只能为6-20位'
      }else if(!/^[0-9a-zA-Z]+$/.test(this.password)){
        this.passwordErr='密码字符只可使用数字和大小写英文字母'
      }else if(!/^(([a-zA-Z]+[0-9]+)|([0-9]+[a-zA-Z]+))[a-zA-Z0-9]*/.test(this.password)){
        this.passwordErr='密码只能是数字和英文字母的混合'
      }else {
        this.passwordErr=''
          console.log("密码可以使用")
      }
    },
    checkCode(){
        if(this.code==''||this.code==undefined){
          this.codeErr='必须输入验证码'
        }else if(this.code.length!=4){
          this.codeErr='验证码必须是4位'
        }else{
          this.codeErr=''
        }
    },
    requestSmsCode(){

      if(this.isSend==false){
        this.checkPhone()
        if(this.phoneErr==''){
          this.isSend=true
          let btn=document.getElementById("yzmBtn")
          let second=60
          setInterval(()=>{
            btn.style.color='red'
            if(second<=1){
              btn.style.color='#688EF9'
              this.yzmText="获取验证码"
              this.isSend=false
              return
            }
            second=second-1
            this.yzmText=second+"秒后重新获取"

          },1000)
          doGet('/v1/sms/code/register',{phone:this.phone})
              .then(resp=>{
                if(resp&&resp.data.code==1000||resp.data.code==1006){
                  layx.msg('短信发送成功！',{dialogIcon: 'success',position:'ct'})
                }
              })
        }
      }

    },
    requestUserRegister(){
      this.checkPhone()
      this.checkPassword()
      this.checkCode()
      if(this.phoneErr==''&&this.passwordErr==''&&this.codeErr==''){
        if(this.agree){
          let newPassword=md5(this.password)
          doPostUrl('/v1/user/register',{phone:this.phone,pword:newPassword,scode:this.code})
              .then(resp=>{
                if(resp&&resp.data.code==1000){
                  console.log("注册成功")
                  this.goLink('/user/login')
                }
              })
        }else{
          layx.msg('请阅读注册协议，并勾选',{dialogIcon: 'warn',position:'ct'})
        }
      }
    },
    goLink(url,params){
      this.$router.push({
        path:url,
        query:params
      })
    }
  }
}
</script>

<style scoped>
  .err {
    color: red;
    font-size: 18px;
  }
</style>