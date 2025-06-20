import { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import CroppedImage from "../../utils/CroppedImage";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";
import { toast } from "react-toastify";

function ProfilePhotoUpload({ onPhotoChange = () => {}, initialPhoto = "" }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [photoURL, setPhotoURL] = useState("");

  // Set the initial photo when component mounts or prop changes
  useEffect(() => {
    if (initialPhoto) {
      setPhotoURL(initialPhoto);
      onPhotoChange(initialPhoto);
    } else {
      const stored = localStorage.getItem("profilePhoto");
      if (stored) {
        setPhotoURL(stored);
        onPhotoChange(stored);
      }
    }
  }, [initialPhoto]);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropConfirm = async () => {
    const base64Image = await CroppedImage(imageSrc, croppedAreaPixels, zoom);
    setPhotoURL(base64Image);
    localStorage.setItem("profilePhoto", base64Image);
    onPhotoChange(base64Image);
    setCropModalOpen(false);

    // Save base64 to Firestore if logged in
    const user = auth.currentUser;
    if (user) {
      try {
        const userRef = doc(db, "Users", user.uid);
        await updateDoc(userRef, { photoURL: base64Image });
        console.log("Base64 profile photo saved to Firestore.");
        toast.success("Profile photo updated successfully.");
      } catch (err) {
        console.error("Failed to save photo to Firestore:", err);
        toast.error("Failed to update profile photo.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <img
        src={photoURL || "https://via.placeholder.com/150"}
        alt="Profile"
        className="w-20 h-20 rounded-full object-cover shadow"
      />
      <label className="text-xs text-blue-600 cursor-pointer hover:underline">
        Change Photo
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={handleFileChange}
        />
      </label>

      {cropModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg max-w-lg w-full">
            <div className="relative aspect-square w-full bg-gray-100">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setCropModalOpen(false)}
                className="px-4 py-1 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleCropConfirm}
                className="px-4 py-1 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePhotoUpload;
