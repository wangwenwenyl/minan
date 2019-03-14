import React from 'react'
import { Tree, Icon } from 'antd'

import './tree.css'

const TreeNode = Tree.TreeNode
class OrgTree extends React.Component{
    constructor(props){
        super(props)
    }
    renderTreeNodes = (data) => {
        
        return data.map((item) => {
          if (item.nodes) {
            return (
              <TreeNode title={item.name} key={item.id} dataRef={item}>
                    {this.renderTreeNodes(item.nodes)}
              </TreeNode>
            );
          }
          return <TreeNode {...item} dataRef={item} title={item.name} key={item.id} />;
        });
    }
    render(){
        return(
            // <div>

                <Tree
                    showLine
                    showIcon
                    // defaultSelectedKeys={['1']}
                    defaultExpandedKeys={['1']}
                    autoExpandParent
                    onSelect={this.props.onSelect}>
                    {this.renderTreeNodes(this.props.treeData)}
                </Tree>
            // </div>
        )
        
    }
}

export default OrgTree