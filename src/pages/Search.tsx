import React, { useState, useEffect } from "react";
import { Post } from "../dtos/PostDto";
import { postService } from "../services/postService";
import { countryService } from "../services/countryService";
import { CountryDetail } from "../dtos/CountryDto";
import PostCard from "../components/PostCard";
import CountrySelect from "../components/CountrySelect";

const Search: React.FC = () => {
  const [country, setCountry] = useState("");
  const [author, setAuthor] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [countryDetail, setCountryDetail] = useState<CountryDetail | null>(
    null
  );
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  useEffect(() => {
    doSearch();
  }, []);

  const doSearch = async () => {
    try {
      const data = await postService.filterPosts({
        country,
        author,
        page: 1,
        limit: 10,
      });
      setPosts(data.posts);
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!country) {
      setCountryDetail(null);
      setDetailError(null);
      return;
    }
    setLoadingDetail(true);
    setDetailError(null);
    countryService
      .getCountryData(country)
      .then((d) => setCountryDetail(d))
      .catch((err) =>
        setDetailError(err.message || "Failed to load country data")
      )
      .finally(() => setLoadingDetail(false));
  }, [country]);

  return (
    <div
      className="search-page-wrapper"
      style={{ maxWidth: 1060, margin: "2rem auto", padding: "1rem" }}
    >
      <h3 className="mb-4 text-white">Search Posts</h3>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          doSearch();
        }}
        className="mb-4"
      >
        <div className="d-flex justify-content-center flex-wrap gap-4">
          <div className="mb-3 col-12 col-md-4">
            <label className="form-label text-white">Filter by Username</label>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Username"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-5 col-12 col-md-4">
            <label className="form-label text-white">Filter by Country</label>
            <div className="input-group">
              <CountrySelect value={country} onChange={setCountry} />
            </div>
          </div>
          <div className=" col-12 col-md-2 mt-4 pt-2">
            <button type="submit" className="btn custom-btn">
              Apply Filters
            </button>
          </div>
        </div>
      </form>

      {loadingDetail && <p className="text-center">Loading country info…</p>}
      {detailError && <p className="text-danger">{detailError}</p>}
      {countryDetail && (
        <div className="country-detail mb-4 p-3 rounded d-flex align-items-center justify-content-center">
          <img
            src={countryDetail.flag}
            alt={`${countryDetail.name} flag`}
            style={{
              width: 50,
              height: 30,
              objectFit: "cover",
              marginRight: "1rem",
            }}
          />
          <div>
            <p className="mb-1 text-white">
              <strong>Capital:</strong> {countryDetail.capital}{" "}
              &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; <strong>Currency:</strong>{" "}
              {countryDetail.currencies.join(", ")}{" "}
              &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; <strong>Languages:</strong>{" "}
              {countryDetail.languages.join(", ")}
            </p>
          </div>
        </div>
      )}

      {posts.length === 0 ? (
        <p className="text-center" style={{color: "#555"}}>No posts to show</p>
      ) : (
        <div className="d-flex flex-wrap">
          {posts.map((p) => (
            <div key={p.post_id} className="col-12 col-md-6">
              <PostCard post={p} isSearch={true} isProfile={false} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
