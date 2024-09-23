import request from '@/utils/request'

const api_name = '/sysRole'

export default{
    //用户列表-条件分页查询
    getRoleList(current,limit,searchObj){
        return request({
            url: `${api_name}/${current}/${limit}`,
            method: 'get',
            params:searchObj
          })

    },
    removeById(id) {
        return request({
          url: `${api_name}/remove/${id}`,
          method: 'delete'
        })
    }
}
