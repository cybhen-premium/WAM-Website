"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ImageIcon, UploadCloud, Search, Copy, Check, Trash2, 
  Eye, RefreshCw, X, FolderCheck, HardDrive, Filter, AlertCircle 
} from "lucide-react";
import styles from "./Media.module.css";
import Sidebar from "@/components/Sidebar";

interface MediaItem {
  name: string;
  url: string;
  size: string;
  sizeBytes: number;
  modified: string;
  folder: "assets" | "uploads";
  category: string;
}

export default function MediaManager() {
  const [images, setImages] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeModalImage, setActiveModalImage] = useState<MediaItem | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      if (data.images) {
        setImages(data.images);
      }
    } catch (err) {
      console.error("Failed to fetch media:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    showNotification(`Copied: ${url}`);
    setTimeout(() => {
      setCopiedUrl(null);
    }, 2000);
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (result.success) {
        showNotification(`Uploaded ${result.count} image${result.count > 1 ? "s" : ""} successfully!`);
        await fetchMedia();
      } else {
        alert(result.error || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("An error occurred during upload.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteImage = async (url: string) => {
    if (!confirm(`Are you sure you want to delete ${url}? This cannot be undone.`)) return;

    try {
      const res = await fetch("/api/admin/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const result = await res.json();
      if (result.success) {
        showNotification("Image deleted successfully.");
        setImages((prev) => prev.filter((img) => img.url !== url));
        if (activeModalImage?.url === url) setActiveModalImage(null);
      } else {
        alert(result.error || "Delete failed");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete image.");
    }
  };

  // Drag and Drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  // Filter images
  const filteredImages = images.filter((img) => {
    const matchesSearch = img.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          img.url.toLowerCase().includes(searchQuery.toLowerCase());
    if (selectedCategory === "all") return matchesSearch;
    if (selectedCategory === "Uploads") return matchesSearch && img.folder === "uploads";
    return matchesSearch && img.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const uploadsCount = images.filter((i) => i.folder === "uploads").length;
  const assetsCount = images.filter((i) => i.folder === "assets").length;

  return (
    <div className={styles.layout}>
      <Sidebar />

      <main className={styles.mainContent}>
        {/* Top Header */}
        <div className={styles.topBar}>
          <div className={styles.pageHeader}>
            <h1>Media & Image Library</h1>
            <p>Upload, browse, copy URLs, and manage site imagery for sermons, events, and ministries.</p>
          </div>

          <div className={styles.topActions}>
            <button 
              className={styles.uploadTriggerBtn} 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <UploadCloud size={18} />
              {uploading ? "Uploading..." : "Upload New Images"}
            </button>
            <button 
              onClick={fetchMedia} 
              className={styles.uploadTriggerBtn} 
              style={{ background: "rgba(255,255,255,0.08)", color: "#cbd5e1" }}
              title="Refresh Media List"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        <div className={styles.contentContainer}>
          {/* Notification Toast */}
          {notification && (
            <div style={{
              position: "fixed",
              bottom: "2rem",
              right: "2rem",
              background: "#2563eb",
              color: "#ffffff",
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
              zIndex: 100,
              fontSize: "0.9rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}>
              <Check size={16} />
              {notification}
            </div>
          )}

          {/* Stats Ribbon */}
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}><ImageIcon size={22} /></div>
              <div>
                <h4>{images.length}</h4>
                <p>Total Media Files</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
                <UploadCloud size={22} />
              </div>
              <div>
                <h4>{uploadsCount}</h4>
                <p>Custom Uploads</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: "rgba(148, 163, 184, 0.15)", color: "#94a3b8" }}>
                <FolderCheck size={22} />
              </div>
              <div>
                <h4>{assetsCount}</h4>
                <p>System Assets</p>
              </div>
            </div>
          </div>

          {/* Drag & Drop Upload Zone */}
          <div 
            className={`${styles.dropzone} ${dragActive ? styles.active : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              multiple 
              accept="image/*"
              className={styles.fileInput} 
              onChange={(e) => handleFileUpload(e.target.files)}
            />

            <div className={styles.dropzoneContent}>
              <div className={styles.dropIcon}>
                <UploadCloud size={26} />
              </div>
              <h3>{uploading ? "Uploading files to server..." : "Click or drag & drop images here to upload"}</h3>
              <p>Supports PNG, JPG, JPEG, WEBP, GIF, SVG up to 10MB each</p>
              <span className={styles.fileHints}>Uploaded images are automatically saved to /public/uploads/ and ready to use anywhere on the website.</span>
            </div>
          </div>

          {/* Filter & Search Controls */}
          <div className={styles.filterBar}>
            <div className={styles.tabs}>
              {["all", "Uploads", "Services", "Leadership", "Ministries", "Branding", "General"].map((cat) => (
                <button
                  key={cat}
                  className={`${styles.tabBtn} ${selectedCategory === cat ? styles.activeTab : ""}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat === "all" ? "All Media" : cat}
                </button>
              ))}
            </div>

            <div className={styles.searchBox}>
              <Search size={16} className={styles.searchIcon} />
              <input 
                type="text" 
                placeholder="Search images by name..." 
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Gallery Grid */}
          <div className={styles.galleryGrid}>
            {loading ? (
              <div className={styles.emptyState}>
                <RefreshCw size={28} className="animate-spin" style={{ margin: "0 auto 1rem auto" }} />
                <h3>Loading Media Gallery...</h3>
              </div>
            ) : filteredImages.length === 0 ? (
              <div className={styles.emptyState}>
                <ImageIcon size={36} style={{ margin: "0 auto 1rem auto", opacity: 0.5 }} />
                <h3>No images found</h3>
                <p>Try clearing your search query or uploading new images.</p>
              </div>
            ) : (
              filteredImages.map((img) => {
                const isCopied = copiedUrl === img.url;
                return (
                  <div key={img.url} className={styles.imageCard}>
                    <div className={styles.thumbContainer}>
                      <span className={`${styles.thumbBadge} ${img.folder === "uploads" ? styles.badgeUpload : styles.badgeAsset}`}>
                        {img.folder === "uploads" ? "Upload" : img.category}
                      </span>

                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={img.url} 
                        alt={img.name} 
                        className={styles.thumbImg} 
                        style={{ width: "100%", height: "100%" }}
                        loading="lazy"
                      />

                      {/* Quick Hover Overlay */}
                      <div className={styles.thumbOverlay}>
                        <button 
                          className={styles.overlayBtn} 
                          onClick={() => setActiveModalImage(img)}
                          title="Preview full size"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          className={styles.overlayBtn} 
                          onClick={() => handleCopyUrl(img.url)}
                          title="Copy image URL"
                        >
                          {isCopied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                        </button>
                        {img.folder === "uploads" && (
                          <button 
                            className={styles.overlayBtn} 
                            onClick={() => handleDeleteImage(img.url)}
                            title="Delete upload"
                            style={{ color: "#ef4444" }}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className={styles.cardBody}>
                      <h4 className={styles.fileName} title={img.name}>{img.name}</h4>
                      <div className={styles.fileMeta}>
                        <span>{img.size}</span>
                        <span>{new Date(img.modified).toLocaleDateString()}</span>
                      </div>

                      <button 
                        className={`${styles.copyUrlBtn} ${isCopied ? styles.copied : ""}`}
                        onClick={() => handleCopyUrl(img.url)}
                      >
                        {isCopied ? (
                          <>
                            <Check size={13} />
                            <span>URL Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={13} />
                            <span>Copy URL</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Full Preview Lightbox Modal */}
        {activeModalImage && (
          <div className={styles.modalBackdrop} onClick={() => setActiveModalImage(null)}>
            <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3>Image Details & Usage</h3>
                <button className={styles.closeBtn} onClick={() => setActiveModalImage(null)}>
                  <X size={20} />
                </button>
              </div>

              <div className={styles.modalBody}>
                <div className={styles.previewContainer}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={activeModalImage.url} 
                    alt={activeModalImage.name} 
                    className={styles.previewImg} 
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>

                <div className={styles.modalDetails}>
                  <div className={styles.detailRow}>
                    <label>File Name</label>
                    <div style={{ color: "#ffffff", fontWeight: 600 }}>{activeModalImage.name}</div>
                  </div>

                  <div className={styles.detailRow}>
                    <label>File Size & Location</label>
                    <div style={{ color: "#94a3b8" }}>{activeModalImage.size} · Folder: {activeModalImage.folder}</div>
                  </div>

                  <div className={styles.detailRow}>
                    <label>Direct Image URL (Copy & Paste)</label>
                    <div className={styles.codeBox}>
                      <code>{activeModalImage.url}</code>
                      <button 
                        className={styles.miniCopyBtn} 
                        onClick={() => handleCopyUrl(activeModalImage.url)}
                        title="Copy URL"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>

                  <div className={styles.detailRow}>
                    <label>Next.js Image Code</label>
                    <div className={styles.codeBox}>
                      <code>{`<Image src="${activeModalImage.url}" alt="${activeModalImage.name}" fill />`}</code>
                      <button 
                        className={styles.miniCopyBtn} 
                        onClick={() => handleCopyUrl(`<Image src="${activeModalImage.url}" alt="${activeModalImage.name}" fill />`)}
                        title="Copy Code"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>

                  {activeModalImage.folder === "uploads" && (
                    <div style={{ marginTop: "1rem" }}>
                      <button 
                        onClick={() => handleDeleteImage(activeModalImage.url)}
                        style={{
                          background: "rgba(239, 68, 68, 0.15)",
                          color: "#ef4444",
                          border: "1px solid rgba(239, 68, 68, 0.3)",
                          borderRadius: "6px",
                          padding: "0.5rem 1rem",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.4rem"
                        }}
                      >
                        <Trash2 size={15} />
                        Delete Uploaded Image
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
