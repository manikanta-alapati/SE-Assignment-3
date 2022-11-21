import React from "react";
import Apis from "./Apis";
import Loader from "./Loader";
import NewsArticle from "./NewsArticle";

class NewsArticleList extends React.Component {
  state = {
    newsArticles: [],
    isLoading: false,
  };
  componentDidMount() {
    this.setState({ isLoading: true });
    Apis.getNewsArticles()
      .then((response) => {
        this.setState({ newsArticles: response.data.value });
      })
      .catch((err) => console.error(err))
      .finally(() => this.setState({ isLoading: false }));
  }
  render() {
    return (
      <div>
        {this.state.isLoading ? (
          <Loader />
        ) : (
          this.state.newsArticles.map(({ name, description, image, url }) => (
            <div key={name} className="mb-4">
              <NewsArticle
                name={name}
                description={description}
                imageUrl={image?.thumbnail?.contentUrl}
                url={url}
              />
            </div>
          ))
        )}
      </div>
    );
  }
}

export default NewsArticleList;
