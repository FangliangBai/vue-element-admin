import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '平台看板', icon: 'el-icon-s-marketing', affix: true }
      }
    ]
  },
  // {
  //   path: '/documentation',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/documentation/index'),
  //       name: 'Documentation',
  //       meta: { title: 'Documentation', icon: 'documentation', affix: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/guide',
  //   component: Layout,
  //   redirect: '/guide/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/guide/index'),
  //       name: 'Guide',
  //       meta: { title: 'Guide', icon: 'guide', noCache: true }
  //     }
  //   ]
  // },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [

  /**
   * Example Routes
   */
  // {
  //   path: '/book',
  //   name: 'book',
  //   component: Layout,
  //   redirect: '/book/create',
  //   meta: { title: '图书管理', icon: 'documentation' },
  //   children: [
  //     {
  //       path: '/book/create',
  //       name: 'bookCreate',
  //       component: () => import('@/views/book/create'),
  //       meta: { title: '添加图书', icon: 'edit', roles: ['admin'] }
  //     },
  //     {
  //       path: '/book/manage',
  //       name: 'bookManage',
  //       component: () => import('@/views/book/manage'),
  //       meta: { title: '管理图书', icon: 'edit', roles: ['admin'] }
  //     }
  //   ]
  // },

  /**
   * AutoCC Routes
   */

  /**
   * 员工管理
   */
  {
    name: 'admin-user',
    path: '/admin-user',
    component: Layout,
    redirect: '/admin-user/create',
    meta: { title: '员工管理', icon: 'el-icon-user-solid', roles: ['admin'] },
    children: [
      {
        name: 'AdminUserList',
        path: '/admin-user/list',
        component: () => import('@/views/admin-user/list'),
        meta: { title: '平台管理员', icon: 'list', roles: ['admin'], noCache: true }
      },
      {
        name: 'CreateAdminUser',
        path: '/admin-user/create',
        component: () => import('@/views/admin-user/create'),
        hidden: true,
        meta: { title: '新增管理员', icon: 'edit', roles: ['admin'] }
      },
      {
        name: 'EditAdminUser',
        path: '/admin-user/edit/:admin_id',
        component: () => import('@/views/admin-user/edit'),
        hidden: true,
        meta: { title: '更新管理员', icon: 'edit', roles: ['admin'] }
      },
      // 维修员 相关路径
      {
        name: 'MaintainerList',
        path: '/admin-user/maintainer-list',
        component: () => import('@/views/admin-user/maintainer-list'),
        meta: { title: '设备维修人', icon: 'list', roles: ['admin'], noCache: true }
      },
      {
        name: 'MaintainerCreate',
        path: '/admin-user/maintainer-create',
        component: () => import('@/views/admin-user/maintainer-create'),
        hidden: true,
        meta: { title: '维修员添加', icon: 'edit', roles: ['admin'] }
      },
      {
        name: 'MaintainerEdit',
        path: '/admin-user/maintainer-edit/:maintainer_uid',
        component: () => import('@/views/admin-user/maintainer-edit'),
        hidden: true,
        meta: { title: '维修员编辑', icon: 'edit', roles: ['admin'] }
      },
      // 负责人 相关路径
      {
        name: 'ManagerList',
        path: '/admin-user/manager-list',
        component: () => import('@/views/admin-user/manager-list'),
        meta: { title: '网点负责人', icon: 'list', roles: ['admin'], noCache: true }
      },
      {
        name: 'ManagerCreate',
        path: '/admin-user/manager-create',
        component: () => import('@/views/admin-user/manager-create'),
        hidden: true,
        meta: { title: '负责人添加', icon: 'edit', roles: ['admin'] }
      },
      {
        name: 'ManagerEdit',
        path: '/admin-user/manager-edit/:manager_uid',
        component: () => import('@/views/admin-user/manager-edit'),
        hidden: true,
        meta: { title: '负责人编辑', icon: 'edit', roles: ['admin'] }
      }
    ]
  },

  /**
   * 洗车机管理
   */
  {
    name: 'machine',
    path: '/machine',
    component: Layout,
    redirect: '/machine/list',
    meta: { title: '设备管理', icon: 'component', roles: ['admin', 'editor'] },
    children: [
      {
        name: 'CreateMachine',
        path: '/machine/create',
        component: () => import('@/views/machine/create'),
        meta: { title: '新增设备', icon: 'edit', roles: ['admin'] }
      },
      {
        name: 'EditMachine',
        path: '/machine/edit/:machine_uid',
        component: () => import('@/views/machine/edit'),
        hidden: true,
        meta: { title: '洗车机更新', icon: 'edit', roles: ['admin'] }
      },
      {
        name: 'MachineList',
        path: '/machine/list',
        component: () => import('@/views/machine/list'),
        meta: { title: '设备列表', icon: 'component', roles: ['admin', 'editor'], noCache: true }
      }
    ]
  },

  /**
   * 洗车网点管理
   */
  {
    name: 'branch',
    path: '/branch',
    component: Layout,
    redirect: '/branch/create',
    meta: { title: '网点管理', icon: 'tree', roles: ['admin', 'editor'] },
    children: [
      {
        name: 'CreateBranch',
        path: '/branch/create',
        component: () => import('@/views/branch/create'),
        meta: { title: '新增网点', icon: 'edit', roles: ['admin'] }
      },
      {
        name: 'EditBranch',
        path: '/branch/edit/:branch_uid',
        component: () => import('@/views/branch/edit'),
        hidden: true,
        meta: { title: '网点更新', icon: 'edit', roles: ['admin'] }
      },
      {
        name: 'BranchList',
        path: '/branch/list',
        component: () => import('@/views/branch/list'),
        meta: { title: '网点列表', icon: 'tree', roles: ['admin', 'editor'], noCache: true }
      },
      {
        name: 'BatchSetting',
        path: '/branch/batchSetting',
        component: () => import('@/views/branch/batchSetting'),
        meta: { title: '网点批设定', icon: 'el-icon-setting', roles: ['admin', 'editor'], noCache: true }
      }
    ]
  },

  // 财务管理
  {
    name: 'finance',
    path: '/finance',
    component: Layout,
    redirect: 'finance/list',
    meta: { title: '财务管理', icon: 'money', roles: ['admin', 'editor'] },
    children: [
      /**
       * 维修费用
       */
      {
        name: 'MaintainList',
        path: '/finance/maintain-list',
        component: () => import('@/views/finance/maintain-list'),
        meta: { title: '维修费用', icon: 'el-icon-s-open', roles: ['admin', 'editor'], noCache: true }
      },
      {
        name: 'MaintainCreate',
        path: '/finance/maintain-create',
        component: () => import('@/views/finance/maintain-create'),
        hidden: true,
        meta: { title: '新增维修支出', icon: 'edit', roles: ['admin'] }
      },
      {
        name: 'MaintainEdit',
        path: '/finance/maintain-edit/:maintain_uid',
        component: () => import('@/views/finance/maintain-edit'),
        hidden: true,
        meta: { title: '更新维修支出', icon: 'edit', roles: ['admin'] }
      },
      /**
       * 运营费用
       */
      {
        name: 'OperationList',
        path: '/finance/operation-list',
        component: () => import('@/views/finance/operation-list'),
        meta: { title: '运营费用', icon: 'el-icon-s-shop', roles: ['admin', 'editor'], noCache: true }
      },
      {
        name: 'OperationCreate',
        path: '/finance/operation-create',
        component: () => import('@/views/finance/operation-create'),
        hidden: true,
        meta: { title: '新增运营支出', icon: 'edit', roles: ['admin'] }
      },
      {
        name: 'OperationEdit',
        path: '/finance/operation-edit/:operation_uid',
        component: () => import('@/views/finance/operation-edit'),
        hidden: true,
        meta: { title: '更新运营支出', icon: 'edit', roles: ['admin'] }
      },
      /**
       * 价目表
       */
      {
        name: 'TariffEdit',
        path: '/finance/tariff-edit',
        component: () => import('@/views/finance/tariff-edit'),
        meta: { title: '服务单价', icon: 'el-icon-info', roles: ['admin'] }
      },
      // 充值表
      {
        name: 'TopupTariffEdit',
        path: '/finance/topup-tariff',
        component: () => import('@/views/finance/topup-tariff'),
        meta: { title: '充值定价', icon: 'el-icon-money', roles: ['admin'] }
      },
      // 客户信息
      {
        name: 'CustomerList',
        path: '/finance/customer-list',
        component: () => import('@/views/finance/customer-list'),
        meta: { title: '客户明细', icon: 'peoples', roles: ['admin', 'editor'], noCache: true }
      },
      /**
       * 运营统计
       */
      {
        name: 'WashedOrderList',
        path: '/finance/washed-order-list',
        component: () => import('@/views/finance/washed-order-list'),
        meta: { title: '消费统计', icon: 'shopping', roles: ['admin', 'editor'], noCache: true }
      },
      {
        name: 'TopupOrderList',
        path: '/finance/topup-order-list',
        component: () => import('@/views/finance/topup-order-list'),
        meta: { title: '充值统计', icon: 'el-icon-s-finance', roles: ['admin', 'editor'], noCache: true }
      }
    ]
  },

  /**
   * 订单管理
   * 用于查看订单明细
   * 包含: 充值订单, 退款订单, 洗车订单
   */
  {
    name: 'OrderManage',
    path: '/order-manage',
    component: Layout,
    meta: { title: '订单管理', icon: 'el-icon-s-order', roles: ['admin', 'editor'] },
    children: [
      // 充值订单
      {
        name: 'OrderTopup',
        path: '/order-manage/order-topup',
        component: () => import('@/views/order-manage/order-topup'),
        meta: { title: '充值订单', icon: 'el-icon-s-finance', roles: ['admin'], noCache: true }
      },
      // 退款订单
      {
        name: 'OrderRefund',
        path: '/order-manage/order-refund',
        component: () => import('@/views/order-manage/order-refund'),
        meta: { title: '退款订单', icon: 'el-icon-s-finance', roles: ['admin', 'editor'], noCache: true }
      },
      // 洗车订单
      {
        name: 'OrderWashed',
        path: '/order-manage/order-washed',
        component: () => import('@/views/order-manage/order-washed'),
        meta: { title: '洗车订单', icon: 'el-icon-s-claim', roles: ['admin', 'editor'], noCache: true }
      }
    ]
  },

  // 用户管理
  {
    name: 'CustomerManage',
    path: '/customer-manage',
    component: Layout,
    meta: { title: '用户管理', icon: 'el-icon-money', roles: ['admin', 'manual-topup'] },
    children: [
      // 非管理员添加手动充值记录
      {
        name: 'ManualTopupCreate',
        path: '/customer-manage/manual-topup-create',
        component: () => import('@/views/customer-manage/manual-topup-create'),
        meta: { title: '人工充值', icon: 'el-icon-circle-plus-outline', roles: ['manual-topup'], noCache: true }
      },
      // 手动充值记录
      {
        name: 'ManualTopup',
        path: '/customer-manage/manual-topup',
        component: () => import('@/views/customer-manage/manual-topup'),
        meta: { title: '充值记录', icon: 'el-icon-s-claim', roles: ['admin'], noCache: true }
      },
      // 审批手动充值记录
      {
        name: 'ManualTopupApproval',
        path: '/customer-manage/manual-topup-approval',
        component: () => import('@/views/customer-manage/manual-topup-approval'),
        meta: { title: '充值审批', icon: 'el-icon-s-check', roles: ['admin'], noCache: true }
      },
      {
        name: 'HwdTransfer',
        path: '/customer-manage/hwd-transfer',
        component: () => import('@/views/customer-manage/hwd-transfer'),
        meta: { title: '用户迁移', icon: 'el-icon-document-copy', roles: ['admin'], noCache: true }
      }
    ]
  },

  // 大屏展示
  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'http://49.233.11.217/big-screen/',
        meta: { title: '智慧大屏', icon: 'el-icon-data-line', roles: ['admin', 'editor'] }
      }
    ]
  },

  /**
   * Default Routes
   */

  // {
  //   path: '/permission',
  //   component: Layout,
  //   redirect: '/permission/page',
  //   alwaysShow: true, // will always show the root menu
  //   name: 'Permission',
  //   meta: {
  //     title: 'Permission',
  //     icon: 'lock',
  //     roles: ['admin', 'editor'] // you can set roles in root nav
  //   },
  //   children: [
  //     {
  //       path: 'page',
  //       component: () => import('@/views/permission/page'),
  //       name: 'PagePermission',
  //       meta: {
  //         title: 'Page Permission',
  //         roles: ['admin'] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path: 'directive',
  //       component: () => import('@/views/permission/directive'),
  //       name: 'DirectivePermission',
  //       meta: {
  //         title: 'Directive Permission'
  //         // if do not set roles, means: this page does not require permission
  //       }
  //     },
  //     {
  //       path: 'role',
  //       component: () => import('@/views/permission/role'),
  //       name: 'RolePermission',
  //       meta: {
  //         title: 'Role Permission',
  //         roles: ['admin']
  //       }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/icon',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/icons/index'),
  //       name: 'Icons',
  //       meta: { title: 'Icons', icon: 'icon', noCache: true }
  //     }
  //   ]
  // },
  //
  // /** when your routing map is too long, you can split it into small modules **/
  // componentsRouter,
  // chartsRouter,
  // nestedRouter,
  // tableRouter,
  //
  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/list',
  //   name: 'Example',
  //   meta: {
  //     title: 'Example',
  //     icon: 'el-icon-s-help'
  //   },
  //   children: [
  //     {
  //       path: 'create',
  //       component: () => import('@/views/example/create'),
  //       name: 'CreateArticle',
  //       meta: { title: 'Create Article', icon: 'edit' }
  //     },
  //     {
  //       path: 'edit/:id(\\d+)',
  //       component: () => import('@/views/example/edit'),
  //       name: 'EditArticle',
  //       meta: { title: 'Edit Article', noCache: true, activeMenu: '/example/list' },
  //       hidden: true
  //     },
  //     {
  //       path: 'list',
  //       component: () => import('@/views/example/list'),
  //       name: 'ArticleList',
  //       meta: { title: 'Article List', icon: 'list' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/tab',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/tab/index'),
  //       name: 'Tab',
  //       meta: { title: 'Tab', icon: 'tab' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/error',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   name: 'ErrorPages',
  //   meta: {
  //     title: 'Error Pages',
  //     icon: '404'
  //   },
  //   children: [
  //     {
  //       path: '401',
  //       component: () => import('@/views/error-page/401'),
  //       name: 'Page401',
  //       meta: { title: '401', noCache: true }
  //     },
  //     {
  //       path: '404',
  //       component: () => import('@/views/error-page/404'),
  //       name: 'Page404',
  //       meta: { title: '404', noCache: true }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/error-log',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'log',
  //       component: () => import('@/views/error-log/index'),
  //       name: 'ErrorLog',
  //       meta: { title: 'Error Log', icon: 'bug' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/excel',
  //   component: Layout,
  //   redirect: '/excel/export-excel',
  //   name: 'Excel',
  //   meta: {
  //     title: 'Excel',
  //     icon: 'excel'
  //   },
  //   children: [
  //     {
  //       path: 'export-excel',
  //       component: () => import('@/views/excel/export-excel'),
  //       name: 'ExportExcel',
  //       meta: { title: 'Export Excel' }
  //     },
  //     {
  //       path: 'export-selected-excel',
  //       component: () => import('@/views/excel/select-excel'),
  //       name: 'SelectExcel',
  //       meta: { title: 'Export Selected' }
  //     },
  //     {
  //       path: 'export-merge-header',
  //       component: () => import('@/views/excel/merge-header'),
  //       name: 'MergeHeader',
  //       meta: { title: 'Merge Header' }
  //     },
  //     {
  //       path: 'upload-excel',
  //       component: () => import('@/views/excel/upload-excel'),
  //       name: 'UploadExcel',
  //       meta: { title: 'Upload Excel' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/zip',
  //   component: Layout,
  //   redirect: '/zip/download',
  //   alwaysShow: true,
  //   name: 'Zip',
  //   meta: { title: 'Zip', icon: 'zip' },
  //   children: [
  //     {
  //       path: 'download',
  //       component: () => import('@/views/zip/index'),
  //       name: 'ExportZip',
  //       meta: { title: 'Export Zip' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/pdf',
  //   component: Layout,
  //   redirect: '/pdf/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/pdf/index'),
  //       name: 'PDF',
  //       meta: { title: 'PDF', icon: 'pdf' }
  //     }
  //   ]
  // },
  // {
  //   path: '/pdf/download',
  //   component: () => import('@/views/pdf/download'),
  //   hidden: true
  // },
  //
  // {
  //   path: '/theme',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/theme/index'),
  //       name: 'Theme',
  //       meta: { title: 'Theme', icon: 'theme' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/clipboard',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/clipboard/index'),
  //       name: 'ClipboardDemo',
  //       meta: { title: 'Clipboard', icon: 'clipboard' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://github.com/PanJiaChen/vue-element-admin',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
