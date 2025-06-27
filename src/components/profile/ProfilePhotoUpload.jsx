import { useState, useCallback, useEffect } from "react";
import { Camera } from "lucide-react";
import Cropper from "react-easy-crop";
import CroppedImage from "../../utils/CroppedImage";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";
import { toast } from "react-toastify";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import Avatar from "../../assets/images/avatar.png";

const ProfilePhotoUpload = ({
  onPhotoChange = () => {},
  initialPhoto = "",
}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [photoURL, setPhotoURL] = useState(Avatar);

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
  }, [initialPhoto, onPhotoChange]);

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

    const user = auth.currentUser;
    if (user) {
      try {
        const userRef = doc(db, "Users", user.uid);
        await updateDoc(userRef, { photoURL: base64Image });
        toast.success("Profile photo updated successfully.");
      } catch (err) {
        console.error("Failed to save photo to Firestore:", err);
        toast.error("Failed to update profile photo.");
      }
    }
  };

  return (
    <>
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <img
            src={photoURL}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover shadow-md border-2 border-gray-200"
          />
          <label className="absolute bottom-0 right-0 bg-gray-900 text-white p-2 rounded-full cursor-pointer hover:bg-gray-700 transition-colors">
            <Camera size={16} />
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileChange}
            />
          </label>
        </div>
        <p className="text-sm text-gray-600">
          Click camera icon to change photo
        </p>
      </div>

      <Modal
        isOpen={cropModalOpen}
        onClose={() => setCropModalOpen(false)}
        title="Crop Profile Photo"
        size="lg"
      >
        <div className="space-y-4">
          <div className="relative aspect-square w-full bg-gray-100 rounded-lg overflow-hidden">
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

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Zoom</label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button size="sm"variant="secondary" onClick={() => setCropModalOpen(false)}>
              Close
            </Button>
            <Button size="sm" onClick={handleCropConfirm}>Save Photo</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProfilePhotoUpload;