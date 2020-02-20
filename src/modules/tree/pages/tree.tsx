import * as React from 'react'
import TreeNode from './treeNode'
import TreeConstructor from '../lib/treeConctructor'
import { ITreeParams, ITreeNodeParams } from '../lib/type'
import '../style/tree.less'

interface ITreeState {
  treeConstructor: TreeConstructor,
  visibleData: ITreeNodeParams[],
  startIndex?: number,
  endIndex?: number,
  scrollTop?: number,
}

const defaultProps = {
  rowHeight: 32
}

/**
 * @description Tree Tree 表示 Tree 组件，用户直接使用的组件是 Tree 组件
 * @author jazzyXie
 */
export default class Tree extends React.Component<ITreeParams, ITreeState> {
  private rctTree: any
  private treeNodes: any
  constructor(props: ITreeParams) {
    super(props)
    this.state = this.init(props)
  }
  public init = (props: ITreeParams) => {
    return {
      treeConstructor: new TreeConstructor(props.treeData),
      visibleData: [],
      startIndex: 0,
      endIndex: 0,
      scrollTop: 0
    }
  }
  public componentDidMount = () => {
    this.preProcessBeforeRebuild() //  willMount 对 flatData 数据进行预处理的配置，比如 自动展开所有，只调用一次
    this.updateVisibleData()
  }
  private onScroll = (e: any) => {
    if (e.target === this.rctTree) {
      this.handleScrollEvent(e.target)
    }
  }
  private handleScrollEvent = (target: any) => {
    const { scrollTop } = target
    let { scrollTop: SCROLLTOP } = this.state
    SCROLLTOP = scrollTop
    this.updateVisibleData(scrollTop)
  }
  private updateVisibleData = (scrollTop?: number) => {
    //  使用requestAnimationFrame改善触发onScroll事件活跃造成的闪烁问题
    requestAnimationFrame(() => {
      let { height, rowHeight } = this.props
      let { treeConstructor, visibleData: preData, startIndex: preStartIndex, endIndex: preEndIndex } = this.state
      const { flatData } = treeConstructor
      scrollTop = scrollTop || 0
      const visibleCount = Math.ceil((height) / (rowHeight || defaultProps.rowHeight))
      const startIndex = Math.floor(scrollTop / (rowHeight || defaultProps.rowHeight))
      const endIndex = startIndex + visibleCount
      //  过滤收缩被隐藏的数据
      let dataAfterFilter = flatData.filter((el: ITreeNodeParams) => {
        if (!el.hide) {
          return el
        }
      })
      const visibleData = dataAfterFilter.slice(startIndex, endIndex)
      if (visibleData === preData && startIndex === preStartIndex && endIndex === preEndIndex) {
        return
      }
      this.setState({
        visibleData,
        startIndex,
        endIndex
      })
      if (this.treeNodes) {
        this.treeNodes.style.webkitTransform = `translate3d(0, ${startIndex * (rowHeight || defaultProps.rowHeight)}px, 0)`
      }
    })

  }
  private getContentHeight = () => {
    let { rowHeight } = this.props
    let { treeConstructor } = this.state
    let { flatData } = treeConstructor
    let contentHeight = 0
    let dataAfterFilter = flatData.filter((el: ITreeNodeParams) => {
      if (!el.hide) {
        return el
      }
    })
    contentHeight = (rowHeight || defaultProps.rowHeight) * dataAfterFilter.length
    return contentHeight
  }
  private preProcessBeforeRebuild = () => {
    const { autoExpandAll, autoCollapseAll } = this.props
    const { treeConstructor } = this.state
    const { flatData } = treeConstructor
    //  自动展开所有节点
    if (autoExpandAll === true) {
      flatData.map((el: ITreeNodeParams) => {
        el.expand = true
      })
    }
    //  自动收起所有节点
    else if (autoCollapseAll === true) {
      flatData.map((el: ITreeNodeParams) => {
        el.expand = false
      })
    }
  }
  public changeSelect = (id: number) => {
    const { multiple } = this.props
    const { treeConstructor } = this.state
    const { getNodeByID, flatData } = treeConstructor
    if (multiple === true) {
      //  多选
      const treeNode = getNodeByID(id)
      treeNode.selected = !treeNode.selected
    } else {
      //  单选
      flatData.map((el: ITreeNodeParams) => {
        if (el.id == id) {
          el.selected = !el.selected
        } else {
          el.selected = false
        }
      })
    }
    this.setState({
      treeConstructor
    })
    this.getSelectedNodes()
  }

