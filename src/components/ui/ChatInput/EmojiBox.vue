<template>
    <div class="emoji-box">
        <div class="emoji-wrap">
            <div class="emoji-item" v-for="(value, key) in emojiMaps" :key="key" @click="handleSelect(`_[${key}]`)">
                <img :src="value" :title="`_[${key}]`">
            </div>
        </div>
    </div>
</template>

<script>
    import emojiMaps from '@/config/emoji'

    export default {
        emits: ['select'],
        setup(props, context) {
            function handleSelect(emoji) {
                context.emit('select', emoji)
            }

            return {
                emojiMaps,
                handleSelect
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../../style/value.scss';

    .emoji-box {
        width: 363px;
        height: 196px;
        box-shadow: 0 0 12px 0 rgb(106 115 133 / 30%);
        border-radius: 8px;
        margin: 10px 0;
        padding-bottom: 10px;
        box-sizing: border-box;
        border: 1px solid $main-border-color;

        .emoji-wrap {
            height: 100%;
            box-sizing: border-box;
            font-size: 0;
            overflow: auto;
            word-break: break-word;
            margin: 6px 11px 0 11px;
            display: flex;
            flex-wrap: wrap;

            .emoji-item {
                margin: 0;
                padding: 0;
                font-size: 0;

                img {
                    margin: 4px;
                    width: 24px;
                    height: 24px;
                    cursor: pointer;
                }
            }
        }
    }
</style>