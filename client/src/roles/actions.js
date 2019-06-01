export default [
    {
      name: '内容管理',
      id: 'CONTENT_MANAGEMENT',
      actions: [
        {
          name: '内容列表查看',
          id: 'CONTENT_INDEX',
          description: '内容列表查看'
        }, {
          name: '发布内容',
          id: 'CONTENT_CREATE',
          description: '发布内容'
        }, {
          
          name: '单页浏览',
          id: 'CONTENT_DETAIL',
          description: '单页浏览'
        }, {
          name: '编辑内容',
          id: 'CONTENT_UPDATE',
          description: '编辑内容'
        }, {
          name: '删除内容',
          id: 'CONTENT_DELETE',
          description: '删除内容'
        }
      ]
    }, {
      id: 'SORT_MANAGEMENT',
      name: '分类管理',
      actions: [
        {
          name: '分类访问',
          id: 'CATEGORY_INDEX',
          description: '分类访问'
        }, {
          name: '创建分类',
          id: 'CATEGORY_CREATE',
          description: '创建分类'
        }, {
          name: '查看分类信息',
          id: 'CATEGORY_DETAIL',
          description: '查看分类信息'
        }, {
          name: '编辑分类',
          id: 'CATEGORY_UPDATE',
          description: '编辑分类'
        }, {
          name: '删除分类',
          id: 'CATEGORY_DELETE',
          description: '删除分类'
        }
      ]
    }, {
      id: 'COMMENTS_MANAGEMENT',
      name: '评论管理',
      actions: [
        {
          name: '评论访问',
          id: 'COMMENT_INDEX',
          description: '评论访问'
        }, {
          name: '创建评论',
          id: 'COMMENT_CREATE',
          description: '创建评论'
        }, {
          name: '查看评论信息',
          id: 'COMMENT_DETAIL',
          description: '查看评论信息'
        }, {
          name: '编辑评论',
          id: 'COMMENT_UPDATE',
          description: '编辑评论'
        }, {
          name: '删除评论',
          id: 'COMMENT_DELETE',
          description: '删除评论'
        }
      ]
    }, {
      id: 'FILES_MANAGEMENT',
      name: '文件管理',
      actions: [
        {
          name: '文件访问',
          id: 'FILE_INDEX',
          description: '文件访问'
        }, {
          name: '上传文件',
          id: 'FILE_CREATE',
          description: '上传文件'
        }, {
          name: '查看文件信息',
          id: 'FILE_DETAIL',
          description: '查看文件信息'
        }, {
          name: '编辑文件',
          id: 'FILE_UPDATE',
          description: '编辑文件'
        }, {
          name: '删除文件',
          id: 'FILE_DELETE',
          description: '删除文件'
        }
      ]
    }, {
      id: 'INFORMATION_MANAGEMENT',
      name: '消息管理',
      actions: [
        {
          name: '消息访问',
          id: 'MESSAGE_INDEX',
          description: '消息访问'
        }, {
          name: '创建消息',
          id: 'MESSAGE_CREATE',
          description: '创建消息'
        }, {
          name: '查看消息',
          id: 'MESSAGE_DETAIL',
          description: '查看消息'
        }, {
          name: '编辑消息',
          id: 'MESSAGE_UPDATE',
          description: '编辑消息'
        }, {
          name: '删除消息',
          id: 'MESSAGE_DELETE',
          description: '删除消息'
        }
      ]
    }, {
      id: 'NOTIFICATION_MANAGEMENT',
      name: '通知管理',
      actions: [
        {
          name: '通知访问',
          id: 'NOTIFICATION_INDEX',
          description: '通知访问'
        }, {
          name: '创建通知',
          id: 'NOTIFICATION_CREATE',
          description: '创建通知'
        }, {
          name: '查看通知信息',
          id: 'NOTIFICATION_DETAIL',
          description: '查看通知信息'
        }, {
          name: '编辑通知',
          id: 'NOTIFICATION_UPDATE',
          description: '编辑通知'
        }, {
          name: '删除通知',
          id: 'NOTIFICATION_DELETE',
          description: '删除通知'
        }
      ]
    }, {
      id: 'PAGS_MANAGEMENT',
      name: '页面管理',
      actions: [
        {
          name: '页面访问',
          id: 'PAGE_INDEX',
          description: '页面访问'
        }, {
          name: '创建页面',
          id: 'PAGE_CREATE',
          description: '创建页面'
        }, {
          name: '查看页面信息',
          id: 'PAGE_DETAIL',
          description: '查看页面信息'
        }, {
          name: '编辑页面',
          id: 'PAGE_UPDATE',
          description: '编辑页面'
        }, {
          name: '删除页面',
          id: 'PAGE_DELETE',
          description: '删除页面'
        }
      ]
    }, {
      id: 'TAGS_MANAGEMENT',
      name: '标签管理',
      actions: [
        {
          name: '标签访问',
          id: 'TAG_INDEX',
          description: '标签访问'
        }, {
          name: '创建标签',
          id: 'TAG_CREATE',
          description: '创建标签'
        }, {
          name: '查看标签信息',
          id: 'TAG_DETAIL',
          description: '查看标签信息'
        }, {
          name: '编辑标签',
          id: 'TAG_UPDATE',
          description: '编辑标签'
        }, {
          name: '删除标签',
          id: 'TAG_DELETE',
          description: '删除标签'
        }
      ]
    }, {
      id: 'ROLE_MANAGEMENT',
      name: '角色管理',
      actions: [
        {
          name: '角色访问',
          id: 'ROLE_INDEX',
          description: '角色访问'
        }, {
          name: '创建角色',
          id: 'ROLE_CREATE',
          description: '创建角色'
        }, {
          name: '查看角色信息',
          id: 'ROLE_DETAIL',
          description: '查看角色信息'
        }, {
          name: '编辑角色',
          id: 'ROLE_UPDATE',
          description: '编辑角色'
        }, {
          name: '删除角色',
          id: 'ROLE_DELETE',
          description: '删除角色'
        }
      ]
    }, {
      id: 'USERS_MANAGEMENT',
      name: '用户管理',
      actions: [
        {
          name: '用户访问',
          id: 'USER_INDEX',
          description: '用户访问'
        }, {
          name: '创建用户',
          id: 'USER_CREATE',
          description: '创建用户'
        }, {
          name: '查看用户信息',
          id: 'USER_DETAIL',
          description: '查看用户信息'
        }, {
          name: '编辑用户',
          id: 'USER_UPDATE',
          description: '编辑用户'
        }, {
          name: '删除用户',
          id: 'USER_DELETE',
          description: '删除用户'
        }
      ]
    }, {
      id: 'LOGS_MANAGEMENT',
      name: '日志管理',
      actions: [
        {
          name: '日志访问',
          id: 'LOG_INDEX',
          description: '日志访问'
        }, {
          name: '查看日志信息',
          id: 'LOG_DETAIL',
          description: '查看日志信息'
        }, {
          name: '删除日志',
          id: 'LOG_DELETE',
          description: '删除日志'
        }
      ]
    }
  ];
  