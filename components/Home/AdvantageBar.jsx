
import React, { Component } from "react";
import AdvantageBarStyle from "../../styles/AdvantageBar.module.scss";
import { withTranslation } from 'next-i18next';
import styles from "../../styles/AdvantageBar.module.scss";

class AdvantageBar extends Component {
   render() {
      return (
         <div className={`container mt-5`}>
            <div className="row justify-content-between">
               <div className={`col-sm-12 col-md-3 text-center `}>
                  <div className={`${styles.advantage_wrap}`}>
                     <img className="" src="images/advantagebar/hotel.png" alt="Any Source Code Manager" title=""/>
                     <h5 className={`pt-3 ${styles.advntage_text}`}>{this.props.t('advantages.adv1')}</h5>
                     {/* <p>Drone integrates seamlessly with multiple source code management systems, including GitHub, GitHubEnterprise, Bitbucket, and GitLab.</p> */}
                  </div>
               </div>
               <div className={`col-sm-12 col-md-3 text-center `}>
                  <div className={`${styles.advantage_wrap}`}>
                     <img className="" src="images/advantagebar/discount.png" alt="Any Source Code Manager" title=""/>
                     <h5 className={`pt-3 ${styles.advntage_text}`}>{this.props.t('advantages.adv2')}</h5>
                     {/* <p>Drone integrates seamlessly with multiple source code management systems, including GitHub, GitHubEnterprise, Bitbucket, and GitLab.</p> */}
                     </div>
               </div>
               <div className={`col-sm-12 col-md-3 text-center `}>
                  <div className={`${styles.advantage_wrap}`}>
                     <img className="" src="images/advantagebar/telemarketer.png" alt="Any Source Code Manager" title=""/>
                     <h5 className={`pt-3 ${styles.advntage_text}`}>{this.props.t('advantages.adv3')}</h5>
                     {/* <p>Drone integrates seamlessly with multiple source code management systems, including GitHub, GitHubEnterprise, Bitbucket, and GitLab.</p> */}
                  </div>
               </div>
               <div className={`col-sm-12 col-md-3 text-center `}>
                  <div className={`${styles.advantage_wrap}`}>
                     <img className="" src="images/advantagebar/payment-method.png" alt="Any Source Code Manager" title=""/>
                     <h5 className={`pt-3 ${styles.advntage_text}`}>{this.props.t('advantages.adv4')}</h5>
                     {/* <p>Drone integrates seamlessly with multiple source code management systems, including GitHub, GitHubEnterprise, Bitbucket, and GitLab.</p> */}
                     </div>
               </div>
            </div>
         </div>
      );
   }
}
export default withTranslation('home')(AdvantageBar);
