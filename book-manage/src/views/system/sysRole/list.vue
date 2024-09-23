<template>
    <div class="app-container">
        <!--查询表单-->
        <div class="search-div">
            <el-form label-width="70px" size="small">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="角色名称">
                            <el-input style="width: 100%" v-model="searchObj.roleName" placeholder="角色名称"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row style="display:flex">
                    <el-button type="primary" icon="el-icon-search" size="mini" :loading="loading"
                        @click="fetchData()">搜索</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetData">重置</el-button>
                    <el-button v-show="isAdmin" type="success" icon="el-icon-plus" size="mini" @click="add">添 加</el-button>
                </el-row>
            </el-form>
        </div>


        <!-- 表格 -->
        <el-table v-loading="listLoading" :data="list" stripe border style="width: 100%;margin-top: 10px;"
            @selection-change="handleSelectionChange">

            <el-table-column type="selection" />

            <el-table-column label="序号" width="70" align="center">
                <template slot-scope="scope">
                    {{ (page - 1) * limit + scope.$index + 1 }}
                </template>
            </el-table-column>

            <el-table-column prop="roleName" label="角色名称" />
            <el-table-column prop="roleCode" label="角色编码" />
            <el-table-column prop="createTime" label="创建时间" width="160"/>
            <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
                    <el-button v-show="isAdmin" type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row.id)" title="修改" />
                    <el-button v-show="isAdmin" type="danger" icon="el-icon-delete" size="mini" @click="removeDataById((page - 1) * limit + scope.$index + 1)"
                        title="删除" />
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页组件 -->
        <el-pagination :current-page="page" :total="total" :page-size="limit"
            style="padding: 30px 0; text-align: center;" layout="total, prev, pager, next, jumper"
            @current-change="fetchData" />

        <el-dialog title="添加/修改" :visible.sync="dialogVisible" width="40%" >
            <el-form ref="dataForm" :model="sysRole" label-width="150px" size="small" style="padding-right: 40px;">
                <el-form-item label="角色名称">
                    <el-input v-model="sysRole.roleName"/>
                </el-form-item>
                <el-form-item label="角色编码">
                    <el-input v-model="sysRole.roleCode"/>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false" size="small" icon="el-icon-refresh-right">取 消</el-button>
                <el-button type="primary" icon="el-icon-check" @click="saveOrUpdate()" size="small">确 定</el-button>
            </span>
        </el-dialog>    
    </div>
</template>


 <script>
  //引入定义接口js文件
  import api from '@/api/system/sysRole'
  export default {
    // 定义数据模型
    data() {
        return {
            listLoading:false,
            loading:false,
            list: [], // 列表
            total: 0, // 总记录数
            page: 1, // 页码
            limit: 3, // 每页记录数
            searchObj: {}, // 查询条件

            sysRole:{},//封装表单角色数据
            dialogVisible:false, //是否弹框
            multipleSelection: []// 批量删除选中的记录列表
        }
    },
    // 页面渲染成功后获取数据
    created() {
      this.fetchData()
    },
    computed: {
      isAdmin() {
        return this.$store.state.user.userRole === 'admin';
      }
    },
    // 定义方法
    methods: {
        fetchData(current = 1) {
            this.page = current
            // 调用api
            api.getRoleList(this.page, this.limit, this.searchObj).then(response => {
                //返回数据集合
                this.list = response.data.list
                //总记录数
                this.total = response.data.total
            })
        },
        // 重置表单
        resetData() {
            console.log('重置查询表单')
            this.searchObj = {}
            this.fetchData()
        },
        //点击添加弹出框
        add() {
            this.dialogVisible = true
        },
        //选择复选框，把复选框所在行内容传递
        handleSelectionChange(selection) {
            this.selections = selection
            console.log(this.selections)
        },
        removeDataById(id) {
            this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                //调用
                console.log(id);
                return api.removeById(id)
            }).then(response => {
                //刷新页面
                this.fetchData()
                //提示信息
                 this.$message.success(response.message || '删除成功')
            })
        },
        //添加或者修改
        saveOrUpdate() {
            //根据id判断
            if (!this.sysRole.id) {//添加
                this.save()
            } else {//修改
                this.update()
            }
        },
        save() { //添加
            api.saveRole(this.sysRole)
                .then(response => {
                    //提示
                    this.$message.success(response.message || '操作成功')
                    //关闭弹框
                    this.dialogVisible = false
                    //刷新页面
                    this.fetchData()
                })
        },
        update() { //修改
            api.updateById(this.sysRole)
                .then(response => {
                    //提示
                    this.$message.success(response.message || '操作成功')
                    //关闭弹框
                    this.dialogVisible = false
                    //刷新页面
                    this.fetchData()
                })
        },
    }
  }
</script>