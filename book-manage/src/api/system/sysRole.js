import request from '@/utils/request'

const api_name = '/sysRole'

export default{
    //角色列表-条件分页查询
    getRoleList(current,limit,searchObj){
        return request({
            url: `${api_name}/${current}/${limit}`,
            method: 'get',
            params:searchObj
          })

    },
    //角色删除
    removeById(id) {
        return request({
          url: `${api_name}/remove/${id}`,
          method: 'delete'
        })
    },
    //角色添加
    saveRole(role) {
        return request({
            url: `${api_name}/save`,
            method: 'post',
            data:role
        })
    },
    //根据id查询
    getById(id) {
        return request({
          url: `${api_name}/get/${id}`,
          method: 'get'
        })
    },
    //修改  
    updateById(role) {
        return request({
            url: `${api_name}/updateById`,
            method: 'put',
            data: role
        })
    },
    //批量删除
    batchRemove(idList) {
        return request({
            url: `${api_name}/batchRemove`,
            method: 'delete',
            data: idList
        })
    },
}
