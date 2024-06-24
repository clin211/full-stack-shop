<template>
  <div class="product-main">
    <el-form ref="form" class="add-product-form" :model="form" label-width="110px">
      <el-form-item label="产品图片">
        <el-input style="width: 50%;" v-model="form.pic_url" :disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item label="产品名称">
        <el-input style="width: 50%;" v-model="form.name" :disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item label="产品价格">
        <el-input style="width: 50%;" v-model="form.price" :disabled="disabled"></el-input>
      </el-form-item>

      <!--<el-form-item label="生产日期">
         <el-input style="width: 50%;" v-model="form.production_at" :disabled="disabled"></el-input>
       </el-form-item>
       <el-form-item label="保质期">
         <el-input style="width: 50%;" v-model="form.shelf_life" :disabled="disabled"></el-input>
       </el-form-item>-->

       <el-form-item label="生产日期">
         <el-input style="width: 50%;" v-model="form.brand" :disabled="disabled"></el-input>
       </el-form-item>
       <el-form-item label="产品分类">
         <el-cascader
           :disabled="disabled"
           style="width: 50%;"
           v-model="levelArr"
           :options="levelLists"
           @change="handleChange"></el-cascader>
         <!-- <el-select v-model="form.tags" placeholder="请选择商品分类" :disabled="disabled">
           <el-option label="方便面" value="shanghai"></el-option>
           <el-option label="泡面" value="beijing"></el-option>
             <el-option label="大骨面" value="beijing"></el-option>
         </el-select> -->
      </el-form-item>
      <el-form-item label="产品简介">
        <el-input type="textarea" style="width: 50%;" v-model="form.detail_info" :disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item label="保质期天数">
        <el-input v-model="form.stock" style="width: 50%;" :disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item label="产品注释">
        <el-input v-model="form.tags" style="width: 50%;" :disabled="disabled"></el-input>
      </el-form-item>
        <!-- 上传图片 -->
          <!-- <el-form-item class="albumPics" label="画册图片" size="small">
            <el-upload
              :action="uploadUrl"
              :headers="headers"
              :on-remove="handleRemove"
              :file-list="fileList"
              :on-success="imgUploadSuccess"
              :limit="5"
              :on-preview="handlePictureCardPreview"
              list-type="picture-card"
            >
              <i class="el-icon-plus" />
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb,文件不超过5个
              </div>
            </el-upload>
          </el-form-item> -->


      <!-- <el-form-item label="上架状态">
        <el-radio-group v-model="form.resource" :disabled="disabled">
          <el-radio label="上架"></el-radio>
          <el-radio label="下架"></el-radio>
        </el-radio-group>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" v-if="this.$route.query.type != 1" @click="onSubmit">提交</el-button>
        <el-button @click="close()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { comAdd, comDetail, comUpdate, levelList} from '@/api/api.js'
export default {
  name: "ProductDeati",
  components: {},
  data() {
    return {
      form: {
        pic_url: "",
        name: "",
        brand: "",
        jianjie: "",
        price: "",
        showprice: "",
        invent: [],
        resource: "",
        lable: "",
        detail_info: "",
        level1_category_id: '',
        level2_category_id: '',
        level3_category_id: ''
      },
      levelLists: [],
      levelArr: [],
      disabled: false
    };
  },
  mounted() {
    // this.getLevel()
  },
  created() {
    this.getLevel()
    if(this.$route.query.type === 0){
      this.details()
      // this.getLevel()

    } else if(this.$route.query.type === 1){
      this.disabled = true
      this.details()
      // this.getLevel()

    }
  },
  methods: {
    getLevel() {
      let params = {
        page: 1,
        limit: 10
      }
      levelList(params).then(res => {
        console.log('~~~~~~~~~~~~~~~~level list data~~~~~~~~~~~~~~~~~~~~~~~~~~~~:', res.data);
        if(res.data.list?.length <= 0) return;
        const newLevelLists = [...res.data.list];
        newLevelLists.map(item => {
          item.children = item.items
          item.label = item.name
          item.value = item.id
          if(!item.children || !(item.children instanceof  Array)){
            item.children = [];
          }
          item.children.map(i2 => {
            i2.children = i2.items
            i2.label = i2.name
            i2.value = i2.id
            if(i2.items) {
              if(!i2.children || !(i2.children instanceof  Array)){
                item.children = [];
              }
              i2.children.map(i3 => {
                i3.label = i3.name
                i3.value = i3.id
              })
            }
          })
        })

        console.log('遍历后的数据：', newLevelLists);
        this.levelLists = newLevelLists;
      })
    },
    handleChange(value) {
      console.log(value);
      this.form.level1_category_id = value[0]
      this.form.level2_category_id = value[1]
      this.form.level3_category_id = 1; //value[2]
    },
    onSubmit() {
      if(this.$route.query.type === 1) {
        this.edit()
      } else {
        let params = this.form
        comAdd(params).then( res => {
          if(res.code === 1){
            this.$message({
              message: '添加成功',
              type: 'success'
            })
          }
          this.$router.push({ name: 'productList' })
        })
      }
    },
    close() {
      this.$router.go(-1)
    },
    details() {
      let params = {
        id: this.$route.query.id
      }
      comDetail(params).then( res => {
        if(res.code === 1) {
          this.form = res.data
          this.levelArr.push(this.form.level1_category_id)
          this.levelArr.push(this.form.level2_category_id)
          this.levelArr.push(this.form.level3_category_id)
        }
      })
    },
    edit() {
      let params = this.form
      comUpdate().then( res => {
        if(res.code === 1){
          this.$message({
            message: '编辑成功',
            type: 'success'
          })
          this.$router.push({ name: 'productList' })
        }
      })
    },

     // 移除画册图片
        handleRemove(file, fileList) {
            this.fileList = this.fileList.filter(
                (item) => {
                    return item.url != file.url
                }
            )
        },
        // 点击画册图片，查看大图
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url
            this.dialogVisible = true
        },

        // 画册图片上传成功
        imgUploadSuccess(res, file) {
            if (res.success) {
                this.fileList.push({ url: res.data.fileUrl })
                this.$message.success('上传成功')
            } else {
                this.$message.error('上传失败')
            }
        },
  },
};
</script>

<style  scoped lang="scss">
.add-product-form{
    width: 98%;
    margin: 20px auto;

}
</style>
