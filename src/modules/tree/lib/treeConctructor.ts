import { ITreeNodeParams } from './type'

/**
 * @description class Tree 是一个 tree 内置的构造器，里面主要存一些操作 Tree 组件的工具类
 * @author jazzyXie
 */
class Tree {
    public flatData: ITreeNodeParams[] = []
    private idCounter: number = 0   //  记录历史上所存在的所有 id 数量
    constructor(treeData: ITreeNodeParams[]) {
        this.PreProcessTreeToFlat(treeData)
    }
    /**
     * @description processTreeData 用来预处理数据，将用户传进来的数据转换成扁平的一维数据
     * @param { ITreeNodeParams } treeData - 树形数据
     * @returns 没有返回值
    */
    public PreProcessTreeToFlat = (treeData: ITreeNodeParams[], parent_id?: number) => {
        treeData.map((el: ITreeNodeParams) => {
            el.id = ++this.idCounter    //  为每一项数据添加id号
            el.halfChecked = false      //  默认半选为 false ，halfChecked 触发的前置条件是 checked 为 false 
            el.selected = false         //  默认 title 不被选中，选中则置为 true
            if (parent_id) {
                el.parent_id = parent_id
            } else {
                el.parent_id = -1  //  最外层元素的parent_id为-1
            }
            this.flatData.push(el)
            if (el.children && el.children.length > 0) {
                this.PreProcessTreeToFlat(el.children, el.id)
            }
        })
    }
    /**
     * @description getNodeByID 根据节点的 id 查找节点
     * @param { number } id - 节点的id
     * @returns { ITreeNodeParams } node - filter 返回一个新的数组，这里取数组的下标值为 0 的第一项；
     * 当 id 为 -1 ，这种情况触发的情况是 parent_id 为 -1 ，不存在其父节点
    */
    public getNodeByID = (id: number) => {
        if (id === -1) { return {} }
        return this.flatData.filter((node: ITreeNodeParams, index: number) => {
            if (id == node.id) {
                return node
            }
        })[0]
    }
    /**
     * @description getSelectedNodes 获取所有选中的数据
     * @param { boolean } [selectedFlag] selected 字段为 true/false
     * @returns { ITreeNodeParams[] } [ el, el, el, ...] 根据参数 selectedFlag 返回 selected 字段为 true/false的数据，无传入参数，默认返回selected 字段为 true 的数据
     */
    public getSelectedNodes(selectedFlag?: boolean) {
        if (arguments.length == 0 || arguments[0] === undefined) { selectedFlag = true }
        if (selectedFlag === true) {
            return this.flatData.filter((el: ITreeNodeParams) => {
                return el.selected
            })
        } else if (selectedFlag === false) {
            return this.flatData.filter((el: ITreeNodeParams) => {
                return !el.selected
            })
        } else { throw new TypeError(`Function getSelectedNodes accepts param type boolean only ~`) }
    }
    /**
     * @description getCheckedNodes 获取所有选中的数据
     * @param { boolean } [checkedFlag] checked 字段为 true/false
     * @returns { ITreeNodeParams[] } [ el, el, el, ...] 根据参数 checkedFlag 返回 checked 字段为 true/false 的数据，无传入参数，默认返回 checked 字段为 true 的数据
     */
    public getCheckedNodes(checkedFlag?: boolean) {
        if (arguments.length == 0 || arguments[0] === undefined) { checkedFlag = true }
        if (checkedFlag === true) {
            return this.flatData.filter((el: ITreeNodeParams) => {
                return el.checked
            })
        } else if (checkedFlag === false) {
            return this.flatData.filter((el: ITreeNodeParams) => {
                return !el.checked
            })
        } else { throw new TypeError(`Function getCheckedNodes accepts param type boolean only ~`) }
    }
    public getExpandNodes(expandFlag?: boolean) {
        this.flatData.forEach((el: ITreeNodeParams) => {

        })
    }
    /**
     * @description checkedAll 该方法将设置节点的 checked 字段 全为 true/false (全选/反选)
     * @param { boolean } [checkedFlag]  checked 字段设置为 true/false
     */
    public checkedAll(checkedFlag?: boolean) {
        if (arguments.length == 0 || arguments[0] === undefined) { checkedFlag = true }
        if (checkedFlag === true) {
            this.flatData.map((el: ITreeNodeParams) => {
                el.checked = true
            })
        } else if (checkedFlag === false) {
            this.flatData.map((el: ITreeNodeParams) => {
                el.checked = false
            })
        } else { throw new TypeError(`Function checkedAll accepts param type boolean only ~`) }
    }
    /**
     * @description getIndexByID 根据节点的 id 查找节点
     * @param { number } id - 节点的id
     * @returns { number } idx 返回节点的索引 
     */
    public getIndexByID = (id: number) => {
        let idx = -1 // 下标初始值为-1
        this.flatData.forEach((item, index) => {
            if (item.id == id) {
                idx = index
            }
        })
        return idx
    }
    /**
     * @description createChildNodeByID 根据组件的 id 创建子节点
     * @param { number } id - 节点的id
     * @returns 没有返回值
    */
    public createChildNodeByID = (id: number) => {
        const currentNode = this.getNodeByID(id)
        const defaultNodeObj: ITreeNodeParams = {
            id: ++this.idCounter,   //  添加 id 号
            expand: true,
            title: 'title',
            selected: false,
            checked: false,
            disabled: false
        }
        if (currentNode && currentNode.id) {
            defaultNodeObj.parent_id = currentNode.id       //  新增节点的 parent_id 为当期节点的 id
        }
        this.flatData.push(defaultNodeObj)
        return {
            defaultNodeObj,
            currentNode
        }
    }
    /**
     * @description removeNodeByID 根据节点的 id 删除节点，当所删除节点仍有子节点，将其所有子节点都删除
     * @param { number } id - 节点的id
     * @returns 没有返回值
    */
    public removeNodeByID = (id: number) => {
        const _this = this
        const garbage: any[] = []     //  垃圾箱
        const currentNode = this.getNodeByID(id)
        //  将本地删除的节点的 id 全部传入垃圾箱
        function pushNodeIntoGarbage(node: any) {
            garbage.push(node.id)
            _this.flatData.forEach((el: any) => {
                if (node.id == el.parent_id) {
                    pushNodeIntoGarbage(el)
                }
            })
        }
        pushNodeIntoGarbage(currentNode)
        //  for 循环删除垃圾箱所有 id 号所对应的节点
        for (let i = 0; i < garbage.length; i++) {
            this.flatData.splice(this.getIndexByID(garbage[i]), 1)
        }
        return { currentNode }
    }

