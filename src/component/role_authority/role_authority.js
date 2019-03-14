/**
 * Created by ts on 2018/8/29.
 */
import React from 'react'
import { Tree, Icon } from 'antd'

import './tree.css'

const TreeNode = Tree.TreeNode
class role_authority extends React.Component{
    constructor(props){
        super(props)
    }
    renderTreeNodes = (data) => {
        // console.log(data)
        if(data!=null){
            return data.map((item) => {
                // console.log(item)
                if (item.children) {
                    return (
                        <TreeNode title={item.name} key={item.key} >

                            {this.renderTreeNodes(item.children)}
                        </TreeNode>
                    );
                }
                return <TreeNode {...item} dataRef={item} title={item.name} key={item.key} />;
            });
        }

    }
    //权限选中
    onCheck=(checkedKeys)=>{
        // console.log( checkedKeys);

        this.props.onCheck(checkedKeys);
    }
    render(){
        return(
            <Tree
                checkable
                onCheck={this.onCheck}
                showIcon
                disabled={this.props.userable}
                // defaultSelectedKeys={}
                // defaultExpandedKeys={}
                autoExpandParent
                checkedKeys={this.props.checkedKeys}
                onSelect={this.props.onSelect}>
                {this.renderTreeNodes(this.props.treeData)}
            </Tree>
        )
    }
}

export default role_authority