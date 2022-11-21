import React from "react";
import Apis from "./Apis";

class AddNumbers extends React.Component {
  state = {
    firstInput: "",
    secondInput: "",
    answer: "",
  };
  render() {
    const onSubmit = () => {
      Apis.postAddNumbers(this.state.firstInput, this.state.secondInput)
        .then((resp) => {
          this.setState({ answer: resp.data?.answer ?? "" });
        })
        .catch((error) => console.log("post error", error));
    };
    return (
      <div className="container mb-3">
        <div className="mb-3">
          <label className="form-label">First Number</label>
          <input
            type="number"
            className="form-control"
            onChange={(e) => this.setState({ firstInput: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Second Number</label>
          <input
            type="number"
            className="form-control"
            onChange={(e) => this.setState({ secondInput: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Answer</label>
          <input
            type="text"
            readOnly
            className="form-control"
            value={this.state.answer}
          />
        </div>
        <button className="btn btn-primary w-100" onClick={onSubmit}>
          Submit
        </button>
      </div>
    );
  }
}

export default AddNumbers;
