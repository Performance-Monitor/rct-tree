import TreeConstructor from './treeConctructor'

/**
 * @description rct-tree 组件向外暴露的参数
 */
export interface ITreeParams {
  //  树形数据
  treeData: ITreeNodeParams[]
  //  节点的高度
  rowHeight: number
  //  树的可视高度，设置该属性表示使用虚拟渲染
  height?: number
  //  是否显示checkbox多选框
  showCheckBox?: boolean
  //  是否显示图标
  showIcon?: boolean
  //  传入的自定义icon图标
  icon?: IIcon
  //  是否自动展开所有节点
  autoExpandAll?: boolean
  //  是否自动收起所有节点
  autoCollapseAll?: boolean
  //  treeData 数据为空时的文字提示
  placeholder?: string
  //  单选/多选
  multiple?: boolean
  //  点击节点时触发
  onSelect?: (nodes: ITreeNodeParams[]) => void
  //  点击checkbox时触发
  onCheck?: (nodes: ITreeNodeParams[]) => void
  //  展开和收起子列表时触发
  onToggleExpand?: (nodes: ITreeNodeParams) => void
}

/**
 * @description TreeNode 树节点向外暴露的参数
 */
export interface ITreeNodeParams {
  //  当前节点的id
  id?: number
  //  当前节点的父节点的id，最外层数据的id号为 -1
  parent_id?: number
  //  当前节点的标题
  title?: string
  //  当前节点所在层级
  index?: number
  //  当前节点是否展开
  expand?: boolean
  //  当前节点是否被选中
  selected?: boolean
  //  当前节点的多选框是否被选中
  checked?: boolean
  //  当前节点是否为半选状态
  halfChecked?: boolean
  //  当前节点是否为禁用状态
  disabled?: boolean
  //  当前节点是否被隐藏
  hide?: boolean
  //  是否显示当前节点的checkbox
  showCheckBox?: boolean
  //  是否显示当前节点的icon
  showIcon?: boolean
  //  传入的自定义icon图标
  icon?: IIcon
  //  当前节点
  currentNode?: ITreeNodeParams
  //  当前节点的子节点
  children?: ITreeNodeParams[]
  //  展开和收起子列表时触发
  onToggleExpand?: (id: number) => void
  //  在当前节点下创建子节点时触发
  onSelect?: (id: number) => void
  //  点击checkbox时触发
  onCheck?: (id: number) => void
  //  当前节点是否为叶子节点
  checkLeaf?: (id: number) => boolean
}

/**
 * @description 传入的自定义icon图标
 */
export interface IIcon {
  //  非叶子节点的icon
  parent: React.ReactNode
  //  叶子节点的icon
  leaf: React.ReactNode
}