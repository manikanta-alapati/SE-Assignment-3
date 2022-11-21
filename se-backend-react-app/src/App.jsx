import React from "react";
import AddNumbers from "./AddNumbers";
import "./App.css";
import Login from "./Login";
import NavBar from "./NavBar";
import NewsArticleList from "./NewsArticleList";
import Profile from "./Profile";
import SignUp from "./SignUp";
import UserList from "./UserList";

class App extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      isLoggedIn: !!localStorage.getItem("jwt_token"),
      currentSection: "news",
    };
    this.saveStateToLocalStorage = this.saveStateToLocalStorage.bind(this);
  }
  saveStateToLocalStorage() {
    localStorage.setItem("appState", JSON.stringify(this.state));
  }
  componentDidMount() {
    const appState = localStorage.getItem("appState");
    if (appState) {
      this.setState(JSON.parse(appState));
    }
    window.addEventListener("beforeunload", this.saveStateToLocalStorage);
  }
  render() {
    const { currentSection, isLoggedIn } = this.state;
    const commonLeftSections = [
      {
        id: "news",
        title: "News",
        onClick: () => this.setState({ currentSection: "news" }),
      },
      {
        id: "addNumbers",
        title: "Add Numbers",
        onClick: () => this.setState({ currentSection: "addNumbers" }),
      },
      {
        id: "users",
        title: "Users",
        onClick: () => this.setState({ currentSection: "users" }),
      },
    ];
    const sections = !isLoggedIn
      ? commonLeftSections
      : [
          ...commonLeftSections,
          {
            id: "profile",
            title: "Profile",
            onClick: () =>
              this.setState({
                currentSection: isLoggedIn ? "profile" : "login",
              }),
          },
        ];
    const rightSections = isLoggedIn
      ? [
          {
            id: "logout",
            title: "Logout",
            onClick: () => {
              localStorage.removeItem("jwt_token");
              this.setState({ isLoggedIn: false, currentSection: "news" });
            },
          },
        ]
      : [
          {
            id: "login",
            title: "Login",
            onClick: () => this.setState({ currentSection: "login" }),
          },
          {
            id: "signup",
            title: "Sign Up",
            onClick: () => this.setState({ currentSection: "signup" }),
          },
        ];
    return (
      <div className="container-fluid min-vh-100 p-0 d-flex flex-column">
        <NavBar
          navItems={sections}
          rightNavItems={rightSections}
          userName={this.state.name}
          onUserNameChange={(name) => this.setState({ name })}
        />
        <div className="container-fluid pt-4 flex-fill">
          {currentSection === "news" && (
            <div className="container mb-3">
              <h3>Welcome {this.state.name}! Here is latest news for you.</h3>
            </div>
          )}
          {currentSection === "news" && <NewsArticleList />}
          {currentSection === "profile" && <Profile />}
          {currentSection === "addNumbers" && <AddNumbers />}
          {currentSection === "login" && (
            <Login setAppState={(state) => this.setState(state)} />
          )}
          {currentSection === "signup" && (
            <SignUp setAppState={(state) => this.setState(state)} />
          )}
          {currentSection === "users" && <UserList />}
        </div>
      </div>
    );
  }
}

export default App;
