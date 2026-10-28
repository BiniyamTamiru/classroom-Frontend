import React from 'react'
import { useShow } from "@refinedev/core";
import { classes } from "@/types";
import { ShowView, ShowViewHeader } from "@/components/refine-ui/views/show-view.tsx";
import { Card } from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { bannerPhoto } from "@/lib/cloudinary";

const ClassShow = () => {
    const { query } = useShow<classes>({ resource: 'classes' });

    const classDetails = query.data?.data;
    const { isLoading, isError } = query;

    if (isLoading || isError || !classDetails) {
        return (
            <ShowView className="class-view class-show">
                <ShowViewHeader resource="classes" title="Class Details" />
                <p className="state-message">
                    {isLoading ? 'Loading Class detail ...'
                        : isError ? 'failed to load class details.' : 'class-details not found'
                    }
                </p>
            </ShowView>
        );
    }

    const teacherObj = typeof classDetails.teacher === 'object' && classDetails.teacher !== null
        ? (classDetails.teacher as { name?: string; email?: string; image?: string })
        : null;

    const teacherName = teacherObj?.name ?? 'unknown';
    const teacherInitials = teacherName && typeof teacherName === 'string'
        ? teacherName
            .split('')
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase())
            .join('')
        : 'NA';

    const placeholderUrl = `http://placehold.co/600x400?text=${encodeURIComponent(teacherInitials)}`;

    const {
        name,
        description,
        status,
        capacity,
        subject,
        department,
        bannerUrl,
        bannerCldPubId
    } = classDetails;

    return (
        <ShowView className="class-view class-show">
            <ShowViewHeader resource="classes" title="Class Details" />

            <div className="banner mb-6 rounded-lg overflow-hidden border">
                {bannerUrl && bannerCldPubId ? (
                    <img
                        src={bannerPhoto(bannerCldPubId, name)}
                        alt="Class Banner"
                        className="w-full h-48 md:h-64 object-cover"
                    />
                ) : (
                    <div className="placeholder w-full h-48 bg-muted flex items-center justify-center text-muted-foreground">
                        No banner available
                    </div>
                )}
            </div>

            <Card className="detail-card p-6">
                {/* Header Section */}
                <div className="details-header flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">{name}</h1>
                        <p className="text-muted-foreground text-sm mt-1">{description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline">{capacity} spots</Badge>
                        <Badge
                            variant={status === 'active' ? 'default' : 'secondary'}
                            data-status={status}
                        >
                            {status?.toUpperCase()}
                        </Badge>
                    </div>
                </div>

                {/* Grid Layout for Instructor and Department side-by-side */}
                <div className="details-grid grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                    <div className="instructor">
                        <p className="section-label text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">INSTRUCTOR</p>
                        <div className="instructor-info flex items-center gap-3">
                            <img
                                src={teacherObj?.image ?? placeholderUrl}
                                alt={teacherName}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                                <p className="teacher-name font-medium">{teacherName}</p>
                                <p className="teacher-email text-xs text-muted-foreground">{teacherObj?.email}</p>
                            </div>
                        </div>
                    </div>

                    <div className="department">
                        <p className="section-label text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">DEPARTMENT</p>
                        <div>
                            <p className="dept-name font-medium text-primary">{department?.name}</p>
                            <p className="dept-desc text-xs text-muted-foreground mt-1">{department?.description}</p>
                        </div>
                    </div>
                </div>

                <Separator className="my-6" />

                {/* Subject Section */}
                <div className="subject-section mb-6">
                    <p className="section-label text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">SUBJECT</p>
                    <div className="subject-code-badge mb-2">
                        <Badge variant="outline">Code: {subject?.code}</Badge>
                    </div>
                    <h3 className="subject-name font-semibold text-lg text-primary">{subject?.name}</h3>
                    <p className="subject-desc text-sm text-muted-foreground mt-1">{subject?.description}</p>
                </div>

                <Separator className="my-6" />

                {/* Join Class Section */}
                <div className="join-section mb-6">
                    <h2 className="join-title text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">JOIN CLASS</h2>
                    <ol className="join-steps list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Ask your teacher for the invite code</li>
                        <li>Click on "Join Class" button</li>
                        <li>Paste the code and click "join"</li>
                    </ol>
                </div>

                <Button size="lg" className="w-full">Join Class</Button>
            </Card>
        </ShowView>
    );
};

export default ClassShow;