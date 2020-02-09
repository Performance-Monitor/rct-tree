## `rct-tree`
A tree component based on ReactJS and Typescript.

[![NPM version](https://img.shields.io/npm/v/rct-tree.svg)](https://www.npmjs.com/package/rct-tree)

## `Installation`
```
npm i rct-tree
```  
or use
```
yarn add rct-tree
```

### `Development`
Recommend to use yarn to start the project:
+ `yarn install`
+ `yarn run dev`


### `Demo`
Here is a complex example while you try to use this component.

#### `Data Structure`
```
var treeData = [
    {
        title: '1',
        expand: true,
        selected: false,
        checked: false,
        disabled: false,
        children: [
            {
                title: '1-1',
                expand: true,
                selected: false,
                checked: false,
                disabled: false,
            },
            {
                title: '1-2',
                expand: true,
                selected: false,
                checked: false,
                disabled: false,
            },
            {
                title: '1-3',
                expand: false,
                selected: false,
                checked: false,
                disabled: true,
                children: [
                    {
                        title: '1-3-1',
                        expand: true,
                        selected: false,
                        checked: false,
                        disabled: true,
                    },
                    {
                        title: '1-3-2',
                        expand: true,
                        selected: false,
                        checked: false,
                        disabled: false,
                        children: [
                            {
                                title: '1-3-2-1',
                                expand: true,
                                selected: false,
                                checked: false,
                                disabled: false
                            },
                            {
                                title: '1-3-2-2',
                                expand: true,
                                selected: false,
                                checked: false,
                                disabled: false,
                            }
                        ]
                    }
                ]
            }
        ]
    }
```

#### `Usage`

```
import RctTree from 'rct-tree'

class Demo extends React.Component<IProps, IState>{
    private tree?: any
    constructor(props: IProps) {
        super(props)
        this.state = {
            showCheckBox: true,
            showIcon: true,
            autoExpandAll: true,
            autoCollapseAll: false,
            editable: true,
            creatable: true,
            removable: true,
            multiple: true
        }
    }
    render() {
        var myConfig = {
            paddingLeft: '1rem'
        }
        var icons = {
            parent: <span styleName="rct-icon-directory"></span>,
            leaf: <span styleName="rct-icon-file"></span>
        }
        let {
            showCheckBox,
            showIcon,
            autoExpandAll,
            autoCollapseAll,
            editable,
            creatable,
            removable,
            multiple
        } = this.state
        return (
            <RctTree
                treeData={treeData}
                showCheckBox={showCheckBox}
                showIcon={showIcon}
                icons={icons}
                autoExpandAll={autoExpandAll}
                autoCollapseAll={autoCollapseAll}
                config={myConfig}
                multiple={multiple}
                placeholder={`你想显示什么placeholder？`}
                editable={editable}
                creatable={creatable}
                removable={removable}
                onCreate={this.onCreate}
                onEdit={this.onEdit}
                onRemove={this.onRemove}
                onSelect={this.onSelect}
                onCheck={this.onCheck}
                onToggleExpand={this.onExpand}
            ></RctTree>
        )
    }
    onCreate = (childNode: any, currentNode: any) => {
        console.log(childNode, currentNode);
    }
    onEdit = (currentNode: any) => {
        currentNode.title = 'title after edit'
    }
    onRemove = (currentNode: any) => {
        console.log(currentNode)
    }
    onSelect = (nodes: any) => {
        console.log(nodes)
    }
    onCheck = (nodes: any) => {
        console.log(nodes)
    }
    onExpand = (nodes: any) => {
        console.log(nodes)
    }
}
```

### `Tree Props`
| Property        | Type                                                               | Description                                                    | Default    |
|-----------------|--------------------------------------------------------------------|----------------------------------------------------------------|------------|
| treeData        | ITreeNodeParams[]                                                  | `必须` 树形数组的数据                                          | -          |
| showCheckBox    | boolean                                                            | `可选` 是否显示checkbox多选框                                  | false      |
| showIcon        | boolean                                                            | `可选` 是否显示图标                                            | false      |
| icons           | IIcons                                                             | `可选` 传入的自定义icon图标                                    | 默认图标   |
| autoExpandAll   | boolean                                                            | `可选` 是否自动展开所有节点                                    | true       |
| autoCollapseAll | boolean                                                            | `可选` 是否自动收起所有节点                                    | false      |
| placeholder     | string                                                             | `可选` 没有数据时的提示                                        | “暂无数据” |
| config          | INodeConfig                                                        | `可选` 节点层级的布局配置                                      | -          |
| multiple        | boolean                                                            | `可选` 单选/多选                                               | false      |
| editable        | boolean                                                            | `可选` 是否可编辑当前节点                                      | false      |
| creatable       | boolean                                                            | `可选` 是否可在当前节点下创建子节点                            | false      |
| removable       | boolean                                                            | `可选` 是否可删除当前节点                                      | false      |
| onEdit          | (currentNode: ITreeNodeParams) => void                             | `可选` 编辑当前节点时触发，前置条件是editable为true            | -          |
| onCreate        | (childNode: ITreeNodeParams, currentNode: ITreeNodeParams) => void | `可选` 在当前节点下创建子节点时触发，前置条件是creatable为true | -          |
| onRemove        | (currentNode: ITreeNodeParams) => void                             | `可选` 删除当前节点时触发，前置条件是removable为true           | -          |
| onSelect        | (nodes: ITreeNodeParams[]) => void                                 | `可选` 点击树节点时触发                                        | -          |
| onCheck         | (nodes: ITreeNodeParams[]) => void                                 | `可选` 点击checkbox时触发                                      | -          |
| onToggleExpand  | (nodes: ITreeNodeParams[]) => void                                 | `可选` 展开和收起子列表时触发                                  | -          |


### `ITreeNodeParams Props` 
| Property     | type                    | Descript                                      | Default |
|--------------|-------------------------|-----------------------------------------------|---------|
| title        | string                  | `必须` 当前节点的标题                         | title   |
| expand       | boolean                 | `可选` 当前节点是否展开                       | true    |
| selected     | boolean                 | `可选` 当前节点是否被选中                     | false   |
| checked      | boolean                 | `可选` 当前节点的多选框是否被选中             | false   |
| disabled     | boolean                 | `可选` 当前节点是否为禁用状态                 | false   |
| showCheckBox | boolean                 | `可选` 是否显示当前节点的checkbox             | false   |
| showIcon     | boolean                 | `可选` 是否显示当前节点的icon                 | false   |
| currentNode  | ITreeNodeParams         | `可选` 当前节点                               | -       |
| children     | ITreeNodeParams[]       | `可选` 子节点                                 | -       |
| checkLeaf    | (id: number) => boolean | `可选` 根据节点 id 判断某个节点是否为叶子节点 | false   |


### `IIcons Props`
| Property | Type            | Description | Default    |
|----------|-----------------|-------------|------------|
| parent   | React.ReactNode | `必须`      | 文件夹图标 |
| leaf     | React.ReactNode | `必须`      | 文件图标   |

### `INodeConfig Props`
| Property    | Type            | Description   | Default |
|-------------|-----------------|---------------|---------|
| paddingLeft | string / number | `可选` 左偏移 | 1rem    |
