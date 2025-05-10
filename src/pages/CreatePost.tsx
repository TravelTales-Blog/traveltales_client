import React, { useState, useEffect } from "react";
import { Post } from "../dtos/PostDto";
import { useAuth } from "../context/AuthContext";
import CountrySelect from "../components/CountrySelect";
import { countryService } from "../services/countryService";
import type { CountryDetail } from "../dtos/CountryDto";
import { imageService } from "../services/imageUploadService";
import { postService } from "../services/postService";

interface Props {
  show: boolean;
  onClose: () => void;
  onCreated?: (newPost: Post) => void;
  postToEdit?: Post;
  onUpdated?: (updated: Post) => void;
}

const CreatePostModal: React.FC<Props> = ({
  show,
  onClose,
  onCreated,
  postToEdit,
  onUpdated,
}) => {
  const { userId } = useAuth();
  const isEditing = Boolean(postToEdit);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [country, setCountry] = useState("");
  const [visitDate, setVisitDate] = useState<Date>(new Date());
  const [file, setFile] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState(
    postToEdit?.image_url || ""
  );

  const [countryDetail, setCountryDetail] = useState<CountryDetail | null>(
    null
  );
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  useEffect(() => {
    if (postToEdit) {
      setTitle(postToEdit.title);
      setContent(postToEdit.content);
      setCountry(postToEdit.country);
      setVisitDate(new Date(postToEdit.visit_date));
      setExistingImage(postToEdit.image_url);
    } else {
      setTitle("");
      setContent("");
      setCountry("");
      setVisitDate(new Date());
      setExistingImage("");
      setFile(null);
    }
  }, [postToEdit, show]);

  useEffect(() => {
    if (!country) {
      setCountryDetail(null);
      setDetailError(null);
      return;
    }
    setLoadingDetail(true);
    countryService
      .getCountryData(country)
      .then(setCountryDetail)
      .catch((e) => setDetailError(e.message || "Failed to load data"))
      .finally(() => setLoadingDetail(false));
  }, [country]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    try {
      let imageUrl = existingImage;
      if (file) {
        imageUrl = await imageService.uploadImage(file);
      }

      const payload: Post = {
        user_id: userId,
        title,
        content,
        country,
        visit_date: visitDate.toISOString(),
        image_url: imageUrl,
        ...(isEditing && { post_id: postToEdit!.post_id }),
        username: "",
        created_at: "",
      };

      if (isEditing) {
        const updated = await postService.updatePost(payload);
        onUpdated?.(updated);
      } else {
        const created = await postService.createPost(payload);
        onCreated?.(created);
      }

      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error saving post");
    }
  };

  if (!show) return null;
  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50
                  d-flex justify-content-center align-items-center"
      style={{ zIndex: 2000 }}
    >
      <div
        className="p-5"
        style={{ width: 600, backgroundColor: "#000", borderRadius: "20px" }}
      >
        <div className="d-flex justify-content-between">
          <h5 className="text-white">{isEditing ? "Edit Post" : "Create Post"}</h5>
          <button
            className="btn-close "
            style={{ filter: "invert(1)" }}
            onClick={onClose}
          />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-white">Title</label>
            <input
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-white">Content</label>
            <textarea
              className="form-control"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-white">Country</label>
            <CountrySelect value={country} onChange={setCountry} />
          </div>

          {loadingDetail && <p>Loading country details…</p>}
          {detailError && <p className="text-danger">{detailError}</p>}
          {countryDetail && (
            <div className="mb-3 p-2 border rounded d-flex justify-content-center align-items-center">
              <img
                src={countryDetail.flag}
                alt={`${countryDetail.name} flag`}
                style={{ width: 45, height: 24 }}
                className="mx-4"
              />
              <div>
                <p className="mb-1 text-white">
                  <strong>Capital:</strong> {countryDetail.capital}{" "}
                  &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;{" "}
                  <strong>Currency:</strong>{" "}
                  {countryDetail.currencies.join(", ")}{" "}
                  &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;{" "}
                  <strong>Languages:</strong>{" "}
                  {countryDetail.languages.join(", ")}
                </p>
              </div>
            </div>
          )}

          <div className="mb-3">
            <label className="form-label text-white">Visit Date</label>
            <input
              type="date"
              className="form-control"
              value={visitDate ? visitDate.toISOString().slice(0, 10) : ""}
              onChange={(e) => setVisitDate(new Date(e.target.value))}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-white">Image</label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={(e) =>
                setFile(e.target.files ? e.target.files[0] : null)
              }
            />
          </div>

          <button type="submit" className="btn w-100" style={{backgroundColor: "blue", color: "#fff"}}>
            {isEditing ? "Save Changes" : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
