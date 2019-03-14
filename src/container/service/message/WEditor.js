// https://www.kancloud.cn/wangfupeng/wangeditor3/332599
// https://github.com/wangfupeng1988/wangEditor/tree/master/example/demo/in-react/src

import React, { Component } from 'react';
import Editor from 'wangeditor';

class WEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
        this.initWEdit();
    }
    
    initWEdit = () => {
        let editor = new Editor(this.refs.editorElem);
        // 配置服务器端地址
        editor.customConfig = this.props.config;

        editor.create();

        editor.txt.html(this.props.defaultHtml || '');
    }

    render () {
        return (
            <div ref="editorElem" style={{ textAlign: 'left' }} />
        );
    }
}
export default WEditor;