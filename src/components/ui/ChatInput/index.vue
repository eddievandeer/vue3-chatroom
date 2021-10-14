<template>
    <div class="chat-input">
        <div class="tool-bar">
            <button class="emoji-button" @click="toggleEmoji"><i class="fa fa-smile-o" :class="{'active': showEmoji}" aria-hidden="true"></i></button>
            <label class="image-button" for="image"><i class="fa fa-image" aria-hidden="true"></i></label>
            <button class="video-button"><i class="fa fa-video-camera" aria-hidden="true"></i></button>
            <input type="file" id="image" accept="image/gif, image/jpeg, image/png" style="display: none;">
        </div>
        <div class="bottom-bar">
            <slot></slot>
            <textarea ref="textarea" class="console-input" placeholder="在此输入内容" :style="textareaCalcStyle"
                :value="modelValue" @input="handleInput" @change="handleChange">
            </textarea>
        </div>
        <EmojiBox v-show="showEmoji" @select="handleSelect"></EmojiBox>
    </div>
</template>

<script>
    import {
        reactive,
        ref,
        watch,
        computed,
        nextTick,
        onMounted
    } from 'vue'
    import {
        copy
    } from '@/utils/util'

    import calcTextareaHeight from './calcTextareaHeight'
    import EmojiBox from './EmojiBox.vue'

    export default {
        props: {
            modelValue: {
                type: [Object, String, Number, Boolean],
                default: ''
            },
        },
        components: {
            EmojiBox
        },
        emits: ['update:modelValue', 'change', 'input'],
        setup(props, context) {
            const textarea = ref(null)

            const showEmoji = ref(false)

            const textareaCalcStyle = reactive({
                height: "0",
                minHeight: "0"
            })

            const nativeInputValue = computed(
                () => (props.modelValue === null || props.modelValue === undefined) ?
                '' :
                String(props.modelValue)
            )

            const setTextareaHeight = () => {
                const textareaHeight = calcTextareaHeight(textarea.value)

                if (textareaCalcStyle.height == textareaHeight.height) return
                copy(textareaCalcStyle, textareaHeight)
            }

            const setNativeInputValue = () => {
                const input = textarea.value
                if (!input || input.value === nativeInputValue.value) return
                input.value = nativeInputValue.value
            }

            watch(() => props.modelValue, (newValue) => {
                textarea.value.value = newValue
                setTextareaHeight()
            })

            watch(nativeInputValue, () => {
                setNativeInputValue()
            })

            onMounted(() => {
                setNativeInputValue()
                nextTick(setTextareaHeight)
            })

            const handleInput = (event) => {
                context.emit('input', event.target.value)
                context.emit('update:modelValue', event.target.value)

                nextTick(setNativeInputValue)
            }

            const handleChange = (event) => {
                context.emit('change', event.target.value)
            }

            const handleSelect = (emoji) => {
                context.emit('input', props.modelValue + emoji)
                context.emit('update:modelValue', props.modelValue + emoji)

                nextTick(setNativeInputValue)
            }

            const toggleEmoji = () => {
                showEmoji.value = !showEmoji.value
            }

            return {
                textarea,
                textareaCalcStyle,
                handleInput,
                handleChange,
                showEmoji,
                toggleEmoji,
                handleSelect
            }
        }
    }
</script>

<style lang="scss">
    @import '../../../style/value.scss';

    .chat-input {
        width: 100%;
        flex: 1;
        padding: 0.2rem 1rem 0;
        border-top: 1px solid #d1d1d1;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        .tool-bar {
            width: 8rem;
            display: flex;
            justify-content: space-around;

            .emoji-button,
            .video-button {
                border: none;
                outline: none;
                padding: 0;
                background-color: transparent;
            }

            i {
                font-size: 18px;
                padding: 7px;
                cursor: pointer;

                &:hover,
                &.active {
                    color: $icon-hover-color;
                }
            }
        }

        .bottom-bar {
            width: 100%;
            position: relative;

            textarea {
                width: 100%;
                font-size: 18px;
                resize: none;
                outline: none;
                border: 0;
                border-radius: 15px;
                padding: 8px 10px;
                background-color: transparent;
            }
        }
    }
</style>