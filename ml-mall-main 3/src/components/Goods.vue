<script setup>
const props = defineProps({
    dataItem: {
        type: Array,
        default: [],
        required: true,
    },
});
console.log('data item:', props.dataItem);
</script>

<template>
    <div class="good">
        <div class="good-header">
            <slot name="title">默认标题</slot>
        </div>
        <ul class="good-box">
            <router-link
                v-for="item in props.dataItem"
                :key="item.id"
                class="good-item"
                tag="li"
                :to="`/goods/${item.id}`">
                <div class="img_box">
                    <img
                        style="height: 100%; width: 100%"
                        :src="item.pic_url"
                        :alt="item.goodsName" />
                </div>
                <div class="good-desc">
                    <div class="title">{{ item.name }}</div>
                    <div class="price">
                        {{ item.price.toFixed(2) }}
                    </div>
                </div>
            </router-link>
        </ul>
    </div>
</template>

<style lang="scss" scoped>
.good {
    width: 100%;
    background: rgb(243, 243, 243);
    margin-bottom: 50px;
    .good-header {
        height: 50px;
        line-height: 50px;
        font-size: 16px;
        font-weight: 500;
        color: rgb(15, 196, 181);
        text-align: center;
    }
    .good-box {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-content: space-between;
        .good-item {
            width: 49%;
            background: white;
            margin: 2px 0;
            box-sizing: border-box;
            .img_box {
                width: 90%;
                height: 188px;
                margin: 10px auto;
                overflow: hidden;
            }
            .good-desc {
                text-align: center;
                .title {
                    font-size: 0.378rem;
                    color: #222333;
                    -webkit-line-clamp: 2;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    word-wrap: break-word;
                }
                .price {
                    font-size: 0.32rem;
                    color: #1baeae;
                    margin: 6px 0;
                }
            }
            img {
                width: 100%;
                height: auto;
            }
        }
    }
}
</style>
