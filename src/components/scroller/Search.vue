<template>
    <div class="search-container">
        <slot></slot>
        <section class="search-main">
            <div class="search-input-wrapper">
                <input class="search-input" type="text" v-model="serach">
                <i class="fa fa-search search-btn" aria-hidden="true"></i>
            </div>
            <div class="search-result">
                <div class="search-count">
                    '{{serach}}' 共{{searchResult.length}}条搜索结果
                </div>
                <PeopleItem v-for="(friend, index) in searchResult" :key="index" :friend="friend"></PeopleItem>
            </div>
        </section>
        <div class="search-empty" v-if="empty">
            搜索结果为空
        </div>
    </div>
</template>

<script>
    import {
        reactive,
        ref,
        toRefs,
        watch
    } from 'vue'

    import PeopleItem from '../items/PeopleItem.vue'
    import {
        searchUser
    } from '../../services'

    export default {
        components: {
            PeopleItem
        },
        setup() {
            const states = reactive({
                serach: '',
                empty: false
            })

            const searchResult = reactive([])

            let searchTimer

            function initResult(result) {
                searchResult.splice(0, searchResult.length)

                if (result !== undefined) {
                    if (Array.isArray(result)) {
                        states.empty = false
                        searchResult.push(...result)
                    }
                    else states.empty = true
                }
            }

            watch(() => states.serach, (newSearch) => {
                if (newSearch.length === 0) {
                    initResult()
                    return
                }

                if (searchTimer) {
                    clearTimeout(searchTimer)
                }

                searchTimer = setTimeout(() => {
                    searchUser(newSearch)
                        .then((response) => {
                            initResult(response.data)
                        })
                }, 500)
            })

            return {
                ...toRefs(states),
                searchResult
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../style/value.scss';

    .search-container {
        height: 100%;
        position: relative;

        .search-empty {
            width: fit-content;
            font-size: 20px;
            color: #8a8a8a;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        .search-input-wrapper {
            width: 100%;
            padding: 0 2rem;
            box-sizing: border-box;
            position: relative;

            .search-input {
                width: 100%;
                height: 30px;
                border: none;
                outline: none;
                box-sizing: border-box;
                border: 1px solid $main-border-color;
                border-radius: 30px;
                padding: 18px;
                background-color: #FDFDFD;

                &:focus,
                &:active {
                    border-color: $icon-hover-color;
                }
            }

            .search-btn {
                position: absolute;
                top: 10px;
                right: 3rem;
            }
        }

        .search-result {
            margin-top: 1rem;

            .search-count {
                color: #808080;
                font-size: 14px;
                margin-bottom: 1rem;
            }
        }
    }
</style>