"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import NativeSelect from "@/components/ui/native-select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { useCreateIncident, useUpdateMyIncident } from "@/hooks";
import { humanize } from "@/lib/format";
import { getErrorMessage } from "@/lib/utils";
import type {
  CreateIncidentPayload,
  IncidentCategory,
  MyIncident,
} from "@/types";
import { incidentCreateSchema, incidentUpdateSchema } from "@/validation";

const categories: IncidentCategory[] = [
  "HARASSMENT",
  "THEFT",
  "SUSPICIOUS_ACTIVITY",
  "UNSAFE_AREA",
  "OTHER",
];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export default function IncidentForm({ incident }: { incident?: MyIncident }) {
  const router = useRouter();
  const isEditing = Boolean(incident);

  const [title, setTitle] = useState(incident?.title ?? "");
  const [description, setDescription] = useState(incident?.description ?? "");
  const [category, setCategory] = useState<IncidentCategory>(
    incident?.category ?? "HARASSMENT",
  );
  const [area, setArea] = useState(incident?.area ?? "");
  const [location, setLocation] = useState(incident?.location ?? "");
  const [latitude, setLatitude] = useState(
    incident?.latitude != null ? String(incident.latitude) : "",
  );
  const [longitude, setLongitude] = useState(
    incident?.longitude != null ? String(incident.longitude) : "",
  );
  const [incidentDate, setIncidentDate] = useState(
    incident?.incidentDate.slice(0, 10) ?? "",
  );
  const [image, setImage] = useState<File | undefined>();

  const createIncident = useCreateIncident();
  const updateIncident = useUpdateMyIncident();

  const isPending = createIncident.isPending || updateIncident.isPending;

  const handleImageChange = (file: File | undefined) => {
    if (!file) {
      setImage(undefined);
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.add({
        title: "Invalid file",
        description: "Please choose an image file.",
        type: "error",
      });
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.add({
        title: "Image too large",
        description: "The image must be 5 MB or smaller.",
        type: "error",
      });
      return;
    }

    setImage(file);
  };

  const handleSubmit = () => {
    const payload: CreateIncidentPayload = {
      title,
      description,
      category,
      area,
      location: location.trim() || undefined,
      latitude: latitude.trim() ? Number(latitude) : undefined,
      longitude: longitude.trim() ? Number(longitude) : undefined,
      incidentDate,
    };

    const result = isEditing
      ? incidentUpdateSchema.safeParse(payload)
      : incidentCreateSchema.safeParse(payload);

    if (!result.success) {
      toast.add({
        title: "Check your report",
        description: result.error.issues[0]?.message,
        type: "error",
      });
      return;
    }

    if (incident) {
      updateIncident.mutate(
        { incidentId: incident.id, payload: result.data, image },
        {
          onSuccess: () => {
            setImage(undefined);
            toast.add({
              title: "Report updated",
              description: "Your incident report has been updated.",
              type: "success",
            });
          },
          onError: (error) => {
            toast.add({
              title: "Update failed",
              description: getErrorMessage(error),
              type: "error",
            });
          },
        },
      );
      return;
    }

    createIncident.mutate(
      { payload: result.data as CreateIncidentPayload, image },
      {
        onSuccess: (response) => {
          toast.add({
            title: "Report submitted",
            description:
              "Your incident is pending review. You can edit it until it is reviewed.",
            type: "success",
          });
          const incidentId = response.data?.id;
          router.push(
            incidentId
              ? `/dashboard/incidents/${incidentId}`
              : "/dashboard/incidents",
          );
        },
        onError: (error) => {
          toast.add({
            title: "Submission failed",
            description: getErrorMessage(error),
            type: "error",
          });
        },
      },
    );
  };

  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" htmlFor="incident-title">
            Title
          </label>
          <Input
            id="incident-title"
            placeholder="What happened?"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" htmlFor="incident-description">
            Description
          </label>
          <Textarea
            id="incident-description"
            placeholder="Describe the incident and any details that could help others."
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" htmlFor="incident-category">
              Category
            </label>
            <NativeSelect
              id="incident-category"
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as IncidentCategory)
              }
            >
              {categories.map((option) => (
                <option key={option} value={option}>
                  {humanize(option)}
                </option>
              ))}
            </NativeSelect>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" htmlFor="incident-date">
              Incident date
            </label>
            <Input
              id="incident-date"
              type="date"
              value={incidentDate}
              onChange={(event) => setIncidentDate(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" htmlFor="incident-area">
              Area
            </label>
            <Input
              id="incident-area"
              placeholder="Neighbourhood or district"
              value={area}
              onChange={(event) => setArea(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" htmlFor="incident-location">
              Location
            </label>
            <Input
              id="incident-location"
              placeholder="Street, landmark, or address"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" htmlFor="incident-latitude">
              Latitude
            </label>
            <Input
              id="incident-latitude"
              type="number"
              step="any"
              placeholder="Optional"
              value={latitude}
              onChange={(event) => setLatitude(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" htmlFor="incident-longitude">
              Longitude
            </label>
            <Input
              id="incident-longitude"
              type="number"
              step="any"
              placeholder="Optional"
              value={longitude}
              onChange={(event) => setLongitude(event.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" htmlFor="incident-image">
            Image
          </label>
          <Input
            id="incident-image"
            type="file"
            accept="image/*"
            onChange={(event) => handleImageChange(event.target.files?.[0])}
          />
          <p className="text-xs text-muted-foreground">
            Optional, up to 5 MB.
            {isEditing && incident?.imageUrl
              ? " Choosing a new image replaces the current one."
              : ""}
          </p>
        </div>

        <div>
          <Button type="button" disabled={isPending} onClick={handleSubmit}>
            {isPending ? (
              <>
                <Spinner />
                {isEditing ? "Saving..." : "Submitting..."}
              </>
            ) : isEditing ? (
              "Save report"
            ) : (
              "Submit report"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
