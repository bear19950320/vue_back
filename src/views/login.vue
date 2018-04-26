<style lang="less">
    @import './login.less';
</style>
<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎登录
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userName">
                            <Input :disabled="form.hasSubmit" v-model="form.userName" placeholder="请输入用户名">
                            <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" :disabled="form.hasSubmit" v-model="form.password" placeholder="请输入密码">
                            <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button :disabled="form.hasSubmit" @click="handleSubmit" type="primary" long>登录</Button>
                        </FormItem>
                    </Form>
                    <p class="login-tip">输入用户名和密码</p>
                </div>
            </Card>
        </div>
    </div>
</template>
<script>
    import Cookies from 'js-cookie';
    import util from '@/libs/util';
    export default {
        data () {
            return {
                form: {
                    userName: 'admin',
                    password: '999666admin1234',
                    hasSubmit: false
                },
                rules: {
                    userName: [
                        {required: true, message: '账号不能为空', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '密码不能为空', trigger: 'blur'}
                    ]
                }
            };
        },
        methods: {
            handleSubmit () {
                this.$refs.loginForm.validate((valid) => {
                    sessionStorage.authMenus = '';
                    if (valid) {
                        this.form.hasSubmit = true;
                        var data = {
                            'username': this.form.userName,
                            'password': this.form.password
                        };
                        util.ajax.post('/management/login', data).then(res => {
                            if (res.data.ok) {
                                this.$Message.success('登录成功');
                                Cookies.set('user', this.form.userName);
                                var $store = this.$store;
                                var $router = this.$router;
                                setTimeout(function () {
                                    if (res.data.data.token) {
                                        // 储存 token
                                        localStorage.token = res.data.data.token;
                                    }
                                    // 设置菜单权限
                                    sessionStorage.authMenus = res.data.data.authMenus;
                                    // 设置头像
                                    $store.commit('setAvator', util.base + '/management/getUserAvator?id=' + res.data.data['avatorId']);
                                    $router.push({name: 'home_index'});
                                }, 500);
                            } else {
                                this.form.hasSubmit = false;
                                this.$Message.error('登录失败，账号或密码错误');
                            }
                        }).catch(err => {
                            console.log(err);
                        });
                    }
                });
            }
        }
    };
</script>