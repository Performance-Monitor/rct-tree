import * as React from 'react'

import './index.less'

class PageLoading extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
  }

  public render() {
    return <div styleName="loader">Loading...</div>
  }
}

export default PageLoading