    /**
     * @description 联动父子节点
     */
    public nodeLinkage = (currentNode: ITreeNodeParams) => {
        this.childrenNodeLinkage(currentNode)       //  联动子节点
        this.parentNodeLinkage(currentNode)         //  联动父节点
    }
    /**
     * @description 联动子节点，子节点状态跟父节点状态保持一致
     */
    public childrenNodeLinkage = (currentNode: ITreeNodeParams) => {
        if (currentNode.children && currentNode.children.length) {
            currentNode.children.map((child: ITreeNodeParams) => {
                child.checked = currentNode.checked
                if (!currentNode.checked) { child.halfChecked = false }
                this.childrenNodeLinkage(child)
            })
        }
    }
    /**
     * @description 联动父节点
     */
    public parentNodeLinkage = (currentNode: ITreeNodeParams) => {
        let isCheckedAll: boolean
        let isCheckedNull: boolean

        const _this = this
        // let { treeConstructor } = this.state
        // let { getNodeByID } = treeConstructor
        const parent_id = currentNode.parent_id
        if (parent_id) {
            //  有父节点
            const parentNode = _this.getNodeByID(parent_id)
            //  父节点有 children
            if (parentNode && parentNode.children) {
                //  isCheckedAll 表示当前节点的直属父节点的所有子节点是否全都为选中状态
                isCheckedAll = parentNode.children.every((child: any) => {
                    return child.checked == true
                })
                //  isCheckedNull 表示当前节点的直属父节点的所有子节点是否全都为未选中状态
                isCheckedNull = parentNode.children.every((child: any) => {
                    return child.checked == false
                })
                let parentAll, parentNull

                //  此处利用了立即执行函数形成闭包  引用了 parentNodeLinkage 上的全局变量 isCheckedAll 和 isCheckedNull
                //  isCheckedAll 在 recursionChangeParentNode 上 用于判断 是否 将当前节点的所有父节点都置为选中状态
                //  isCheckedNull 在 recursionChangeParentNode 上 用于判断 是否 将当前节点的所有父节点都置为为选中状态
                (function recursionChangeParentNode(isAll: boolean, isNull: boolean, currentNode: ITreeNodeParams) {
                    if (currentNode.parent_id) {
                        const parentNode = _this.getNodeByID(currentNode.parent_id)
                        const hasParent = parentNode && JSON.stringify(parentNode) != '{}' ? true : false
                        if (hasParent && parentNode.children) {
                            //  parentAll 表示当前遍历的节点的父节点的所有子节点是否都为选中状态
                            parentAll = parentNode.children.every((child: any) => {
                                return child.checked == true
                            })
                            //  parentNull 表示当前遍历的节点的父节点的所有子节点是否都为未选中状态
                            //  !parentNull 表示半选状态
                            parentNull = parentNode.children.every((child: any) => {
                                return child.checked == false && child.halfChecked == false
                            })
                            // 当前节点所在层级的所有节点均为选中状态
                            if (isAll) {
                                //  当前节点的父节点为选中状态，其所有父节点都置为选中状态
                                if (isAll == parentAll) {
                                    parentNode.checked = true
                                    parentNode.halfChecked = false
                                } else {
                                    //  当前节点的任意一个父节点链上有任意一个父节点不为选中状态，将该节点置为半选状态
                                    parentNode.checked = false
                                    parentNode.halfChecked = true
                                }
                            } else {
                                //  此处为非全选中状态
                                parentNode.checked = false
                                parentNode.halfChecked = false
                                // 为半选状态
                                if (!parentNull) {
                                    parentNode.halfChecked = true
                                }
                            }
                            recursionChangeParentNode(isAll, isNull, parentNode)
                        }
                    }
                })(isCheckedAll, isCheckedNull, currentNode)
            }
        }
    }
    /**
     * @description 每次更新 flatData 的时候，在视图渲染的时候都会重新构建一棵树
     */
    public rebuildTree = () => {
        const map: any = {}
        const tree: any = []
        this.flatData.forEach((el: any) => {
            if (el.children) {
                delete el.children
            }
            map[el.id] = el
            const parent = map[el.parent_id]
            if (parent) {
                //  有父节点，则push到父节点children字段，此处children字段默认为空数组
                (parent.children || (parent.children = [])).push(el);
            } else {
                //  没有父节点，则直接push到tree最外层
                tree.push(el)
            }
        })
        return tree
    }
}

export default Tree