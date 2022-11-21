import axios from "axios";

class Apis {
  static rapidApiOptions = {
    method: "GET",
    url: process.env.REACT_APP_RAPID_API_URL,
    params: { safeSearch: "Off", textFormat: "Raw" },
    headers: {
      "X-BingApis-SDK": "true",
      "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
      "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
    },
  };
  static getNewsArticles() {
    return axios.request(this.rapidApiOptions);
  }
  static postAddNumbers(firstInput, secondInput) {
    console.log("inputs", firstInput, secondInput);
    return axios.request({
      method: "POST",
      url: `${process.env.REACT_APP_EXPRESS_URL}/add`,
      data: {
        firstInput,
        secondInput,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

export default Apis;