  /**
   * @description getSelectedNodes 获取 所有 selected 字段为 true/false 的数据
   */
  public getSelectedNodes(selectedFlag?: boolean) {
    const { onSelect } = this.props
    if (onSelect) {
      if (arguments.length == 0 || arguments[0] === undefined) {
        selectedFlag = true
      }
      const { treeConstructor } = this.state
      const allSelectedNodes = treeConstructor.getSelectedNodes(selectedFlag)
      onSelect(allSelectedNodes)
    }
  }
  /**
   * @description 使用该方法等价于
   * 1. 更改当前节点的 checkbox checked 状态
   * 2. 联动父节点以及子节点的变化
   * 3. 更新 flatData 数据
   * 4. 根据所更新的 flatData ，重新构建一棵树，交给视图去渲染
   */
  public changeCheck = (id: number) => {
    const { treeConstructor } = this.state
    const { getNodeByID, nodeLinkage } = treeConstructor
    const nodeItem: ITreeNodeParams = getNodeByID(id)
    if (!nodeItem.disabled) {
      // 当前节点未被禁用
      nodeItem.checked = !nodeItem.checked
      if (!nodeItem.checked) {
        nodeItem.halfChecked = false
      }
      nodeLinkage(nodeItem)
      this.setState({
        treeConstructor
      })
      this.getCheckedNodes()
    }
  }
  /**
   * @description getCheckedNodes 获取 所有 checked 字段为 true/false 的数据
   */
  public getCheckedNodes(checkedFlag?: boolean) {
    const { onCheck } = this.props
    if (onCheck) {
      if (arguments.length == 0 || arguments[0] === undefined) {
        checkedFlag = true
      }
      const { treeConstructor } = this.state
      const allCheckedNodes = treeConstructor.getCheckedNodes(checkedFlag)
      onCheck(allCheckedNodes)
    }
  }
  /**
   * @description 使用该方法等价于
   * 1. 展开/收缩当前节点的子节点
   * 2. 更新 flatData 数据
   * 3. 根据所更新的 flatData ，重新构建一棵树，交给视图去渲染
   */
  public changeExpand = (id: number) => {
    const { onToggleExpand } = this.props
    const { treeConstructor, scrollTop } = this.state
    let { getNodeByID, toggleLinkage } = treeConstructor
    const nodeItem: ITreeNodeParams = getNodeByID(id)
    nodeItem.expand = !nodeItem.expand
    const childList = toggleLinkage(nodeItem)
    if (!nodeItem.expand) {
      childList.map((childID: number) => {
        getNodeByID(childID).hide = true
      })
    } else {
      childList.map((childID: number) => {
        getNodeByID(childID).hide = false
      })
    }
    this.setState({
      treeConstructor
    })
    onToggleExpand && onToggleExpand(nodeItem)
    this.updateVisibleData(scrollTop)
  }
  /**
   * @description checkedAll 该方法将设置节点的 checked 字段 全为 true/false (全选/反选)，使用该方法等价于
   * 1. 设置全选/反选
   * 2. 更新 flatData
   * 3. 根据更新的 flatData ，重新构建一棵树，交给视图去渲染
   */
  public checkedAll(checkedFlag?: boolean) {
    const { treeConstructor } = this.state
    treeConstructor.checkedAll(checkedFlag)
    this.setState({
      treeConstructor
    })
  }
  /**
   * @description 根据 id 判断某个节点是否为叶子节点
   */
  private judgeLeaf = (id: number) => {
    const { treeConstructor } = this.state
    const { getNodeByID } = treeConstructor
    let isLeaf: boolean = false
    const currentNode = getNodeByID(id)
    if (currentNode && currentNode.children && currentNode.children.length) {
      isLeaf = true
    } else {
      isLeaf = false
    }
    return isLeaf
  }
  private judgeRoot(id: number) {
    const { treeConstructor } = this.state
    const { getNodeByID } = treeConstructor
    let isRoot: boolean = false
    const currentNode = getNodeByID(id)
    isRoot = currentNode.parent_id === -1 ? true : false
    return isRoot
  }
  public render() {
    const { showCheckBox, placeholder, showIcon, icon, rowHeight, height } = this.props
    const { treeConstructor, visibleData } = this.state
    const { flatData } = treeConstructor
    if (!flatData || flatData.length == 0) {
      const placeholderContent = placeholder ? placeholder : '暂无数据'
      return <div styleName="tree-wrapper">{placeholderContent}</div>
    }
    return (
      <div
        styleName="tree-wrapper"
        ref={ref => (this.rctTree = ref)}
        onScroll={this.onScroll.bind(this)}
        style={height ? { height } : {}}
      >
        <div style={{ height: this.getContentHeight() }}></div>
        <div ref={ref => (this.treeNodes = ref)} style={{ position: "absolute", top: 0 }}>
          {visibleData.map((node: ITreeNodeParams) => {
            const { id, index, hide } = node
            return (!hide &&
              <div style={index ? { paddingLeft: (rowHeight || defaultProps.rowHeight) / 2 * index, height: (rowHeight || defaultProps.rowHeight) } : { height: (rowHeight || defaultProps.rowHeight) }} key={`tree—node-${id}`}>
                <TreeNode
                  currentNode={node}
                  showCheckBox={showCheckBox}
                  showIcon={showIcon}
                  icon={icon}
                  checkLeaf={this.judgeLeaf}
                  checkRoot={this.judgeRoot}
                  onCheck={this.changeCheck}
                  onSelect={this.changeSelect}
                  onToggleExpand={this.changeExpand}
                ></TreeNode>
              </div>
            )
          })}
        </div>
      </div >
    )
  }
}