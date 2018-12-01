import React from 'react';
import ReactHtmlParser, {processNodes, convertNodeToElement, htmlparser2} from 'react-html-parser';

import RegexEngine from './regex_engine'


class Markdown extends React.Component {
  constructor() {
    super();
    const patterns = [{
      pattern: /\[(.*?)]\((.*?)\)/g,
      with: '<a target="_blank" href="{p1}">{p0}</a>',
      params: 2
    }, {
      pattern: /~~(.*?)~~/gm,
      with: '<strike>{p0}</strike>',
      params: 1
    }, {
      pattern: /######(.*?)\n/g,
      with: '<h6>{p0}</h6>',
      params: 1
    }, {
      pattern: /#####(.*?)\n/g,
      with: '<h5>{p0}</h5>',
      params: 1
    }, {
      pattern: /####(.*?)\n/g,
      with: '<h4>{p0}</h4>',
      params: 1
    }, {
      pattern: /###(.*?)\n/g,
      with: '<h3>{p0}</h3>',
      params: 1
    }, {
      pattern: /##(.*?)\n/g,
      with: '<h2>{p0}</h2>',
      params: 1
    }, {
      pattern: /#(.*?)\n/g,
      with: '<h1>{p0}</h1>',
      params: 1
    }, {
      pattern: /-(.*?)-/g,
      with: '<em>{p0}</em>',
      params: 1
    }, {
      pattern: /_(.*?)_/g,
      with: '<u>{p0}</u>',
      params: 1
    }, {
      pattern: /\*\*(.*?)\*\*/g,
      with: '<strong>{p0}</strong>',
      params: 1
    }, {
      pattern: /\[(.*?)]/g,
      with: '<a href="{p0}">{p0}</a>',
      params: 1
    }, {
      pattern: /\n/g,
      with: '<br/>',
      params: 1
    },];

    this.regexEngine = new RegexEngine(patterns);
    this.state = {
      value: undefined,
      previewValue: '',
      toggle: true,
    };

    this.handleChange = this.handleChange.bind(this);
    this.renderPreviewValue = this.renderPreviewValue.bind(this);
    this.toggleMarkdown = this.toggleMarkdown.bind(this);
  }

  componentDidMount() {
    if (this.props.value && !this.state.value) {
      this.setState({value: this.props.value, previewValue: this.regexEngine.parse(this.props.value)});
    }
  }

  componentDidUpdate() {
    this.props.onChange(this.state.value, this.state.previewValue);
  }

  handleChange(event) {
    const val = this.regexEngine.parse(event.target.value);
    this.setState({previewValue: val, value: event.target.value})
  }

  toggleMarkdown() {
    this.setState({toggle: !this.state.toggle})
  }

  getWrapperClass() {
    const {wrapperClass} = this.props;
    return (wrapperClass) ? wrapperClass : 'col-12'
  }

  getInputClass() {
    const {className} = this.props;
    return (className) ? className : 'col-12'
  }

  renderPreviewValue() {
    {
      console.log(this.state.previewValue)
    }
    const {height} = this.props;
    let pixelHeight = (height) ? height : '256px';
    return (<div className={this.getInputClass()}
                 style={
                   {
                     overflowY: 'auto',
                     height: pixelHeight
                   }
                 }>
              <div onClick={this.toggleMarkdown}>{ReactHtmlParser(this.state.previewValue)}</div>
            </div>);
  }

  renderTextArea() {
    return (
      <textarea className={this.getInputClass()}
                style={this.props.style}
                value={this.state.value}
                rows={10}
                onChange={this.handleChange}/>
    )
  }

  markdownRender() {
    if (this.state.toggle) {
      return this.renderPreviewValue();
    }

    return this.renderTextArea();
  }

  render() {
    let iconClass = 'fa fa-eye';
    if (this.state.toggle) {
      iconClass += ' text-primary';
    } else {
      iconClass += ' text-dark'
    }
    return (<div className='card w-100'>
      <div className='card-header text-right p-0'>
        <button className='btn btn-link ' onClick={this.toggleMarkdown}>
          <i className={iconClass}/>
        </button>
      </div>
      <div className='card-body p-0'>
        {this.markdownRender()}
      </div>
    </div>)
  }
}

export {Markdown};