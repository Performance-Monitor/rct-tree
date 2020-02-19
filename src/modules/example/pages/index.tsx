import * as React from 'react'
import RctTree from '../../../../index'
import './index.less'
interface IState {
  showCheckBox?: boolean
  showIcon?: boolean
  autoExpandAll?: boolean
  autoCollapseAll?: boolean
  editable?: boolean
  creatable?: boolean
  removable?: boolean
  multiple?: boolean
}
interface IProps {
  [x: string]: any
}
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
  },
  {
    title: '2',
    expand: true,
    selected: false,
    checked: false,
    disabled: false,
    index: 0,
    children: [
      {
        title: '2-1',
        expand: true,
        selected: false,
        checked: false,
        disabled: false,
        index: 1,
        children: [
          {
            title: '2-1-1',
            selected: false,
            checked: false,
            disabled: false,
            index: 2
          },
          {
            title: '2-1-2',
            selected: false,
            checked: false,
            disabled: false,
            index: 2
          },
          {
            title: '2-1-3',
            selected: false,
            checked: false,
            disabled: false,
            index: 2
          }
        ]
      },
      {
        title: '2-2',
        expand: true,
        selected: false,
        checked: false,
        disabled: false,
        index: 1,
        children: [
          {
            title: '2-2-1',
            selected: false,
            checked: false,
            disabled: false,
            index: 2
          },
          {
            title: '2-2-2',
            selected: false,
            checked: false,
            disabled: false,
            index: 2
          }
        ]
      },
      {
        title: '2-3',
        expand: true,
        selected: false,
        checked: false,
        disabled: false,
        index: 1,
        children: [
          {
            title: '2-3-1',
            expand: true,
            selected: false,
            checked: false,
            disabled: false,
            index: 2,
            children: [
              {
                title: '2-3-1-1',
                selected: false,
                checked: false,
                disabled: false,
                index: 3
              },
              {
                title: '2-3-1-2',
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
            ref={this.onRef} //  获取 Tree 这个构造类
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
          <button styleName="example-controller-button" onClick={this.getRef}>
            控制台打印Tree类
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
  public onRef = (ref: any) => {
    this.tree = ref
  }
  //  打印子组件 Tree （构造类）
  public getRef = () => {
    console.dir(this.tree)
  }
}