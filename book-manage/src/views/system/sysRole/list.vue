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
                  <el-button type="primary" @click="openAddDialog">新增</el-button>

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
            <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
                    <el-button v-show="isAdmin" type="primary" icon="el-icon-edit" size="mini" @click="handleEdit(scope.row)" title="修改" />
                    <el-button v-show="isAdmin" type="danger" icon="el-icon-delete" size="mini" @click="removeDataById((page - 1) * limit + scope.$index + 1)"
                        title="删除" />
<!--                    <div v-show="isAdmin">暂无权限</div>-->
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页组件 -->
        <el-pagination :current-page="page" :total="total" :page-size="limit"
            style="padding: 30px 0; text-align: center;" layout="total, prev, pager, next, jumper"
            @current-change="fetchData" />

      <!-- 编辑角色的对话框 -->
      <el-dialog :visible.sync="editDialogVisible" title="编辑角色">
        <el-form :model="editForm" ref="editForm" label-width="120px">
          <!-- 角色名称输入框 -->
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="editForm.roleName" placeholder="请输入角色名称"></el-input>
          </el-form-item>

          <!-- 角色编码输入框 -->
          <el-form-item label="角色编码" prop="code">
            <el-input v-model="editForm.roleCode" placeholder="请输入角色编码"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEditForm">保存</el-button>
      </span>
      </el-dialog>

      <!-- 新增角色的对话框 -->
      <el-dialog :visible.sync="addDialogVisible" title="新增角色">
        <el-form :model="addForm" ref="addForm" label-width="120px">
          <!-- 角色名称输入框 -->
          <el-form-item label="角色名称" prop="roleName" :rules="[{ required: true, message: '请输入角色名称', trigger: 'blur' }]">
            <el-input v-model="addForm.roleName" placeholder="请输入角色名称"></el-input>
          </el-form-item>

          <!-- 角色编码输入框 -->
          <el-form-item label="角色编码" prop="roleCode" :rules="[{ required: true, message: '请输入角色编码', trigger: 'blur' }]">
            <el-input v-model="addForm.roleCode" placeholder="请输入角色编码"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAddForm">保存</el-button>
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
            limit: 1, // 每页记录数
            searchObj: {}, // 查询条件
            multipleSelection: [],// 批量删除选中的记录列表

          // 编辑对话框的显示状态
          editDialogVisible: false,
          // 当前正在编辑的角色
          editForm: {
            roleName: "",
            roleCode: ""
          },
          // 用于临时保存正在编辑的角色ID或索引
          editingRoleIndex: null,

          // 新增对话框的显示状态
          addDialogVisible: false,
          // 新增表单数据
          addForm: {
            roleName: "",
            roleCode: ""
          }

        }
    },
    computed: {
      isAdmin() {
        return this.$store.state.user.userRole === 'admin';
      }
    },
    // 页面渲染成功后获取数据
    created() {
      this.fetchData()
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
              let local = localStorage.getItem(`list-${this.$store.state.user.userRole}`)

              if(JSON.parse(local) && JSON.parse(local).length){
                this.list= JSON.parse(local);
              }
            })
        },
        // 重置表单
        resetData() {
            console.log('重置查询表单')
            this.searchObj = {}
            this.fetchData()
        },
        //选择复选框，把复选框所在行内容传递
        handleSelectionChange(selection) {
            this.selections = selection
            console.log(this.selections)
        },
      // 触发编辑操作
      handleEdit(role) {
        this.editingRoleIndex = this.list.findIndex(ele=>ele.roleCode == role.roleCode)
        this.editForm = { ...role }  // 复制被编辑的角色数据到 editForm
        this.editDialogVisible = true  // 打开编辑对话框
      },
      // 提交表单并保存修改
      submitEditForm() {
        // 表单验证通过后提交
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            if(this.editingRoleIndex>=0){
              this.$set(this.list, this.editingRoleIndex, { ...this.editForm });
              localStorage.setItem(`list-${this.$store.state.user.userRole}`,JSON.stringify(this.list))
              console.log('list=',this.list)
            }

            // 模拟提交修改操作
            this.$message({
              message: '角色信息已更新',
              type: 'success'
            })
            this.editDialogVisible = false  // 关闭对话框
          } else {
            console.log('表单验证失败')
            return false
          }
        })
      },
      // 打开新增角色对话框
      openAddDialog() {
        this.addForm = { roleName: "", roleCode: "" };  // 重置表单
        this.addDialogVisible = true;  // 显示新增对话框
      },
      // 提交新增表单
      submitAddForm() {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            // 添加新的角色到角色列表
            this.list.push({ ...this.addForm });
            localStorage.setItem(`list-${this.$store.state.user.userRole}`,JSON.stringify(this.list))
            this.$message({
              message: "角色添加成功",
              type: "success"
            });
            this.addDialogVisible = false;  // 关闭对话框
          } else {
            console.log("表单验证失败");
            return false;
          }
        });
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
        }
    }
  }
</script>
