import { CreateView } from "@/components/refine-ui/views/create-view";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { useBack, type HttpError, useList } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { classSchema } from "@/lib/schema";
import type { Subject, User } from "@/types";
import UploadWidget, { type UploadWidgetValue } from "@/upload-widget";

type ClassFormValues = z.infer<typeof classSchema>;

const ClassCreate = () => {
    const back = useBack();

    const { query: subjectsQuery } = useList<Subject>({
        resource: "subjects",
        pagination: { pageSize: 100 },
        queryOptions: { staleTime: 300000 },
    });

    const { query: teacherQuery } = useList<User>({
        resource: "users",
        filters: [{ field: "role", operator: "eq", value: "teacher" }],
        pagination: { pageSize: 100 },
        queryOptions: { staleTime: 300000 },
    });

    const subjects = subjectsQuery?.data?.data || [];
    const subjectLoading = subjectsQuery.isLoading;

    const teachers = teacherQuery?.data?.data || [];
    const teacherLoading = teacherQuery.isLoading;

    const form = useForm<ClassFormValues, HttpError, ClassFormValues>({
        resolver: zodResolver(classSchema),
        refineCoreProps: {
            resource: "classes",
            action: "create",
        },
        defaultValues: {
            name: "",
            description: "",
            status: "active",
            bannerUrl: "",
            bannerCldPubId: "",
            capacity: 30,
        },
    });

    const {
        control,
        handleSubmit,
        refineCore: { onFinish },
        formState: { isSubmitting, errors },
    } = form;

    const bannerPublicId = form.watch("bannerCldPubId");

    const setBannerImage = (
        file: UploadWidgetValue | null,
        field: { onChange: (value: string) => void }
    ) => {
        if (file) {
            field.onChange(file.url);
            form.setValue("bannerCldPubId", file.publicId, {
                shouldValidate: true,
                shouldDirty: true,
            });
        } else {
            field.onChange("");
            form.setValue("bannerCldPubId", "", {
                shouldValidate: true,
                shouldDirty: true,
            });
        }
    };

    const onSubmit = async (values: ClassFormValues) => {
        try {

            await onFinish(values);
        } catch (error) {
            console.log("error creating new class", error);
        }
    };

    return (
        <CreateView className="class-view">
            <Breadcrumb />

            <h1 className="page-title">Create a Class</h1>

            <div className="intro-row">
                <p>Provide the required information below to add a class.</p>

                <Button
                    type="button"
                    className="back-button"
                    onClick={() => back()}
                >
                    Go Back
                </Button>
            </div>

            <Separator />

            <div className="class-form-container">
                <Card className="class-form-card">
                    <CardHeader className="class-form-header">
                        <CardTitle className="class-form-title">
                            Fill out the form
                        </CardTitle>
                    </CardHeader>

                    <Separator />

                    <CardContent className="class-form-content">
                        <Form {...form}>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <FieldGroup>
                                    {/* Banner */}
                                    <FormField
                                        control={control}
                                        name="bannerUrl"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Banner Image{" "}
                                                    <span className="text-orange-600">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <UploadWidget
                                                        value={
                                                            field.value
                                                                ? {
                                                                    url: field.value,
                                                                    publicId: bannerPublicId ?? "",
                                                                }
                                                                : null
                                                        }
                                                        onChange={(file) =>
                                                            setBannerImage(file, field)
                                                        }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                                {errors.bannerCldPubId && !errors.bannerUrl && (
                                                    <p className="text-destructive text-sm">
                                                        {errors.bannerCldPubId.message?.toString()}
                                                    </p>
                                                )}
                                            </FormItem>
                                        )}
                                    />

                                    {/* Name */}
                                    <FormField
                                        control={control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Class Name{" "}
                                                    <span className="text-orange-600">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Introduction to Biology - section A"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Description */}
                                    <FormField
                                        control={control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Description{" "}
                                                    <span className="text-orange-600">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Short description of the class"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
                                        {/* Subject (numeric id) */}
                                        <FormField
                                            control={control}
                                            name="subjectId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Subject{" "}
                                                        <span className="text-orange-600">*</span>
                                                    </FormLabel>
                                                    <Select
                                                        onValueChange={(value) =>
                                                            field.onChange(Number(value))
                                                        }
                                                        value={
                                                            field.value
                                                                ? field.value.toString()
                                                                : ""
                                                        }
                                                        disabled={subjectLoading}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Select a subject" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {subjectsQuery.isError ? (
                                                                <div className="p-2 text-sm text-destructive">
                                                                    Failed to load subjects
                                                                </div>
                                                            ) : (
                                                                subjects.map((subject) => (
                                                                    <SelectItem
                                                                        key={subject.id}
                                                                        value={subject.id.toString()}
                                                                    >
                                                                        {subject.name} ({subject.code})
                                                                    </SelectItem>
                                                                ))
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Teacher (string id) */}
                                        <FormField
                                            control={control}
                                            name="teacherId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Teacher{" "}
                                                        <span className="text-orange-600">*</span>
                                                    </FormLabel>
                                                    <Select
                                                        onValueChange={(value) =>
                                                            field.onChange(value)
                                                        }
                                                        value={field.value ?? ""}
                                                        disabled={teacherLoading}
                                                    >

                                                        <FormControl>
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Select a teacher" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {teacherQuery.isError ? (
                                                                <div className="p-2 text-sm text-destructive">
                                                                    Failed to load teachers
                                                                </div>
                                                            ) : (
                                                                teachers.map((teacher) => (
                                                                    <SelectItem
                                                                        key={teacher.id}
                                                                        value={String(teacher.id)}
                                                                    >
                                                                        {teacher.name}
                                                                    </SelectItem>
                                                                ))
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Capacity */}
                                        <FormField
                                            control={control}
                                            name="capacity"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Capacity{" "}
                                                        <span className="text-orange-600">*</span>
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="30"
                                                            {...field}
                                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Status */}
                                        <FormField
                                            control={control}
                                            name="status"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Status{" "}
                                                        <span className="text-orange-600">*</span>
                                                    </FormLabel>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        value={field.value || "active"}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Select status" />

                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="active">Active</SelectItem>
                                                            <SelectItem value="inactive">Inactive</SelectItem>
                                                            <SelectItem value="archived">Archived</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? "Submitting..." : "Submit"}

                                    </Button>
                                </FieldGroup>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </CreateView>
    );
};

export default ClassCreate;