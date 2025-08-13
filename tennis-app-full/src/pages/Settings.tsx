import React, { useState, useRef, useEffect } from "react";
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Input, Label, Separator, Switch } from "../components/base";
import { ImageUpload } from "../components/ImageUpload";
import { ImageCropper } from "../components/ImageCropper";
import { Avatar } from "../components/Avatar";
import { useUser } from "../contexts/UserContext";

export function Settings() {
  const { user, updateUser } = useUser();
  const [formData, setFormData] = useState({
    firstName: user.name.split(' ')[0] || '',
    lastName: user.name.split(' ').slice(1).join(' ') || '',
    location: user.location,
    birthday: user.birthday,
    avatar: user.avatar || '',
    coverImage: user.coverImage || '',
  });
  
  const [showAvatarCropper, setShowAvatarCropper] = useState(false);
  const [showCoverCropper, setShowCoverCropper] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState<string>('');
  const [croppingType, setCroppingType] = useState<'avatar' | 'cover'>('avatar');
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isValidLocation, setIsValidLocation] = useState(true);
  
  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);

  const validateLocation = (location: string) => {
    // Basic validation: location should not be empty and should contain at least one letter
    return location.trim().length > 0 && /[a-zA-Z]/.test(location);
  };

  // Check if any data has been modified
  const hasChanges = 
    formData.firstName !== user.name.split(' ')[0] ||
    formData.lastName !== user.name.split(' ').slice(1).join(' ') ||
    formData.location !== user.location ||
    formData.birthday !== user.birthday ||
    formData.avatar !== user.avatar ||
    formData.coverImage !== user.coverImage;

  // Validate form before allowing save
  const canSave = validateLocation(formData.location) && 
    formData.firstName.trim().length > 0 && 
    formData.lastName.trim().length > 0;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    updateUser({
      ...formData,
      name: fullName
    });
  };

  const handleCancel = () => {
    setFormData({
      firstName: user.name.split(' ')[0] || '',
      lastName: user.name.split(' ').slice(1).join(' ') || '',
      location: user.location,
      birthday: user.birthday,
      avatar: user.avatar || '',
      coverImage: user.coverImage || '',
    });
  };

  const handleAvatarChange = (avatarUrl: string) => {
    setFormData(prev => ({ ...prev, avatar: avatarUrl }));
    updateUser({ avatar: avatarUrl });
  };

  const handleCoverImageChange = (coverImageUrl: string) => {
    setFormData(prev => ({ ...prev, coverImage: coverImageUrl }));
    updateUser({ coverImage: coverImageUrl });
  };

  const triggerAvatarUpload = () => {
    avatarFileInputRef.current?.click();
  };

  const triggerCoverUpload = () => {
    coverFileInputRef.current?.click();
  };

  const handleFileSelect = (file: File, type: 'avatar' | 'cover') => {
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (PNG, JPG, etc.)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image file size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const result = e.target?.result as string;
          if (result) {
            setTempImageSrc(result);
            setCroppingType(type);
            if (type === 'avatar') {
              setShowAvatarCropper(true);
            } else {
              setShowCoverCropper(true);
            }
          }
        } catch (error) {
          console.error('Error processing image:', error);
          alert('Error processing image. Please try again.');
        }
      };
      
      reader.onerror = () => {
        alert('Error reading file. Please try again.');
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error handling file selection:', error);
      alert('Error handling file. Please try again.');
    }
  };

  const handleCropComplete = (croppedImage: string) => {
    if (croppingType === 'avatar') {
      handleAvatarChange(croppedImage);
      // Update formData to trigger sticky footer
      setFormData(prev => ({ ...prev, avatar: croppedImage }));
      setShowAvatarCropper(false);
    } else {
      handleCoverImageChange(croppedImage);
      // Update formData to trigger sticky footer
      setFormData(prev => ({ ...prev, coverImage: croppedImage }));
      setShowCoverCropper(false);
    }
    setTempImageSrc('');
  };

  const handleCropCancel = () => {
    setShowAvatarCropper(false);
    setShowCoverCropper(false);
    setTempImageSrc('');
  };

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          
          // Use reverse geocoding to get city name
          fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
            .then(response => response.json())
            .then(data => {
              let location = '';
              if (data.city) {
                location = data.city;
                if (data.countryName) {
                  location += `, ${data.countryName}`;
                }
              } else if (data.locality) {
                location = data.locality;
                if (data.countryName) {
                  location += `, ${data.countryName}`;
                }
              } else {
                location = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
              }
              
              setFormData(prev => ({ ...prev, location }));
              setIsValidLocation(true);
            })
            .catch(error => {
              console.error('Error getting location name:', error);
              const location = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
              setFormData(prev => ({ ...prev, location }));
              setIsValidLocation(true);
            });
        },
        (error) => {
          console.error('Error detecting location:', error);
          let errorMessage = 'Failed to detect location. ';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += 'Please allow location access in your browser.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += 'Location information unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage += 'Location request timed out.';
              break;
            default:
              errorMessage += 'Please enter it manually.';
          }
          alert(errorMessage);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const searchLocation = async (query: string) => {
    if (query.length < 2) {
      setLocationSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/geocode-client?q=${encodeURIComponent(query)}&limit=5&localityLanguage=en`
      );
      const data = await response.json();
      
      if (data && Array.isArray(data)) {
        const suggestions = data.map((item: any) => {
          let location = '';
          if (item.city) {
            location = item.city;
            if (item.countryName) {
              location += `, ${item.countryName}`;
            }
          } else if (item.locality) {
            location = item.locality;
            if (item.countryName) {
              location += `, ${item.countryName}`;
            }
          } else if (item.countryName) {
            location = item.countryName;
          }
          return location;
        }).filter(Boolean);
        
        setLocationSuggestions(suggestions);
        setShowSuggestions(suggestions.length > 0);
      }
    } catch (error) {
      console.error('Error searching locations:', error);
      setLocationSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleLocationInputChange = (value: string) => {
    handleInputChange('location', value);
    setIsValidLocation(value.length > 0);
    
    // Debounce the search
    const timeoutId = setTimeout(() => {
      searchLocation(value);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  };

  const selectLocationSuggestion = (suggestion: string) => {
    setFormData(prev => ({ ...prev, location: suggestion }));
    setShowSuggestions(false);
    setIsValidLocation(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 pb-24">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Manage how others see you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Images Section */}
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Profile Images</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Upload a profile picture and cover image to personalize your profile
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Picture */}
                <div className="space-y-3">
                  <Label>Profile Picture</Label>
                  <ImageUpload
                    currentImage={user.avatar}
                    onImageSelect={triggerAvatarUpload}
                    onRemove={() => handleAvatarChange('')}
                    type="avatar"
                  />
                  <input
                    ref={avatarFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileSelect(file, 'avatar');
                      }
                    }}
                    className="hidden"
                  />
                </div>
                
                {/* Cover Image */}
                <div className="space-y-3">
                  <Label>Cover Image</Label>
                  <ImageUpload
                    currentImage={user.coverImage}
                    onImageSelect={triggerCoverUpload}
                    onRemove={() => handleCoverImageChange('')}
                    type="cover"
                  />
                  <input
                    ref={coverFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileSelect(file, 'cover');
                      }
                    }}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Profile Information Section */}
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Profile Information</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Update your personal details and contact information
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input
                    value={formData.firstName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('firstName', e.target.value)}
                    placeholder="Enter your first name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input
                    value={formData.lastName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('lastName', e.target.value)}
                    placeholder="Enter your last name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Location</Label>
                  <div className="flex gap-2">
                    <Input
                      value={formData.location}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleLocationInputChange(e.target.value)}
                      placeholder="Enter your location"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleDetectLocation}
                      className="px-3"
                      title="Detect current location"
                    >
                      📍
                    </Button>
                  </div>
                  {showSuggestions && (
                    <div className="mt-2 p-2 bg-gray-100 rounded-md">
                      {locationSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="cursor-pointer hover:bg-gray-200 p-1 rounded-sm"
                          onClick={() => selectLocationSuggestion(suggestion)}
                        >
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  )}
                  {!isValidLocation && (
                    <p className="text-xs text-red-500 mt-1">
                      Please enter a valid location.
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>Birthday</Label>
                  <Input
                    value={formData.birthday}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('birthday', e.target.value)}
                    type="date"
                  />
                  {formData.birthday && (
                    <p className="text-xs text-muted-foreground">
                      Age: {user.age} years old
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Privacy Settings Section */}
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Privacy & Preferences</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Control your profile visibility and notification preferences
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Show profile in search</div>
                    <div className="text-xs text-muted-foreground">Let others request matches</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Notifications</div>
                    <div className="text-xs text-muted-foreground">Match requests and event reminders</div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Connected accounts</CardTitle>
            <CardDescription>Link ranking providers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: "UTR", status: "Connected" },
              { name: "USTA", status: "Connect" },
              { name: "NSL", status: "Connect" },
            ].map((s) => (
              <div key={s.name} className="flex items-center justify-between rounded-lg border p-3">
                <div className="text-sm font-medium">{s.name}</div>
                <Button size="sm" variant={s.status === "Connected" ? "secondary" : "default"}>
                  {s.status}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Image Cropper Modals */}
        {showAvatarCropper && tempImageSrc && (
          <ImageCropper
            imageSrc={tempImageSrc}
            onCropComplete={handleCropComplete}
            onCancel={handleCropCancel}
            aspectRatio={1} // Square for avatar
            cropType="avatar"
          />
        )}

        {showCoverCropper && tempImageSrc && (
          <ImageCropper
            imageSrc={tempImageSrc}
            onCropComplete={handleCropComplete}
            onCancel={handleCropCancel}
            aspectRatio={2.4} // Wide format for cover (600x250)
            cropType="cover"
          />
        )}
      </div>

      {/* Sticky Bottom Bar */}
      {hasChanges && (
        <div className="fixed bottom-0 md:left-[280px] left-0 right-0 bg-white border-t shadow-lg z-40">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">
                  You have unsaved changes
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                  className="px-6"
                >
                  Cancel
                </Button>
                                 <Button
                   onClick={handleSave}
                   className="px-6"
                   disabled={!canSave}
                 >
                   Save Changes
                 </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
