import React, { Component } from 'react';
import i18next from 'i18next';

import messageDispatcher from '../lib/MessageDispatcher';
import apiManager from '../lib/APIManager';

class Navbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      config: props.config,
      curNav: "users",
      navDropdown: false,
      profileList: props.profileList,
      loggedIn: props.loggedIn
    }

    messageDispatcher.subscribe('Navbar', (message) => {
    });
    
    this.navigate = this.navigate.bind(this);
    this.toggleLogin = this.toggleLogin.bind(this);
    this.changeLang = this.changeLang.bind(this);
    this.changeProfile = this.changeProfile.bind(this);
    this.gotoManageUsers = this.gotoManageUsers.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({loggedIn: nextProps.loggedIn, profileList: nextProps.profileList});
  }
  
  navigate(e, page, navDropdown) {
    e.preventDefault();
    messageDispatcher.sendMessage('App', {type: "nav", message: page});
    this.setState({curNav: page, navDropdown: navDropdown});
  }

  toggleLogin() {
    if (this.state.loggedIn) {
      apiManager.glewlwydRequest("/auth/?username=" + encodeURIComponent(this.state.profileList[0].username), "DELETE")
      .then(() => {
        messageDispatcher.sendMessage('Notification', {type: "info", message: i18next.t("login.success-delete-session")});
        messageDispatcher.sendMessage('App', {type: 'loggedIn', loggedIn: false});
      })
      .fail((err) => {
        if (err.status !== 401) {
          messageDispatcher.sendMessage('Notification', {type: "danger", message: i18next.t("login.error-delete-session")});
        }
        messageDispatcher.sendMessage('App', {type: 'loggedIn', loggedIn: false});
      });
    } else {
      var schemeDefault = false;
      this.state.config.sessionSchemes.forEach((scheme) => {
        if (scheme.scheme_default) {
          scheme.scheme_default.forEach((page) => {
            if (page === "admin") {
              schemeDefault = scheme.scheme_name;
            }
          });
        }
      });
      document.location.href = this.state.config.LoginUrl + "?callback_url=" + encodeURIComponent([location.protocol, '//', location.host, location.pathname].join('')) + "&scope=" + encodeURIComponent(this.state.config.admin_scope) + (schemeDefault?("&scheme="+encodeURIComponent(schemeDefault)):"");
    }
  }

  changeLang(e, lang) {
    i18next.changeLanguage(lang)
    .then(() => {
      this.setState({lang: lang});
      messageDispatcher.sendMessage('App', {type: "lang"});
    });
  }

  changeProfile(e, profile) {
    e.preventDefault();
    if (profile) {
      apiManager.glewlwydRequest("/auth/", "POST", {username: profile.username})
      .then(() => {
        messageDispatcher.sendMessage('App', {type: "profile"});
      })
      .fail(() => {
        messageDispatcher.sendMessage('Notification', {type: "danger", message: i18next.t("login.error-login")});
      });
    } else {
      var schemeDefault = false;
      this.state.config.sessionSchemes.forEach((scheme) => {
        if (scheme.scheme_default) {
          scheme.scheme_default.forEach((page) => {
            if (page === "admin") {
              schemeDefault = scheme.scheme_name;
            }
          });
        }
      });
      document.location.href = this.state.config.LoginUrl + "?callback_url=" + encodeURIComponent([location.protocol, '//', location.host, location.pathname].join('')) + "&scope=" + encodeURIComponent(this.state.config.admin_scope) + (schemeDefault?("&scheme="+encodeURIComponent(schemeDefault)):"") + "&prompt=login";
    }
  }

  gotoManageUsers(e) {
    e.preventDefault();
    document.location.href = this.state.config.LoginUrl + "?callback_url=" + encodeURIComponent([location.protocol, '//', location.host, location.pathname].join('')) + "&scope=" + encodeURIComponent(this.state.config.admin_scope) + "&prompt=select_account";
  }

  userHasScope(user, scope_list) {
    var hasScope = false;
    if (scope_list) {
      scope_list.split(" ").forEach(scope => {
        if (user.scope.indexOf(scope) > -1) {
          hasScope = true;
        }
      });
    }
    return hasScope;
  }

	render() {
    var langList = [], profileList = [], profileDropdown, loginButton;
    var profilePicture;
    this.state.config.lang.forEach((lang, i) => {
      if (lang === i18next.language) {
        langList.push(<a className="dropdown-item active" href="#" key={i}>{lang}</a>);
      } else {
        langList.push(<a className="dropdown-item" href="#" onClick={(e) => this.changeLang(e, lang)} key={i}>{lang}</a>);
      }
    });
    if (this.state.profileList.length) {
      this.state.profileList.forEach((profile, index) => {
        if (this.userHasScope(profile, this.state.config.admin_scope)) {
          profileList.push(<a className={"dropdown-item"+(!index?" active":"")} href="#" onClick={(e) => this.changeProfile(e, profile)} key={index}>{profile.name||profile.username}</a>);
        } else {
          profileList.push(<a className={"dropdown-item glwd-nav-user-unavailable"+(!index?" active":"")} key={index} href="#" disabled={true}>{profile.name||profile.username}</a>);
        }
      });
      profileList.push(<div className="dropdown-divider" key={profileList.length}></div>);
      profileList.push(<a className="dropdown-item" href="#" onClick={(e) => this.changeProfile(e, null)} key={profileList.length}>{i18next.t("profile.menu-session-new")}</a>);
      profileList.push(<a className="dropdown-item" href="#" onClick={(e) => this.gotoManageUsers(e)} key={profileList.length}>{i18next.t("login.manage-users")}</a>);
      if (this.state.profileList && this.state.profileList[0]) {
        if (this.state.config.profilePicture && this.state.profileList[0][this.state.config.profilePicture.property]) {
          var picData = this.state.profileList[0][this.state.config.profilePicture.property];
          if (Array.isArray(picData)) {
            picData = picData[0];
          }
          profilePicture =
          <div className="glwd-nav-picture-div">
            <img className="img-medium glwd-nav-picture-image" src={"data:image/*;base64,"+picData}/>
            {this.state.profileList[0].username}
          </div>
        } else {
          profilePicture =
          <div className="glwd-nav-picture-div">
            <img className="img-medium glwd-nav-picture-spacer" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" /> {/*1-pixel transparent image as spacer (Possible Bootstrap bug)*/}
            <i className="fas fa-user">
              &nbsp;
            </i>
            {this.state.profileList[0].username}
          </div>
        }
      }
      profileDropdown = 
      <div className="btn-group" role="group">
        <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownProfile" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <div className="glwd-nav-picture-container">
            {profilePicture}
          </div>
        </button>
        <div className="dropdown-menu" aria-labelledby="dropdownProfile">
          {profileList}
        </div>
      </div>
    }
    if (this.state.loggedIn) {
      loginButton = <button type="button" className="btn btn-secondary" onClick={this.toggleLogin} title={i18next.t("title-logout")}>
        <i className="fas btn-icon fa-sign-out-alt"></i>
      </button>
    } else {
      loginButton = <button type="button" className="btn btn-secondary" onClick={this.toggleLogin} title={i18next.t("title-login")}>
        <i className="fas btn-icon fa-sign-in-alt"></i>
      </button>
    }
		return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a className="navbar-brand" href="#">
        <img className="mr-3" src="img/logo-admin.png" alt="logo"/>
        {i18next.t("admin.menu-title")}
      </a>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          <li className={"nav-item" + (this.state.curNav==="users"?" active":"")}>
            <a className="nav-link" href="#" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={(e) => this.navigate(e, "users", false)}>
              {i18next.t("admin.menu-users")}
            </a>
          </li>
          <li className={"nav-item" + (this.state.curNav==="clients"?" active":"")}>
            <a className="nav-link" href="#" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={(e) => this.navigate(e, "clients", false)}>
              {i18next.t("admin.menu-clients")}
            </a>
          </li>
          <li className={"nav-item" + (this.state.curNav==="scopes"?" active":"")}>
            <a className="nav-link" href="#" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={(e) => this.navigate(e, "scopes", false)}>
              {i18next.t("admin.menu-scopes")}
            </a>
          </li>
          <li className={"d-md-none nav-item" + (this.state.curNav==="users-mod"?" active":"")}>
            <a className="nav-link" href="#" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={(e) => this.navigate(e, "users-mod", false)}>
              {i18next.t("admin.menu-users-mod")}
            </a>
          </li>
          <li className={"d-md-none nav-item" + (this.state.curNav==="clients-mod"?" active":"")}>
            <a className="nav-link" href="#" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={(e) => this.navigate(e, "clients-mod", false)}>
              {i18next.t("admin.menu-clients-mod")}
            </a>
          </li>
          <li className={"d-md-none nav-item" + (this.state.curNav==="auth-schemes"?" active":"")}>
            <a className="nav-link" href="#" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={(e) => this.navigate(e, "auth-schemes", false)}>
              {i18next.t("admin.menu-auth-schemes")}
            </a>
          </li>
          <li className={"d-md-none nav-item" + (this.state.curNav==="plugins"?" active":"")}>
            <a className="nav-link" href="#" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={(e) => this.navigate(e, "plugins", false)}>
              {i18next.t("admin.menu-plugins")}
            </a>
          </li>
          <li className={"d-md-none nav-item" + (this.state.curNav==="api-key"?" active":"")}>
            <a className="nav-link" href="#" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={(e) => this.navigate(e, "api-key", false)}>
              {i18next.t("admin.menu-api-key")}
            </a>
          </li>
          <li className="nav-item dropdown d-none d-md-block">
            <a className={"nav-link dropdown-toggle" + (this.state.navDropdown?" active":"")} href="#" data-toggle="collapse" data-target=".navbar-collapse.show" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              {i18next.t("admin.menu-parameters")}
            </a>
            <div className={"dropdown-menu"} aria-labelledby="navbarDropdown">
              <a className={"dropdown-item" + (this.state.curNav==="users-mod"?" active":"")} href="#" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={(e) => this.navigate(e, "users-mod", true)}>{i18next.t("admin.menu-users-mod")}</a>
              <a className={"dropdown-item" + (this.state.curNav==="clients-mod"?" active":"")} href="#" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={(e) => this.navigate(e, "clients-mod", true)}>{i18next.t("admin.menu-clients-mod")}</a>
              <div className="dropdown-divider"></div>
              <a className={"dropdown-item" + (this.state.curNav==="users-middleware-mod"?" active":"")} href="#" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={(e) => this.navigate(e, "users-middleware-mod", true)}>{i18next.t("admin.menu-users-middleware-mod")}</a>
              <div className="dropdown-divider"></div>
              <a className={"dropdown-item" + (this.state.curNav==="auth-schemes"?" active":"")} href="#" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={(e) => this.navigate(e, "auth-schemes", true)}>{i18next.t("admin.menu-auth-schemes")}</a>
              <div className="dropdown-divider"></div>
              <a className={"dropdown-item" + (this.state.curNav==="plugins"?" active":"")} href="#" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={(e) => this.navigate(e, "plugins", true)}>{i18next.t("admin.menu-plugins")}</a>
              <div className="dropdown-divider"></div>
              <a className={"dropdown-item" + (this.state.curNav==="api-key"?" active":"")} href="#" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={(e) => this.navigate(e, "api-key", true)}>{i18next.t("admin.menu-api-key")}</a>
              <div className="dropdown-divider"></div>
              <a className={"dropdown-item" + (this.state.curNav==="misc-config"?" active":"")} href="#" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={(e) => this.navigate(e, "misc-config", true)}>{i18next.t("admin.menu-misc-config")}</a>
            </div>
          </li>
        </ul>
        <form className="form-inline my-2 my-lg-0">
          <div className="btn-group" role="group">
            <div className="btn-group" role="group">
              <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownLang" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i className="fas fa-language"></i>
              </button>
              <div className="dropdown-menu" aria-labelledby="dropdownLang">
                {langList}
              </div>
            </div>
            {profileDropdown}
            {loginButton}
          </div>
        </form>
      </div>
    </nav>
		);
	}
}

export default Navbar;
