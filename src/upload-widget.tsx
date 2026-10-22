import React, { useEffect, useRef, useState } from 'react';
import { UploadCloud } from "lucide-react";
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "@/components/constant";

export interface UploadWidgetValue {
    url: string;
    publicId: string;
}

interface UploadWidgetProps {
    value?: UploadWidgetValue | null;
    onChange?: (file: UploadWidgetValue | null) => void;
    disabled?: boolean;

}

const UploadWidget = ({ value = null, onChange, disabled = false }: UploadWidgetProps) => {
    const widgetRef = useRef<any>(null);
    const onChangeRef = useRef(onChange);

    const [preview, setPreview] = useState<UploadWidgetValue | null>(value);
    const [deleteToken, setDeleteToken] = useState<string | null>(null);
    const [isRemoving, setIsRemoving] = useState(false);

    useEffect(() => {
        setPreview(value);
        if (!value) setDeleteToken(null);
    }, [value]);

    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const initializeWidget = () => {
            const cloudinary = (window as any).cloudinary;
            if (!cloudinary || widgetRef.current) return false;

            widgetRef.current = cloudinary.createUploadWidget(
                {
                    cloudName: CLOUDINARY_CLOUD_NAME,
                    uploadPreset: CLOUDINARY_UPLOAD_PRESET,
                    multiple: false,
                    folder: 'uploads',
                    maxFileSize: 5000000,
                    clientAllowedFormats: ['png', 'jpg', 'jpeg','webp'],
                },
                (error: any, result: any) => {
                    if (!error && result && result.event === 'success') {
                        const payload: UploadWidgetValue = {
                            url: result.info.secure_url,
                            publicId: result.info.public_id,
                        };
                        setDeleteToken(result.info.delete_token ?? null);
                        setPreview(payload);
                        onChangeRef.current?.(payload);
                    }
                }
            );

            return true;
        };

        if (initializeWidget()) return;

        const intervalId = window.setInterval(() => {
            if (initializeWidget()) {
                window.clearInterval(intervalId);
            }
        }, 500);

        return () => window.clearInterval(intervalId);
    }, []);

    const openWidget = () => {
        if (!disabled) widgetRef.current?.open();
    };

    const removeFromCloudinary = async () => {
        if (isRemoving) return;
        setIsRemoving(true);
        try {
            if (deleteToken) {
                await fetch(
                    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/delete_by_token`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ token: deleteToken }),
                    }
                );
            }
        } catch (error) {
            console.log("error removing image from cloudinary", error);
        } finally {
            setPreview(null);
            setDeleteToken(null);
            onChangeRef.current?.(null);
            setIsRemoving(false);
        }
    };

    return (
        <div className="space-y-2">
            {preview ? (
                <div className="upload-preview">
                    <img src={preview.url} alt="uploaded file" />
                    <button
                        type="button"
                        onClick={removeFromCloudinary}
                        disabled={isRemoving || disabled}
                    >
                        {isRemoving ? "Removing..." : "Remove"}
                    </button>
                </div>
            ) : (
                <div
                    className="upload-dropzone"
                    role="button"
                    tabIndex={0}
                    onClick={openWidget}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            event.preventDefault();
                            openWidget();
                        }
                    }}
                >
                    <div className="upload-prompt">
                        <UploadCloud className="icon" />
                        <div>
                            <p>Click to upload photo</p>
                            <p>PNG,JPG up to 5MB </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UploadWidget;