<template>
    <div class="register-main">
        <form @submit.prevent="doRegister">
            <input class="user-info" type="text" v-model="username" placeholder="Username">
            <input class="user-info" type="text" v-model="nickname" placeholder="Nickname">
            <input class="user-info" type="password" v-model="password" placeholder="Password">
            <input class="user-info" type="password" v-model="confirm" placeholder="Confirm Password">
            <input type="submit" value="Register">
            <router-link to="login">
                Already have an account? Login.
            </router-link>
        </form>
    </div>
</template>

<script>
    import {
        reactive,
        toRefs
    } from 'vue'

    import {
        useStore
    } from 'vuex'
    import {
        useRouter
    } from 'vue-router'

    import md5 from 'js-md5'

    export default {
        name: 'Register',
        setup() {
            const store = useStore()

            const router = useRouter()

            const userParams = reactive({
                username: '',
                nickname: '',
                password: '',
                confirm: ''
            })

            function doRegister() {
                if (userParams.username.length > 0 && userParams.password.length > 0) {
                    if(userParams.password !== userParams.confirm) {
                        alert('两次输入的密码不一致！')
                    }
                    else if(userParams.nickname.length == 0) {
                        alert('昵称不能为空！')
                    }
                    else {
                        userParams.password = md5(userParams.password)
                        userParams.confirm = md5(userParams.confirm)

                        store.dispatch('register', userParams)
                        .then(() => {
                            console.log('Success!');
                            router.push('/')
                        })
                        .catch((error) => {
                            alert(error.response.data.error)
                            userParams.password = ''
                            userParams.confirm = ''
                        })
                    }
                } else {
                    alert('用户名或密码不能为空！')
                }
            }

            return {
                ...toRefs(userParams),
                doRegister
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../style/login.scss';

    @include form-style(register);
</style>