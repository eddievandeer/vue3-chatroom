<template>
    <div class="login-main">
        <form @submit.prevent="doLogin()">
            <input class="user-info" type="text" v-model="username" placeholder="Username">
            <input class="user-info" type="password" v-model="password" placeholder="Password">
            <input type="submit" value="Login">
            <router-link to="register">
                Don't have an account? Register.
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
        name: 'Login',
        setup() {
            const store = useStore()

            const router = useRouter()

            let userParams = reactive({
                username: '',
                password: ''
            })

            function doLogin() {
                if (userParams.username.length > 0 && userParams.password.length > 0) {
                    userParams.password = md5(userParams.password)

                    store.dispatch('login', userParams)
                        .then((response) => {
                            console.log('Success!', response);
                            router.push('/')
                        })
                        .catch((error) => {
                            console.log(error.response);
                            alert(error.response.data.error)
                            userParams.password = ''
                        })
                } else {
                    alert('用户名或密码不能为空！')
                }
            }

            return {
                ...toRefs(userParams),
                doLogin
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../style/login.scss';

    @include form-style(login);
</style>