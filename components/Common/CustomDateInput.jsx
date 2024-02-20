import React,{ Component } from "react";
import searchWidgetStyles from "../../styles/SearchWidget.module.scss";
import styles from "../../styles/Filter.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";


class CustomInput extends Component {
    constructor(props){
       super(props)
    }
 
    render() {
      return (
        <div className="wrapper">
          <input
             onClick={this.props.onClick} 
             className={this.props.className} 
             value={this.props.value} 
             type="text"
             value={this.props.value}
             placeholder={this.props.placeholder}
             onChange={this.props.onChange}
          />
          <FontAwesomeIcon icon={faCalendarAlt} className={`${styles.fa_btn_icon} ${styles.fa_calendar}`} onClick={this.props.onClick} />
        </div>
      )
    }
}

export default CustomInput;
