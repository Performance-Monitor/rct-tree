import * as React from 'react'
import '../style/treeNode.less'
import { Common } from '../assets'

import { ITreeNodeParams } from '../lib/type'

const {
    //  展开/收缩图标
    Arrow,
    //  checkbox被选中的图标
    CheckBoxMarked,
    //  checkbox未被选中的图标                          
    CheckBoxUnmarked,
    //  checkbox被禁用且被选中的图标                          
    CheckBoxDisabledMarked,
    //  checkbox被禁用且未被选中的图标                  
    CheckBoxDisabledUnmarked,
    //  checkbox为半选状态的图标                
    CheckBoxHalfMarked,
    //  checkbox被禁用且为半选状态的图标                      
    CheckBoxDisabledHalfMarked
} = Common
/**
 * @description TreeNode TreeNode 表示某一个节点
 * @author jazzyXie
 */
export default class TreeNode extends React.Component<ITreeNodeParams>{
    constructor(props: ITreeNodeParams) {
        super(props)
    }
    public render() {
        const { currentNode, showIcon, title, selected, disabled } = this.props
        if (currentNode) {
            return (
                <div styleName="tree-node-wrapper">
                    {this.renderCollapse()}
                    {this.renderCheckBox()}
                    <div
                        styleName={`tree-node ${(selected || currentNode.selected) ? "tree-node-left-title" : ""} ${(disabled || currentNode.disabled) ? "tree-node-left-item-disabled" : ""}`}
                        onClick={this.handleSelect}
                    >
                        {showIcon ? this.renderIcon() : ""}
                        <span style={showIcon ? { paddingLeft: '.3rem' } : {}}>{(title || currentNode.title)}</span>
                    </div>
                </div>
            )
        }
    }
    /**
    * @description 向父组件传入 id ，交给父组件去操作节点展开/收缩
    */
    public renderCollapse = () => {
        const { currentNode, expand } = this.props
        if (currentNode && currentNode.children && currentNode.children.length) {
            return (
                <img
                    styleName={`${(expand || currentNode.expand) ? "arrow-down" : "arrow-right"}`}
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
                <div style={placeholder} />
            )
        }
    }
    /**
     * @description 控制 checkbox 的渲染
    */
    public renderCheckBox = () => {
        const {
            showCheckBox,
            currentNode,
            checked,
            disabled
        } = this.props
        if (showCheckBox && currentNode) {
            const { halfChecked } = currentNode
            let checkboxDisplayComponent, DisabledComponent, NotDisabledComponent, isEmpty, isDisabledEmpty
            isEmpty = halfChecked ? CheckBoxHalfMarked : CheckBoxUnmarked
            NotDisabledComponent = (checked || currentNode.checked) ? CheckBoxMarked : isEmpty
            isDisabledEmpty = halfChecked ? CheckBoxDisabledHalfMarked : CheckBoxDisabledUnmarked
            DisabledComponent = (checked || currentNode.checked) ? CheckBoxDisabledMarked : isDisabledEmpty
            checkboxDisplayComponent = (disabled || currentNode.disabled) ? DisabledComponent : NotDisabledComponent
            return (
                <img
                    styleName={`tree-node-left-checkbox tree-node-img ${(disabled || currentNode.disabled) ? "tree-node-left-checkbox-disabled" : ""}`}
                    src={checkboxDisplayComponent}
                    onClick={this.handleCheck}
                />
            )
        }
    }
    /**
     * @description 控制 icon 的渲染
    */
    private renderIcon() {
        const {
            showIcon,
            currentNode,
            icon,
            checkLeaf
        } = this.props
        if (showIcon && currentNode) {
            const { id } = currentNode
            //  展示图标
            if (showIcon) {
                // 遍历搜索图标库
                if (id && checkLeaf) {
                    // 传入的icon配置
                    if (icon) {
                        const { parent, leaf } = icon
                        if (checkLeaf(id)) {
                            return parent
                        } else if (!checkLeaf(id)) {
                            return leaf
                        }
                    } else {
                        // 默认配置
                        const parent = <span styleName="rct-icon-directory" />,
                            leaf = <span styleName="rct-icon-file" />
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
    private handleCollapse = () => {
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
    private handleCheck = () => {
        const { currentNode, onCheck } = this.props
        if (onCheck && currentNode) {
            const { id } = currentNode
            if (id) {
                onCheck(id)
            }
        }
    }
    private handleSelect = () => {
        const { currentNode, onSelect } = this.props
        if (onSelect && currentNode) {
            const { id } = currentNode
            if (id) {
                onSelect(id)
            }
        }
    }
}