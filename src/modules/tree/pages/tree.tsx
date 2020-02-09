import * as React from 'react'
import TreeNode from './treeNode'
import TreeConstructor from '../lib/treeConctructor'
import { ITreeParams, ITreeNodeParams } from '../lib/type'
import '../style/tree.less'

interface ITreeState {
    treeConstructor: TreeConstructor
}

/**
 * @description Tree Tree 表示 Tree 组件，用户直接使用的组件是 Tree 组件
 * @author jazzyXie
 */
export default class Tree extends React.Component<ITreeParams, ITreeState>{
    constructor(props: ITreeParams) {
        super(props)
        this.state = this.init(props)
    }
    public init = (props: ITreeParams) => {
        return {
            treeConstructor: new TreeConstructor(props.treeData)
        }
    }
    public UNSAFE_componentWillMount = () => {
        this.preProcessBeforeRebuild()      //  willMount 对 flatData 数据进行预处理的配置，比如 自动展开所有，只调用一次
    }
    public render() {
        const { config, showCheckBox, placeholder, showIcon, icons, editable, creatable, removable } = this.props
        const { treeConstructor } = this.state
        const { flatData } = treeConstructor
        if (!flatData || flatData.length == 0) {
            const placeholderContent = placeholder ? placeholder : "暂无数据"
            return (
                <div styleName="tree-wrapper">
                    {placeholderContent}
                </div>
            )
        }
        const tree = treeConstructor.rebuildTree()
        return (
            <div styleName="tree-wrapper"
            >
                {
                    tree.map((currentNode: ITreeNodeParams) => {
                        const { id, treeConstructor } = currentNode
                        return (
                            
                            <TreeNode
                                key={`tree—node-${id}`}
                                treeConstructor={treeConstructor}
                                currentNode={currentNode}
                                config={config}
                                showCheckBox={showCheckBox}
                                showIcon={showIcon}
                                icons={icons}
                                editable={editable}
                                creatable={creatable}
                                removable={removable}
                                checkLeaf={this.judgeLeaf}
                                onCheck={this.changeCheck}
                                onSelect={this.changeSelect}
                                onToggleExpand={this.changeExpand}
                                onCreate={this.createNode}
                                onDelete={this.deleteNode}
                                onEdit={this.editNode}
                            />
                        )
                    })
                }
            </div >
        )
    }
    public preProcessBeforeRebuild = () => {
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
            if (arguments.length == 0 || arguments[0] === undefined) { selectedFlag = true }
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
            if (!nodeItem.checked) { nodeItem.halfChecked = false }
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
            if (arguments.length == 0 || arguments[0] === undefined) { checkedFlag = true }
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
        const { treeConstructor } = this.state
        const nodeItem: ITreeNodeParams = treeConstructor.getNodeByID(id)

        nodeItem.expand = !nodeItem.expand
        this.setState({
            treeConstructor
        })
        onToggleExpand && onToggleExpand(nodeItem)
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
     * @description 使用该方法等价于 
     * 1. 创建一个子节点
     * 2. 更新 flatData 数据
     * 3. 根据所更新的 flatData ，重新构建一棵树，交给视图去渲染
     */
    public createNode = (id: number) => {
        const { creatable, onCreate } = this.props
        const { treeConstructor } = this.state
        const { defaultNodeObj: childNode, currentNode } = treeConstructor.createChildNodeByID(id)
        this.setState({
            treeConstructor
        })
        creatable && onCreate && onCreate(childNode, currentNode)
    }
    /**
     * @description 使用该方法等价于 
     * 1. 删除当前所选中节点
     * 2. 更新 flatData 数据
     * 3. 根据所更新的 flatData ，重新构建一棵树，交给视图去渲染
     */
    public deleteNode = (id: number) => {
        const { removable, onRemove } = this.props
        const { treeConstructor } = this.state
        const { currentNode } = treeConstructor.removeNodeByID(id)
        this.setState({
            treeConstructor
        })
        removable && onRemove && onRemove(currentNode)
    }
    /**
     * @description 根据 id 编辑节点
     */
    public editNode = (id: number) => {
        const { editable, onEdit } = this.props
        const { treeConstructor } = this.state
        const currentNode = treeConstructor.getNodeByID(id)
        this.setState({
            treeConstructor
        })
        editable && onEdit && onEdit(currentNode)
    }
    /**
     * @description 根据 id 判断某个节点是否为叶子节点
     */
    public judgeLeaf = (id: number) => {
        const { treeConstructor } = this.state
        const { getNodeByID } = treeConstructor
        let isLeaf: boolean
        const currentNode = getNodeByID(id)
        if (currentNode && currentNode.children && currentNode.children.length) {
            isLeaf = true
        } else { isLeaf = false }
        return isLeaf
    }
}