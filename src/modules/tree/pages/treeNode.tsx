import * as React from 'react'
import '../style/treeNode.less'
import { Common, Operation } from '../assets'

import { ITreeNodeParams } from '../lib/type'

const {
    Arrow,                                      //  展开/收缩图标
    CheckBoxMarked,                             //  checkbox 被选中的图标
    CheckBoxUnmarked,                           //  checkbox 未被选中的图标
    CheckBoxDisabledMarked,                     //  checkbox 被禁用且被选中的图标
    CheckBoxDisabledUnmarked,                   //  checkbox 被禁用且未被选中的图标
    CheckBoxHalfMarked,                        //  checkbox 为半选状态的图标
    CheckBoxDisabledHalfMarked
} = Common

const {
    Create,                                     //  新增图标
    Delete,                                     //  删除图标
    Edit                                        //  编辑图标
} = Operation

/**
 * @description TreeNode TreeNode 表示某一个节点
 * @author jazzyXie
 */
export default class TreeNode extends React.Component<ITreeNodeParams>{
    constructor(props: ITreeNodeParams) {
        super(props)
    }
    public render() {
        const { currentNode, showIcon, creatable, editable, removable } = this.props
        if (currentNode) {
            const { title, expand, selected, disabled } = currentNode
            return (
                <div>
                    <div styleName="tree-node-wrapper">
                        <div styleName="tree-node-left">
                            {this.renderCollapse()}
                            {this.renderCheckBox()}
                            <div
                                styleName={`tree-node ${selected ? "tree-node-left-title" : ""} ${disabled ? "tree-node-left-item-disabled" : ""}`}
                                onClick={this.handleSelect}
                            >
                                {showIcon ? this.renderIcon() : ""}
                                <span style={showIcon ? { paddingLeft: '.3rem' } : {}}>{title}</span>
                            </div>
                        </div>
                        <div styleName="tree-node-right">
                            {editable ? <img styleName="tree-node-img-editable" onClick={this.handleEdit} src={Edit} alt="edit" /> : ""}
                            {creatable ? <img styleName="tree-node-img-editable" onClick={this.handleCreate} src={Create} alt="create" /> : ""}
                            {removable ? <img styleName="tree-node-img-editable" onClick={this.handleDelete} src={Delete} alt="delete" /> : ""}
                        </div>
                    </div>
                    {expand ? this.renderChildNodes() : ""}
                </div>
            )
        }
    }
    public renderChildNodes = () => {
        const {
            currentNode,
            config,
            icons,
            editable,
            creatable,
            removable,
            checkLeaf,
            onToggleExpand,
            showCheckBox,
            showIcon,
            onCreate,
            onDelete,
            onEdit,
            onSelect,
            onCheck,
        } = this.props
        if (currentNode && currentNode.children && currentNode.children.length) {
            // 当节点有子节点时，传入子节点的布局配置
            const childrenNodeStyle = config ? config : { paddingLeft: '1rem' }
            return (
                <div
                    style={childrenNodeStyle}
                >
                    {
                        currentNode.children.map((child: ITreeNodeParams) => {
                            const { id } = child
                            return (
                                
                                <TreeNode
                                    key={`tree-node-${id}`}
                                    currentNode={child}
                                    config={config}
                                    icons={icons}
                                    editable={editable}
                                    creatable={creatable}
                                    removable={removable}
                                    checkLeaf={checkLeaf}
                                    onToggleExpand={onToggleExpand}
                                    showCheckBox={showCheckBox}
                                    showIcon={showIcon}
                                    onCreate={onCreate}
                                    onDelete={onDelete}
                                    onEdit={onEdit}
                                    onCheck={onCheck}
                                    onSelect={onSelect}
                                />
                            )
                        })
                    }
                </div>
            )
        }
    }
    /**
    * @description 向父组件传入 id ，交给父组件去操作节点展开/收缩
    */
    public renderCollapse = () => {
        const { currentNode } = this.props
        if (currentNode && currentNode.children && currentNode.children.length) {
            const { expand } = currentNode
            return (
                <img
                    styleName={`${expand ? "arrow-down" : "arrow-right"}`}
                    src={Arrow}
                    onClick={this.handleCollapse}
                />
            )
        } else {
            // 不存在子节点则返回一个占位元素代替arrow
            const placeholder = {
                height: '1rem',
                width: '1rem'
            }
            return (
                
                <div style={placeholder}/>
            )
        }
    }
    /**
     * @description 控制 checkbox 的渲染
    */
    public renderCheckBox = () => {
        const {
            showCheckBox,
            currentNode
        } = this.props
        if (showCheckBox && currentNode) {
            const { checked, disabled, halfChecked } = currentNode

            let checkboxDisplayComponent, DisabledComponent, NotDisabledComponent, isEmpty, isDisabledEmpty
            isEmpty = halfChecked ? CheckBoxHalfMarked : CheckBoxUnmarked
            NotDisabledComponent = checked ? CheckBoxMarked : isEmpty
            isDisabledEmpty = halfChecked ? CheckBoxDisabledHalfMarked : CheckBoxDisabledUnmarked
            DisabledComponent = checked ? CheckBoxDisabledMarked : isDisabledEmpty
            checkboxDisplayComponent = disabled ? DisabledComponent : NotDisabledComponent
            return (
                <img
                    styleName={`tree-node-left-checkbox tree-node-img ${disabled ? "tree-node-left-checkbox-disabled" : ""}`}
                    src={checkboxDisplayComponent}
                    onClick={this.handleCheck}
                />
            )
        }
    }
    /**
     * @description 控制 icon 的渲染
    */
    public renderIcon() {
        const {
            showIcon,
            currentNode,
            icons,
            checkLeaf
        } = this.props
        if (showIcon && currentNode) {
            const { id } = currentNode
            //  展示图标
            if (showIcon) {
                // 遍历搜索图标库
                if (id && checkLeaf) {
                    // 传入的icon配置
                    if (icons) {
                        const { parent, leaf } = icons
                        if (checkLeaf(id)) {
                            return parent
                        } else if (!checkLeaf(id)) {
                            return leaf
                        }
                    } else {
                        // 默认配置
                        const parent =  <span styleName="rct-icon-directory"/>,
                            leaf =  <span styleName="rct-icon-file"/>
                        if (checkLeaf(id)) {
                            return parent
                        } else if (!checkLeaf(id)) {
                            return leaf
                        }
                    }
                }
            }
        }
    }
    /**
     * @description 传递给父组件 Tree 去控制组件的展开/收缩
     */
    public handleCollapse = () => {
        const { currentNode, onToggleExpand } = this.props
        if (onToggleExpand && currentNode) {
            const { id } = currentNode
            if (id) {
                onToggleExpand(id)
            }
        }
    }
    /**
     * @description 传递给父组件 Tree 去修改 checkbox checked 的状态
     */
    public handleCheck = () => {
        const { currentNode, onCheck } = this.props
        if (onCheck && currentNode) {
            const { id } = currentNode
            if (id) {
                onCheck(id)
            }
        }
    }
    public handleSelect = () => {
        const { currentNode, onSelect } = this.props
        if (onSelect && currentNode) {
            const { id } = currentNode
            if (id) {
                onSelect(id)
            }
        }
    }
    /**
     * @description 传递给父组件 Tree 去编辑节点
     */
    public handleEdit = () => {
        const { currentNode, onEdit } = this.props
        if (onEdit && currentNode) {
            const { id } = currentNode
            if (id) {
                onEdit(id)
            }
        }
    }
    /**
     * @description 传递给父组件 Tree 去新增节点
     */
    public handleCreate = () => {
        const { currentNode, onCreate } = this.props
        if (onCreate && currentNode) {
            const { id } = currentNode
            if (id) {
                onCreate(id)
            }
        }
    }
    /**
     * @description 传递给父组件 Tree 去删除节点
     */
    public handleDelete = () => {
        const { currentNode, onDelete } = this.props
        if (onDelete && currentNode) {
            const { id } = currentNode
            if (id) {
                onDelete(id)
            }
        }
    }
}