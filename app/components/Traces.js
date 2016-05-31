import React, { PropTypes, Component } from 'react'
import css from './Traces.css'

export default class Traces extends Component {
  render() {
    setTimeout(function(){
      var objDiv = document.getElementById("traceTab");
      console.log("scrolling");
      objDiv.scrollTop = objDiv.scrollHeight;
    }, 500)
    return (
      <div className={css.traceTab} id="traceTab">
        <ul>
          {this.props.traces.map((trace, i) =>
            <li key={i}>
              <span className={css.method}>
                {trace.method}
              </span>
              <span className={css.url}>
                {trace.url}
              </span>
              <br></br>
              <span className={css.code}>
                {trace.code}
              </span>
              <span className={css.ip}>
                ← {trace.ip}
              </span>
            </li>
          )}
        </ul>
      </div>
    )
  }
}

Traces.propTypes = {
  traces: PropTypes.array.isRequired
}
