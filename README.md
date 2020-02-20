# rct-tree
A tree component based on ReactJS and Typescript.

[![NPM version](https://img.shields.io/npm/v/rct-tree.svg)](https://www.npmjs.com/package/rct-tree)

# Installation
+ `yarn add rct-tree`

## Development
Recommend to use yarn to start the project:
+ `yarn install`
+ `yarn run dev`


## Example
Here is a complex example while you try to use this component.

### Data Structure
```
const treeData = [
  {
    title: '1',
    expand: true,
    selected: false,
    checked: false,
    disabled: false,
    index: 0,
    children: [
      {
        title: '1-1',
        expand: true,
        selected: false,
        checked: false,
        disabled: false,
        index: 1
      },
      {
        title: '1-2',
        expand: true,
        selected: false,
        checked: false,
        disabled: false,
        index: 1
      },
      {
        title: '1-3',
        expand: false,
        selected: false,
        checked: false,
        disabled: true,
        index: 1,
        children: [
          {
            title: '1-3-1',
            expand: true,
            selected: false,
            checked: false,
            disabled: true,
            index: 2
          },
          {
            title: '1-3-2',
            expand: true,
            selected: false,
            checked: false,
            disabled: false,
            index: 2,
            children: [
              {
                title: '1-3-2-1',
                expand: true,
                selected: false,
                checked: false,
                disabled: false,
                index: 3
              },
              {
                title: '1-3-2-2',
                expand: true,
                selected: false,
                checked: false,
                disabled: false,
                index: 3
              }
            ]
          }
        ]
      }
    ]
  }
]
```

### Usage

```
import RctTree from 'rct-tree'

export default class Example extends React.Component<IProps, IState> {
  private tree?: any
  constructor(props: IProps) {
    super(props)
    this.state = {
      showCheckBox: true,
      showIcon: true,
      autoExpandAll: true,
      autoCollapseAll: false,
      multiple: true
    }
  }
  public render() {
    const icon = {
      parent: <span styleName="rct-icon-directory" />,
      leaf: <span styleName="rct-icon-file" />
    }
    const {
      showCheckBox,
      showIcon,
      autoExpandAll,
      autoCollapseAll,
      multiple
    } = this.state
    return (
      <div styleName="example-wrapper">
        <div styleName="example-tree">
          <RctTree
            rowHeight={32}
            height={320}
            treeData={treeData}
            showCheckBox={showCheckBox}
            showIcon={showIcon}
            icon={icon}
            autoExpandAll={autoExpandAll}
            autoCollapseAll={autoCollapseAll}
            multiple={multiple}
            placeholder={`你想显示什么placeholder？`}
            onSelect={this.onSelect}
            onCheck={this.onCheck}
            onToggleExpand={this.onExpand}
          />
        </div>
        <div styleName="example-controller">
          <button styleName="example-controller-button" onClick={this.changeCheckBox}>
            显示/隐藏CheckBox
          </button>
          <button styleName="example-controller-button" onClick={this.changeShowIcon}>
            显示/隐藏Icon
          </button>
          <button styleName="example-controller-button" onClick={this.changeMultiple}>
            单选/多选
          </button>
        </div>
      </div>
    )
  }
  public changeCheckBox = () => {
    let { showCheckBox } = this.state
    showCheckBox = !showCheckBox
    this.setState({
      showCheckBox
    })
  }
  public changeShowIcon = () => {
    let { showIcon } = this.state
    showIcon = !showIcon
    this.setState({
      showIcon
    })
  }
  public changeMultiple = () => {
    let { multiple } = this.state
    multiple = !multiple
    this.setState({
      multiple
    })
  }
  public onSelect = (nodes: any) => {
    console.log(nodes)
  }
  public onCheck = (nodes: any) => {
    console.log(nodes)
  }
  public onExpand = (nodes: any) => {
    console.log(nodes)
  }
}
```

## Tree Props
| Property          | Type                               | Description                                     | Default    |
|-------------------|------------------------------------|-------------------------------------------------|------------|
| `treeData`        | ITreeNodeParams[]                  | `必须` 树形数组的数据                           | `-`        |
| `rowHeight`       | number                             | `可选` 节点的高度                               | `32px`     |
| `height`          | number                             | `可选` 树的可视高度，设置该属性表示使用虚拟渲染 | `100%`     |
| `showCheckBox`    | boolean                            | `可选` 是否显示checkbox多选框                   | `false`    |
| `showIcon`        | boolean                            | `可选` 是否显示图标                             | `false`    |
| `icon`            | IIcon                              | `可选` 传入的自定义icon图标                     | `默认图标` |
| `autoExpandAll`   | boolean                            | `可选` 是否自动展开所有节点                     | `true`     |
| `autoCollapseAll` | boolean                            | `可选` 是否自动收起所有节点                     | `false`    |
| `placeholder`     | string                             | `可选` 没有数据时的提示                         | `暂无数据` |
| `onSelect`        | (nodes: ITreeNodeParams[]) => void | `可选` 点击树节点时触发                         | `-`        |
| `onCheck`         | (nodes: ITreeNodeParams[]) => void | `可选` 点击checkbox时触发                       | `-`        |
| `onToggleExpand`  | (nodes: ITreeNodeParams[]) => void | `可选` 展开和收起子列表时触发                   | `-`        |


## ITreeNodeParams Props 
| Property       | type                    | Descript                          | Default    |
|----------------|-------------------------|-----------------------------------|------------|
| `title`        | string                  | `可选` 当前节点的标题             | `-`        |
| `expand`       | boolean                 | `可选` 当前节点是否展开           | `true`     |
| `selected`     | boolean                 | `可选` 当前节点是否被选中         | `false`    |
| `checked`      | boolean                 | `可选` 当前节点的多选框是否被选中 | `false`    |
| `disabled`     | boolean                 | `可选` 当前节点是否为禁用状态     | `false`    |
| `showCheckBox` | boolean                 | `可选` 是否显示当前节点的checkbox | `false`    |
| `showIcon`     | boolean                 | `可选` 是否显示当前节点的icon     | `false`    |
| `icon`         | IIcon                   | `可选` 传入的自定义icon图标       | `默认图标` |
| `currentNode`  | ITreeNodeParams         | `可选` 当前节点                   | `-`        |
| `children`     | ITreeNodeParams[]       | `可选` 子节点                     | `-`        |

## IIcon
| Property | Type            | Description       | Default      |
|----------|-----------------|-------------------|--------------|
| `parent` | React.ReactNode | `必须` 非叶子节点 | `文件夹图标` |
| `leaf`   | React.ReactNode | `必须` 叶子节点   | `文件图标`   |
