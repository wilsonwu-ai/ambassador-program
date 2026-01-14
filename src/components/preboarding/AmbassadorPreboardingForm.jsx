import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";
import { FileUpload } from "@/components/ui/FileUpload";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { User, Mail, MapPin, Users, Link2, BarChart3, Upload, Sparkles } from "lucide-react";

const contentTypes = [
  { id: "ugc-brand", label: "UGC/Brand" },
  { id: "lifestyle-vlog", label: "Lifestyle/Vlog" },
  { id: "food", label: "Food" },
  { id: "beauty-fashion", label: "Beauty/Fashion" },
  { id: "other", label: "Other" },
];

export function AmbassadorPreboardingForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    contentTypes: [],
    otherContentType: "",
    socialMediaLinks: "",
    followerCount: "",
    analyticsFiles: [],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleContentTypeChange = (id) => {
    setFormData((prev) => {
      const newContentTypes = prev.contentTypes.includes(id)
        ? prev.contentTypes.filter((type) => type !== id)
        : [...prev.contentTypes, id];
      return { ...prev, contentTypes: newContentTypes };
    });
    if (errors.contentTypes) {
      setErrors((prev) => ({ ...prev, contentTypes: null }));
    }
  };

  const handleFileChange = (files) => {
    setFormData((prev) => ({
      ...prev,
      analyticsFiles: files,
    }));
    if (errors.analyticsFiles) {
      setErrors((prev) => ({ ...prev, analyticsFiles: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (formData.contentTypes.length === 0) {
      newErrors.contentTypes = "Please select at least one content type";
    }

    if (formData.contentTypes.includes("other") && !formData.otherContentType.trim()) {
      newErrors.otherContentType = "Please specify your content type";
    }

    if (!formData.socialMediaLinks.trim()) {
      newErrors.socialMediaLinks = "Please provide at least one social media link";
    }

    if (!formData.followerCount.trim()) {
      newErrors.followerCount = "Follower count is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Form submitted:", formData);
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto animate-fade-in">
        <CardContent className="py-16 text-center">
          <div className="w-16 h-16 rounded-full gradient-primary mx-auto mb-6 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
          <h3 className="text-2xl font-bold mb-3">Application Submitted!</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Thank you for applying to the Snappy Ambassador Program. We'll review your application and get back to you within 5-7 business days.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Personal Information */}
      <Card className="animate-fade-in">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Tell us about yourself</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Input
              id="name"
              label="Full Name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleInputChange("name")}
              error={errors.name}
            />
            <Input
              id="email"
              type="email"
              label="Email Address"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleInputChange("email")}
              error={errors.email}
            />
          </div>
          <Input
            id="location"
            label="Location"
            placeholder="City, Country"
            value={formData.location}
            onChange={handleInputChange("location")}
            error={errors.location}
          />
        </CardContent>
      </Card>

      {/* Content Type */}
      <Card className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle>Type of Content</CardTitle>
              <CardDescription>Select all content types that apply to you</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {contentTypes.map((type) => (
                <div
                  key={type.id}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                    formData.contentTypes.includes(type.id)
                      ? "border-primary bg-secondary/50"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => handleContentTypeChange(type.id)}
                >
                  <Checkbox
                    id={type.id}
                    label={type.label}
                    checked={formData.contentTypes.includes(type.id)}
                    onChange={() => handleContentTypeChange(type.id)}
                  />
                </div>
              ))}
            </div>

            {formData.contentTypes.includes("other") && (
              <div className="mt-4 animate-fade-in">
                <Input
                  id="otherContentType"
                  label="Please specify your content type"
                  placeholder="Describe your content type..."
                  value={formData.otherContentType}
                  onChange={handleInputChange("otherContentType")}
                  error={errors.otherContentType}
                />
              </div>
            )}

            {errors.contentTypes && (
              <p className="text-sm text-red-500 mt-2">{errors.contentTypes}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Social Media Information */}
      <Card className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <Link2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle>Social Media Accounts</CardTitle>
              <CardDescription>Share your main social media presence</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Textarea
            id="socialMediaLinks"
            label="Usernames/Links for your main social media accounts"
            placeholder={`YouTube: https://youtube.com/@yourchannel\nTikTok: @yourusername\nInstagram: @yourusername\nX (Twitter): @yourusername`}
            value={formData.socialMediaLinks}
            onChange={handleInputChange("socialMediaLinks")}
            error={errors.socialMediaLinks}
            className="min-h-[140px]"
          />
          <Input
            id="followerCount"
            label="What is your total follower count?"
            placeholder="e.g., 50,000 or 50K"
            value={formData.followerCount}
            onChange={handleInputChange("followerCount")}
            error={errors.followerCount}
          />
        </CardContent>
      </Card>

      {/* Analytics Upload */}
      <Card className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle>Analytics Screenshots</CardTitle>
              <CardDescription>
                Upload screenshots of your recent analytics (impressions, views, demographics) from your primary content platform
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <FileUpload
            id="analytics"
            onChange={handleFileChange}
            accept="image/*,.pdf"
            multiple={true}
            error={errors.analyticsFiles}
          />
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-center pt-4">
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="min-w-[200px]"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Submitting...
            </span>
          ) : (
            "Submit Application"
          )}
        </Button>
      </div>
    </form>
  );
}
